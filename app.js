import { MedicoService } from '/src/services/external/MedicoService.ts';
import { isAuthenticated, logout, getUserName } from '/src/state/authStore.ts';

(function () {
  "use strict";

  /* Sin sesión → pantalla de login. Se corta acá mismo, antes de montar
     nada del dashboard (evita el "flash" de contenido protegido). */
  if (!isAuthenticated()) {
    window.location.href = "auth-flow.html#/auth/login";
    return;
  }

  /* =====================================================================
     ROUTER (hash) — every drawer item maps to a route.
     Views with a real design render their content; the rest fall back to
     an honest "en construcción" placeholder (no invented data).
     ===================================================================== */
  /* Fuera del MVP (2026-07-05): Historias y evoluciones, Roles y permisos
     (+ Nuevo usuario, Detalle de usuario) y Mi perfil. Se quitan de ROUTES
     a propósito — parseRoute() ya cae en DEFAULT_ROUTE ("indicadores") para
     cualquier hash no reconocido, así que un acceso directo por URL a estas
     rutas redirige solo con este cambio, sin lógica extra. El HTML/CSS/JS
     de esas vistas queda intacto (ver comentario en index.html) por si
     vuelven después del MVP — solo hay que descomentar las líneas de abajo. */
  var ROUTES = {
    "indicadores":      { view: "indicadores",      nav: "indicadores" },
    // "roles-y-permisos": { view: "roles-y-permisos", nav: "roles-y-permisos" },
    // "roles-permisos":   { view: "nuevo-usuario",    nav: "roles-y-permisos" },
    // "usuario":          { view: "detalle-usuario",  nav: "roles-y-permisos" },
    "alertas":      { view: "alertas", nav: "alertas" },
    "seguimientos": { view: "seguimientos", nav: "seguimientos" },
    "seguimiento-detalle": { view: "seguimiento-detalle", nav: "seguimientos" },
    // "historias":    { view: "placeholder", nav: "historias",    title: "Historias",     icon: "description" },
    // "historias-y-evoluciones": { view: "historias-y-evoluciones", nav: "historias" },
    // "informacion-paciente": { view: "informacion-paciente", nav: "historias" },
    // "mi-perfil":    { view: "mi-perfil",   nav: "mi-perfil" },
    "bienvenida":   { view: "bienvenida",  nav: "indicadores" }
  };
  var DEFAULT_ROUTE = "indicadores";

  var app     = document.getElementById("app");
  var views   = document.querySelectorAll(".view");
  var navItems = document.querySelectorAll("#topHeader .nav-item");

  function parseRoute() {
    var h = (location.hash || "").replace(/^#\/?/, "").trim();
    return ROUTES[h] ? h : DEFAULT_ROUTE;
  }

  function applyRoute() {
    var raw = (location.hash || "").replace(/^#\/?/, "").trim();
    // Ruta fuera del MVP (o cualquier hash inválido): redirige de verdad —
    // actualiza la URL visible a Indicadores, no solo el contenido mostrado.
    if (raw && !ROUTES[raw]) {
      location.hash = "#/" + DEFAULT_ROUTE;
      return;
    }
    var key = parseRoute();
    var cfg = ROUTES[key];

    // swap visible view
    views.forEach(function (v) { v.classList.toggle("is-active", v.dataset.view === cfg.view); });

    // full-page route (Nuevo usuario · Bienvenida) hides the drawer
    app.classList.toggle("is-fullpage", cfg.view === "nuevo-usuario" || cfg.view === "bienvenida" || cfg.view === "informacion-paciente" || cfg.view === "seguimiento-detalle");
    if (cfg.view === "nuevo-usuario" && typeof window.__nuevoUsuarioReset === "function") {
      window.__nuevoUsuarioReset();
    }

    // sincroniza el saludo / nota de la pantalla de bienvenida con el usuario activo
    if (cfg.view === "bienvenida" && typeof window.__syncBienvenida === "function") {
      window.__syncBienvenida();
    }

    // user detail render
    if (cfg.view === "detalle-usuario" && typeof window.__renderUserDetail === "function") {
      window.__renderUserDetail();
    }

    // patient information render
    if (cfg.view === "informacion-paciente" && typeof window.__renderPaciente === "function") {
      window.__renderPaciente();
    }

    // seguimiento detail render
    if (cfg.view === "seguimiento-detalle" && typeof window.__renderSeguimientoDetalle === "function") {
      window.__renderSeguimientoDetalle();
    }

    // placeholder content
    if (cfg.view === "placeholder") {
      document.getElementById("placeholderTitle").textContent = cfg.title;
      document.getElementById("placeholderHeading").textContent = cfg.title + " en construcción";
      document.getElementById("placeholderIcon").textContent = cfg.icon;
    }

    // selected nav item
    navItems.forEach(function (n) { n.classList.toggle("sel", n.dataset.route === cfg.nav); });

    // reset scroll
    document.getElementById("main").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", applyRoute);

  /* shared checkbox glyph toggle */
  function toggleCbx(btn, on) {
    var glyph = btn.querySelector(".material-symbols-outlined");
    var checked = (on === undefined) ? !btn.classList.contains("checked") : on;
    btn.classList.toggle("checked", checked);
    glyph.textContent = checked ? "check_box" : "check_box_outline_blank";
  }

  /* =====================================================================
     Shared user store — única fuente de verdad para la tabla "Usuarios"
     y la pantalla "Detalle de usuario". Enriquece cada registro con datos
     de auditoría y métricas deterministas (seed = hash del nombre) y
     normaliza los roles a los 3 válidos: Médico · Médico administrador ·
     Administrador (Coordinador→Administrador, Enfermería→Médico).
     ===================================================================== */
  var SecuenceUserStore = (function () {
    var RAW = [
      { name: "Jesús Delgado",    email: "contactojesusdelgado@gmail.com", state: "activo",   role: "Administrador", date: "15 may. 2026" },
      { name: "Carlos Méndez",    email: "carlos.mendez@secuence.co",      state: "activo",   role: "Médico administrador", date: "12 may. 2026" },
      { name: "Valentina Ortiz",  email: "valentina.ortiz@secuence.co",    state: "activo",   role: "Coordinador",   date: "09 may. 2026" },
      { name: "Mariana López",    email: "mariana.lopez@secuence.co",      state: "inactivo", role: "Enfermería",    date: "02 may. 2026" },
      { name: "Andrés Beltrán",   email: "andres.beltran@secuence.co",     state: "activo",   role: "Médico",        date: "28 abr. 2026" },
      { name: "Camila Rojas",     email: "camila.rojas@secuence.co",       state: "activo",   role: "Médico",        date: "21 abr. 2026" },
      { name: "Sebastián Pérez",  email: "sebastian.perez@secuence.co",    state: "activo",   role: "Administrador", date: "17 abr. 2026" },
      { name: "Lucía Naranjo",    email: "lucia.naranjo@secuence.co",      state: "inactivo", role: "Médico",        date: "10 abr. 2026" },
      { name: "Tomás Quiroga",    email: "tomas.quiroga@secuence.co",      state: "activo",   role: "Médico",        date: "05 abr. 2026" },
      { name: "Daniela Castro",   email: "daniela.castro@secuence.co",     state: "activo",   role: "Coordinador",   date: "29 mar. 2026" },
      { name: "Mateo Salazar",    email: "mateo.salazar@secuence.co",      state: "activo",   role: "Médico",        date: "22 mar. 2026" },
      { name: "Paula Gómez",      email: "paula.gomez@secuence.co",        state: "inactivo", role: "Enfermería",    date: "14 mar. 2026" },
      { name: "Felipe Moreno",    email: "felipe.moreno@secuence.co",      state: "activo",   role: "Médico",        date: "08 mar. 2026" },
      { name: "Isabela Vargas",   email: "isabela.vargas@secuence.co",     state: "activo",   role: "Médico administrador", date: "01 mar. 2026" }
    ];
    var VALID    = { "Médico": 1, "Médico administrador": 1, "Administrador": 1 };
    var ROLE_MAP = { "Coordinador": "Administrador", "Enfermería": "Médico" };
    var ESPECS   = ["Cardiología", "Medicina interna", "Endocrinología", "Neumología", "Nefrología", "Pediatría", "Dermatología", "Ginecología", "Neurología"];
    var MESES    = ["ene.", "feb.", "mar.", "abr.", "may.", "jun."];

    /* Cifras de "Desempeño médico" (Indicadores). Vienen de la plataforma
       externa (pacientes/historias + médicos) — ver src/services/external/
       MedicoService.ts. Todavía no existe el contrato real, así que por
       ahora llega como datos de ejemplo; empieza vacío y se llena cuando
       resuelve la promesa más abajo. */
    var DESEMPENO = {};

    function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
    function rnd(seed, min, max) { var x = Math.sin(seed) * 10000; x = x - Math.floor(x); return Math.floor(min + x * (max - min + 1)); }
    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function fakeDate(seed) { return pad(rnd(seed, 1, 28)) + " " + MESES[rnd(seed >> 3, 0, 5)] + " 2026"; }
    function slug(name) { return name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

    function enrich(u, i) {
      var seed   = hash(u.name);
      var role   = VALID[u.role] ? u.role : (ROLE_MAP[u.role] || "Médico");
      var parts  = u.name.split(" ");
      var isMed  = role === "Médico" || role === "Médico administrador";
      var hasAdm = role === "Médico administrador" || role === "Administrador";
      var creados   = rnd(seed + 7, 5, 40);
      var inactivos = rnd(seed + 8, 0, Math.floor(creados / 3));
      return Object.assign({}, u, {
        role: role,
        id: "SC-" + (1000 + i),
        nombres: parts.slice(0, 1).join(" "),
        apellidos: parts.slice(1).join(" ") || "—",
        espec: isMed ? ESPECS[seed % ESPECS.length] : null,
        pais: "Colombia",
        tel: "+57 3" + rnd(seed + 13, 10, 29) + " " + rnd(seed + 14, 100, 999) + " " + rnd(seed + 15, 1000, 9999),
        web: isMed ? "www." + slug(u.name) + ".co" : null,
        licencia: isMed ? "RM-" + rnd(seed + 16, 10000, 99999) : null,
        createdBy: i === 0 ? "Sistema" : "Jesús Delgado",
        createdAt: u.date,
        updatedAt: fakeDate(seed + 20),
        lastAccess: u.state === "inactivo" ? "—" : fakeDate(seed + 25) + ", " + pad(rnd(seed + 26, 7, 19)) + ":" + pad(rnd(seed + 27, 0, 59)),
        clinical: isMed ? {
          pacientes:    rnd(seed + 1, 40, 130),
          alertas:      rnd(seed + 2, 0, 9),
          seguimientos: rnd(seed + 3, 15, 45),
          adherencia:   rnd(seed + 4, 80, 96),
          estudios:     rnd(seed + 5, 70, 92),
          nps:          rnd(seed + 6, 55, 82)
        } : null,
        admin: hasAdm ? {
          usuariosCreados:   creados,
          usuariosActivos:   creados - inactivos,
          usuariosInactivos: inactivos,
          permisos:          rnd(seed + 9, 20, 120),
          invitaciones:      rnd(seed + 10, 3, 25),
          reportes:          rnd(seed + 11, 10, 80),
          accesos:           rnd(seed + 12, 30, 200)
        } : null
      });
    }

    var users = RAW.map(enrich);
    var listeners = [];
    function emit() { listeners.forEach(function (f) { f(); }); }
    return {
      all: function () { return users; },
      get: function (i) { return users[i]; },
      desempeno: function () {
        return Object.keys(DESEMPENO).map(function (n) {
          for (var i = 0; i < users.length; i++) if (users[i].name === n) return users[i];
          return null;
        }).filter(Boolean);
      },
      remove: function (u) { var i = users.indexOf(u); if (i >= 0) { users.splice(i, 1); emit(); } },
      setState: function (u, s) { u.state = s; emit(); },
      refresh: function () { emit(); },
      onChange: function (fn) { listeners.push(fn); },
      /* Aplica las cifras de Desempeño médico llegadas de la plataforma
         externa (ver MedicoService) sobre el store de usuarios. */
      applyDesempeno: function (list) {
        list.forEach(function (d) {
          DESEMPENO[d.nombre] = {
            title: d.titulo, spec: d.especialidad,
            pacientes: d.pacientesAtendidos, alertas: d.alertasPorAtender,
            seguimientos: d.seguimientosEnCurso, adherencia: d.adherenciaTratamiento,
            estudios: d.estudiosRealizados, nps: d.nps
          };
        });
        users.forEach(function (u) {
          var d = DESEMPENO[u.name];
          if (!d) return;
          u.title = d.title;
          u.espec = d.spec;
          u.inDesempeno = true;
          u.clinical = {
            pacientes: d.pacientes, alertas: d.alertas, seguimientos: d.seguimientos,
            adherencia: d.adherencia, estudios: d.estudios, nps: d.nps
          };
        });
        emit();
      }
    };
  })();
  window.SecuenceUserStore = SecuenceUserStore;
  MedicoService.getDesempeno().then(function (data) { SecuenceUserStore.applyDesempeno(data); });

  /* =====================================================================
     VIEW · Indicadores — Desempeño médico table (unchanged behaviour)
     ===================================================================== */
  (function indicadores() {
    /* La tabla "Desempeño médico" lee del store (única fuente de verdad).
       Cada fila enlaza al usuario real para abrir "Detalle de usuario". */
    function buildDoctors() {
      return SecuenceUserStore.desempeno().map(function (u) {
        var c = u.clinical || {};
        return {
          u: u,
          name: (u.title ? u.title + " " : "") + u.name,
          spec: u.espec,
          pac: c.pacientes, alert: c.alertas, seg: c.seguimientos,
          adh: c.adherencia, est: c.estudios, nps: c.nps
        };
      });
    }
    var doctors = buildDoctors();
    var currentList = [];

    var rowsHost = document.getElementById("perfRows");
    var emptyEl  = document.getElementById("perfEmpty");
    var selectAll = document.getElementById("selectAll");

    function wireCheckboxes() {
      rowsHost.querySelectorAll(".cbx").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          toggleCbx(b);
          var row = b.closest(".t-row");
          if (row) row.classList.toggle("is-selected", b.classList.contains("checked"));
          syncSelectAll();
        };
      });
    }
    function syncSelectAll() {
      var all = rowsHost.querySelectorAll(".cbx");
      var checked = rowsHost.querySelectorAll(".cbx.checked").length;
      toggleCbx(selectAll, all.length > 0 && checked === all.length);
    }
    function renderRows(list) {
      currentList = list;
      rowsHost.innerHTML = list.map(function (d) {
        return '' +
        '<div class="t-grid t-row" style="border-radius:0">' +
          '<div class="t-check"><button class="cbx" aria-label="Seleccionar"><span class="material-symbols-outlined">check_box_outline_blank</span></button></div>' +
          '<div class="cell-name"><span class="t">' + d.name + '</span><span class="s">' + d.spec + '</span></div>' +
          '<div class="cell-num">' + d.pac + '</div>' +
          '<div class="cell-num">' + d.alert + '</div>' +
          '<div class="cell-num">' + d.seg + '</div>' +
          '<div class="cell-num">' + d.adh + '%</div>' +
          '<div class="cell-num">' + d.est + '%</div>' +
          '<div class="cell-num">' + d.nps + '</div>' +
          '<div class="cell-act"><button class="ver-mas">Ver más</button></div>' +
        '</div>';
      }).join("");
      emptyEl.style.display = list.length ? "none" : "block";
      wireCheckboxes();
    }

    selectAll.addEventListener("click", function () {
      var makeChecked = !selectAll.classList.contains("checked");
      toggleCbx(selectAll, makeChecked);
      rowsHost.querySelectorAll(".cbx").forEach(function (b) {
        toggleCbx(b, makeChecked);
        var row = b.closest(".t-row");
        if (row) row.classList.toggle("is-selected", makeChecked);
      });
    });

    renderRows(doctors);

    /* Toda la fila (o "Ver más") abre la modal de métricas del médico */
    rowsHost.addEventListener("click", function (e) {
      if (e.target.closest(".cbx")) return;
      var row = e.target.closest(".t-row");
      if (!row) return;
      var idx = Array.prototype.indexOf.call(rowsHost.children, row);
      var item = currentList[idx];
      if (item && item.u && window.__openMetricsModal) window.__openMetricsModal(item.u);
    });

    /* Re-render si el store cambia (estado / edición / eliminación desde el detalle) */
    SecuenceUserStore.onChange(function () {
      var q = sInput.value.trim().toLowerCase();
      var base = buildDoctors();
      doctors = base;
      renderRows(!q ? base : base.filter(function (d) {
        return d.name.toLowerCase().indexOf(q) !== -1 || (d.spec || "").toLowerCase().indexOf(q) !== -1;
      }));
    });

    /* búsqueda */
    var sWrap  = document.getElementById("search");
    var sInput = document.getElementById("searchInput");
    var sTrail = document.getElementById("searchTrail");
    function applyFilter() {
      var q = sInput.value.trim().toLowerCase();
      sTrail.querySelector(".material-symbols-outlined").textContent = q ? "close" : "search";
      var base = buildDoctors();
      doctors = base;
      if (!q) { renderRows(base); return; }
      renderRows(base.filter(function (d) {
        return d.name.toLowerCase().indexOf(q) !== -1 || (d.spec || "").toLowerCase().indexOf(q) !== -1;
      }));
    }
    sInput.addEventListener("input", applyFilter);
    sInput.addEventListener("focus", function () { sWrap.classList.add("is-focused"); });
    sInput.addEventListener("blur",  function () { sWrap.classList.remove("is-focused"); });
    sTrail.addEventListener("click", function () {
      if (sInput.value) { sInput.value = ""; applyFilter(); }
      sInput.focus();
    });
  })();

  /* =====================================================================
     VIEW · Roles y permisos — Usuarios table + footer pagination
     ===================================================================== */
  (function roles() {
    var users = SecuenceUserStore.all();

    var rowsHost  = document.getElementById("rolesRows");
    var emptyEl   = document.getElementById("rolesEmpty");
    var selectAll = document.getElementById("rolesSelectAll");
    var rangeEl   = document.getElementById("rolesRange");

    var pageSize = 10;
    var page = 1;
    var filtered = users.slice();
    var currentList = [];

    function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    function stateChip(state) {
      return state === "inactivo"
        ? '<span class="status-chip is-inactive">Inactivo</span>'
        : '<span class="status-chip is-active">Activo</span>';
    }

    function wireCheckboxes() {
      rowsHost.querySelectorAll(".cbx").forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          toggleCbx(b);
          var row = b.closest(".u-row");
          if (row) row.classList.toggle("is-selected", b.classList.contains("checked"));
          syncSelectAll();
        };
      });
    }
    function syncSelectAll() {
      var all = rowsHost.querySelectorAll(".cbx");
      var checked = rowsHost.querySelectorAll(".cbx.checked").length;
      toggleCbx(selectAll, all.length > 0 && checked === all.length);
    }

    function pageSlice() {
      var start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }

    function renderRows() {
      var list = currentList = pageSlice();
      rowsHost.innerHTML = list.map(function (u) {
        return '' +
        '<div class="u-grid u-row">' +
          '<div class="t-check"><button class="cbx" aria-label="Seleccionar"><span class="material-symbols-outlined">check_box_outline_blank</span></button></div>' +
          '<div class="u-cell user">' + esc(u.name) + '</div>' +
          '<div class="u-cell email">' + esc(u.email) + '</div>' +
          '<div class="u-cell state">' + stateChip(u.state) + '</div>' +
          '<div class="u-cell role">' + esc(u.role) + '</div>' +
          '<div class="u-cell date">' + esc(u.date) + '</div>' +
          '<div class="u-cell act"><button class="u-edit">Ver</button></div>' +
        '</div>';
      }).join("");
      emptyEl.style.display = list.length ? "none" : "block";
      wireCheckboxes();
      toggleCbx(selectAll, false);
    }

    function renderFooter() {
      var total = filtered.length;
      if (total === 0) {
        rangeEl.textContent = "0 de 0";
      } else {
        var start = (page - 1) * pageSize + 1;
        var end = Math.min(page * pageSize, total);
        rangeEl.textContent = start + "–" + end + " de " + total;
      }
      var totalPages = Math.max(1, Math.ceil(total / pageSize));
      var atFirst = page <= 1;
      var atLast = page >= totalPages;
      document.getElementById("pgFirst").disabled = atFirst;
      document.getElementById("pgPrev").disabled  = atFirst;
      document.getElementById("pgNext").disabled  = atLast;
      document.getElementById("pgLast").disabled  = atLast;
    }

    function render() { renderRows(); renderFooter(); }

    function goTo(p) {
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(Math.max(1, p), totalPages);
      render();
    }

    document.getElementById("pgFirst").addEventListener("click", function () { goTo(1); });
    document.getElementById("pgPrev").addEventListener("click",  function () { goTo(page - 1); });
    document.getElementById("pgNext").addEventListener("click",  function () { goTo(page + 1); });
    document.getElementById("pgLast").addEventListener("click",  function () { goTo(Math.ceil(filtered.length / pageSize)); });

    /* select-all on the current page */
    selectAll.addEventListener("click", function () {
      var makeChecked = !selectAll.classList.contains("checked");
      toggleCbx(selectAll, makeChecked);
      rowsHost.querySelectorAll(".cbx").forEach(function (b) {
        toggleCbx(b, makeChecked);
        var row = b.closest(".u-row");
        if (row) row.classList.toggle("is-selected", makeChecked);
      });
    });

    /* page-size select (Input · Select) */
    var ps      = document.getElementById("pageSize");
    var psBtn   = ps.querySelector(".ps-select");
    var psValue = document.getElementById("pageSizeValue");
    var psMenu  = document.getElementById("pageSizeMenu");

    function closeMenu() { ps.classList.remove("is-open"); psBtn.setAttribute("aria-expanded", "false"); }
    psBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = ps.classList.toggle("is-open");
      psBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    psMenu.querySelectorAll(".ps-item").forEach(function (item) {
      item.addEventListener("click", function () {
        pageSize = parseInt(item.dataset.size, 10);
        psValue.textContent = item.dataset.size;
        psMenu.querySelectorAll(".ps-item").forEach(function (i) { i.classList.remove("is-selected"); });
        item.classList.add("is-selected");
        page = 1;
        render();
        closeMenu();
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#pageSize")) closeMenu();
    });

    /* búsqueda (nombre · correo · rol) */
    var sWrap  = document.getElementById("rolesSearch");
    var sInput = document.getElementById("rolesSearchInput");
    var sTrail = document.getElementById("rolesSearchTrail");
    function applyFilter() {
      var q = sInput.value.trim().toLowerCase();
      sTrail.querySelector(".material-symbols-outlined").textContent = q ? "close" : "search";
      filtered = !q ? users.slice() : users.filter(function (u) {
        return u.name.toLowerCase().indexOf(q) !== -1 ||
               u.email.toLowerCase().indexOf(q) !== -1 ||
               u.role.toLowerCase().indexOf(q) !== -1;
      });
      page = 1;
      render();
    }
    sInput.addEventListener("input", applyFilter);
    sInput.addEventListener("focus", function () { sWrap.classList.add("is-focused"); });
    sInput.addEventListener("blur",  function () { sWrap.classList.remove("is-focused"); });
    sTrail.addEventListener("click", function () {
      if (sInput.value) { sInput.value = ""; applyFilter(); }
      sInput.focus();
    });

    /* Fila o botón "Editar" → abre la pantalla de detalle del usuario */
    rowsHost.addEventListener("click", function (e) {
      if (e.target.closest(".cbx")) return;
      var row = e.target.closest(".u-row");
      if (!row) return;
      var idx = Array.prototype.indexOf.call(rowsHost.children, row);
      var u = currentList[idx];
      if (u) { window.__detailUser = u; location.hash = "#/usuario"; }
    });

    /* Re-render cuando el store cambia (estado / eliminación desde el detalle) */
    SecuenceUserStore.onChange(function () {
      var q = sInput.value.trim().toLowerCase();
      filtered = !q ? users.slice() : users.filter(function (u) {
        return u.name.toLowerCase().indexOf(q) !== -1 ||
               u.email.toLowerCase().indexOf(q) !== -1 ||
               u.role.toLowerCase().indexOf(q) !== -1;
      });
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      if (page > totalPages) page = totalPages;
      render();
    });

    render();
  })();

  /* =====================================================================
     VIEW · Nuevo usuario (#/roles-permisos)
     Reglas de negocio (Documentación Permisos):
       · Médico administrador → todos checked + disabled.
       · Médico → permisos base checked+disabled; los 4 elevables
         (Ver desempeño de otros médicos + Administración) unchecked y
         seleccionables. Si los marca todos, el rol muestra
         "Médico administrador" pero quedan editables; al desmarcar uno
         vuelve a "Médico".
       · Administrador → Analítica y métricas + Administración
         checked+disabled; el resto unchecked + disabled.
     Campos médicos (Licencia / Foto) sólo para Médico o Médico admin.
     ===================================================================== */
  (function nuevoUsuario() {
    var ELEVATED    = ["ana-desempeno", "adm-crear", "adm-eliminar", "adm-asignar"];
    var ADMIN_GROUPS = ["analitica", "administracion"];
    var ROLE_LABEL  = {
      "medico-administrador": "Médico administrador",
      "medico":              "Médico",
      "administrador":        "Administrador"
    };

    var view = document.querySelector('.view[data-view="nuevo-usuario"]');
    if (!view) return;

    var rolWrap   = document.getElementById("nuRol");
    var rolTrig   = document.getElementById("nuRolTrigger");
    var rolValue  = document.getElementById("nuRolValue");
    var rolMenu   = document.getElementById("nuRolMenu");
    var medico    = document.getElementById("nuMedico");
    var checks    = Array.prototype.slice.call(view.querySelectorAll(".perm-check"));

    var currentRole = "medico";
    var elevated = {}; ELEVATED.forEach(function (k) { elevated[k] = false; });

    function isElevated(key) { return ELEVATED.indexOf(key) !== -1; }

    function stateFor(btn) {
      var key = btn.dataset.perm, group = btn.dataset.group;
      if (currentRole === "medico-administrador") return { checked: true, disabled: true };
      if (currentRole === "administrador") {
        var on = ADMIN_GROUPS.indexOf(group) !== -1;
        return { checked: on, disabled: true };
      }
      /* medico */
      if (isElevated(key)) return { checked: !!elevated[key], disabled: false };
      return { checked: true, disabled: true };
    }

    function allElevatedChecked() {
      return ELEVATED.every(function (k) { return elevated[k]; });
    }

    function displayRole() {
      if (currentRole === "medico" && allElevatedChecked()) return "medico-administrador";
      return currentRole;
    }

    function render() {
      checks.forEach(function (btn) {
        var st = stateFor(btn);
        var glyph = btn.querySelector(".material-symbols-outlined");
        btn.classList.toggle("checked", st.checked);
        btn.classList.toggle("is-disabled", st.disabled);
        btn.disabled = st.disabled;
        glyph.textContent = st.checked ? "check_box" : "check_box_outline_blank";
        btn.setAttribute("aria-checked", st.checked ? "true" : "false");
      });

      var shown = displayRole();
      rolValue.textContent = ROLE_LABEL[shown];
      rolMenu.querySelectorAll(".nu-opt").forEach(function (o) {
        o.classList.toggle("is-selected", o.dataset.role === shown);
      });

      var medicoVisible = (currentRole === "medico" || currentRole === "medico-administrador");
      medico.hidden = !medicoVisible;
    }

    /* selecting a role explicitly applies its canonical state */
    function selectRole(role) {
      currentRole = role;
      ELEVATED.forEach(function (k) { elevated[k] = false; });
      render();
    }

    /* toggle a permission (only enabled = elevated médico checkboxes) */
    checks.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        var key = btn.dataset.perm;
        if (currentRole === "medico" && isElevated(key)) {
          elevated[key] = !elevated[key];
          render();
        }
      });
    });

    /* Rol · Input Select dropdown */
    var rolIcon = document.getElementById("nuRolIcon");
    function closeRol() {
      rolWrap.classList.remove("is-open");
      rolTrig.setAttribute("aria-expanded", "false");
      if (rolIcon) rolIcon.textContent = "arrow_drop_down";
    }
    rolTrig.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = rolWrap.classList.toggle("is-open");
      rolTrig.setAttribute("aria-expanded", open ? "true" : "false");
      if (rolIcon) rolIcon.textContent = open ? "arrow_drop_up" : "arrow_drop_down";
    });
    rolTrig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rolTrig.click(); }
    });
    rolMenu.querySelectorAll(".nu-opt").forEach(function (opt) {
      opt.addEventListener("click", function () { selectRole(opt.dataset.role); closeRol(); });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#nuRol")) closeRol();
    });

    /* File uploader (Foto de licencia o título) */
    var drop      = document.getElementById("nuDrop");
    var fileInput = document.getElementById("nuFileInput");
    var filesHost = document.getElementById("nuFiles");
    var files = [];

    function fmtSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    }
    function kind(name) {
      return /\.pdf$/i.test(name) ? "pdf" : "jpg";
    }
    function renderFiles() {
      filesHost.innerHTML = files.map(function (f, i) {
        var k = kind(f.name);
        return '' +
        '<div class="nu-file">' +
          '<div class="thumb ' + k + '">' + k.toUpperCase() + '</div>' +
          '<div class="meta">' +
            '<div class="name">' + f.name.replace(/</g, "&lt;") + '</div>' +
            '<div class="size">' + fmtSize(f.size) + ' · subido</div>' +
          '</div>' +
          '<button class="rm" type="button" data-i="' + i + '" aria-label="Quitar archivo"><span class="material-symbols-outlined">close</span></button>' +
        '</div>';
      }).join("");
      filesHost.querySelectorAll(".rm").forEach(function (b) {
        b.addEventListener("click", function () {
          files.splice(parseInt(b.dataset.i, 10), 1);
          renderFiles();
        });
      });
    }
    function addFiles(list) {
      Array.prototype.forEach.call(list, function (f) {
        if (/\.(pdf|jpe?g)$/i.test(f.name)) files.push({ name: f.name, size: f.size });
      });
      renderFiles();
    }
    drop.addEventListener("click", function () { fileInput.click(); });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener("change", function () { addFiles(fileInput.files); fileInput.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-dragover"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-dragover"); });
    });
    drop.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });

    /* Back / Cancelar → vuelven a la lista "Roles y permisos" (la pantalla
       justo encima de "Nuevo usuario"). Un único handler para ambos: la
       flecha "<" del encabezado y el botón "Cancelar" del pie hacen
       exactamente lo mismo, de forma determinista (sin depender del
       historial, que podía variar según cómo se llegó al formulario). */
    function goBack() {
      location.hash = "#/roles-y-permisos";
    }
    document.getElementById("nuBack").addEventListener("click", goBack);
    document.getElementById("nuCancelar").addEventListener("click", goBack);

    /* ── Validación + diálogos (DS · System status) ──────────────────── */
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var VALIDATED = [
      { ff: "ffNombres",   input: "nuNombres",   sup: "supNombres",
        empty: "Ingrese los nombres." },
      { ff: "ffApellidos", input: "nuApellidos", sup: "supApellidos",
        empty: "Ingrese los apellidos." },
      { ff: "ffCorreo",    input: "nuCorreo",    sup: "supCorreo",
        empty: "Ingrese el correo.", invalid: "Ingrese un correo válido (nombre@dominio)." }
    ];

    function setFieldError(cfg, msg) {
      var ff = document.getElementById(cfg.ff);
      var sup = document.getElementById(cfg.sup);
      if (ff) ff.classList.add("is-error");
      if (sup) { sup.textContent = msg; sup.hidden = false; }
    }
    function clearFieldError(cfg) {
      var ff = document.getElementById(cfg.ff);
      var sup = document.getElementById(cfg.sup);
      if (ff) ff.classList.remove("is-error");
      if (sup) { sup.textContent = ""; sup.hidden = true; }
    }
    function clearAllErrors() { VALIDATED.forEach(clearFieldError); }

    /* limpiar el error de un campo en cuanto el usuario lo corrige */
    VALIDATED.forEach(function (cfg) {
      var input = document.getElementById(cfg.input);
      if (input) input.addEventListener("input", function () { clearFieldError(cfg); });
    });

    function validate() {
      clearAllErrors();
      var firstBad = null;
      VALIDATED.forEach(function (cfg) {
        var input = document.getElementById(cfg.input);
        var val = (input && input.value || "").trim();
        var bad = false;
        if (!val) { setFieldError(cfg, cfg.empty); bad = true; }
        else if (cfg.invalid && !EMAIL_RE.test(val)) { setFieldError(cfg, cfg.invalid); bad = true; }
        if (bad && !firstBad) firstBad = cfg;
      });
      return firstBad;
    }

    function copyDemoLink() {
      /* Enlace de onboarding del usuario invitado → paso 1 del flujo
         "Configuración de cuenta" (auth-flow.html#/invitacion/configuracion-cuenta).
         De momento es estático; en el futuro será un enlace dinámico con
         token de invitación y demás prácticas de seguridad. */
      var link;
      try {
        link = new URL("auth-flow.html#/invitacion/configuracion-cuenta", location.href).href;
      } catch (e) {
        link = "auth-flow.html#/invitacion/configuracion-cuenta";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link)["catch"](function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = link; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      }
    }

    document.getElementById("nuCrear").addEventListener("click", function () {
      var firstBad = validate();
      if (firstBad) {
        /* Campos en error + modal Warning del DS */
        window.openStatusDialog({
          type: "warning", icon: "back_hand",
          title: "No se pudo crear el usuario",
          desc: "Hay campos obligatorios sin completar o con errores. Revíselos e inténtelo de nuevo.",
          buttons: [
            { label: "Cancelar", variant: "text" },
            { label: "Revisar campos", variant: "tonal", onClick: function () {
                var input = document.getElementById(firstBad.input);
                if (input) setTimeout(function () { try { input.focus(); } catch (e) {} }, 80);
              } }
          ]
        });
        return;
      }
      /* Éxito → modal Success del DS */
      window.openStatusDialog({
        type: "success", icon: "check_circle",
        title: "¡Usuario creado con éxito!",
        desc: "Hemos notificado al usuario vía correo electrónico. También puedes copiar y enviarle enlace de inicio de sesión.",
        buttons: [
          { label: "Copiar enlace", variant: "text", keepOpen: true, onClick: function (btn, lbl) {
              copyDemoLink();
              lbl.textContent = "Enlace copiado";
              clearTimeout(btn.__copyT);
              btn.__copyT = setTimeout(function () { lbl.textContent = "Copiar enlace"; }, 2000);
              return true; /* mantener la modal abierta */
            } },
          { label: "Aceptar", variant: "tonal", onClick: function () {
              window.__nuevoUsuarioReset();
              goBack();
            } }
        ]
      });
    });

    /* reset cuando se entra a la vista */
    window.__nuevoUsuarioReset = function () {
      currentRole = "medico";
      ELEVATED.forEach(function (k) { elevated[k] = false; });
      files = [];
      ["nuNombres", "nuApellidos", "nuCorreo", "nuLicencia"].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = "";
      });
      clearAllErrors();
      renderFiles();
      closeRol();
      render();
    };

    render();
  })();

  /* "Crear usuario" (tabla Roles y permisos) → formulario Nuevo usuario */
  (function () {
    var btn = document.getElementById("crearUsuario");
    if (btn) btn.addEventListener("click", function () { location.hash = "#/roles-permisos"; });
  })();

  /* Card "Administración del equipo" → toda la tarjeta navega a #/roles-permisos */
  (function () {
    var card = document.querySelector(".team-card[data-href]");
    if (!card) return;
    function go() { location.hash = card.dataset.href; }
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return; /* deja pasar el botón interno */
      go();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  })();

  /* Card "Próximos seguimientos" (Indicadores) → toda la tarjeta, incluido
     "Ver todos" (no tiene acción propia), navega a #/seguimientos. */
  (function () {
    var card = document.querySelector(".card-action[data-href]");
    if (!card) return;
    function go() { location.hash = card.dataset.href; }
    card.addEventListener("click", go);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  })();

  /* Nombre real del usuario autenticado (claim "name" del token) en la
     tarjeta del drawer. Si por algo no está disponible, deja el texto que
     ya trae el diseño en vez de mostrar algo vacío o inventado. */
  (function () {
    var name = getUserName();
    if (!name) return;
    var nameEl = document.querySelector(".nav-user .name");
    var avatarEl = document.querySelector(".nav-user .avatar");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) {
      var initials = name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
      if (initials) avatarEl.textContent = initials;
    }
  })();

  /* Tarjeta de usuario (drawer): TODA la tarjeta cierra sesión, no solo el
     ícono — avatar, nombre, rol e ícono disparan el mismo logout real
     (borra el token) + redirección al login. */
  (function () {
    var card = document.querySelector(".nav-user");
    if (!card) return;
    function go() {
      logout();
      window.location.href = "auth-flow.html#/auth/login";
    }
    card.addEventListener("click", go);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  })();

  /* =====================================================================
     Dialog · System status (DS)  — reusable modal controller.
     openStatusDialog({ type, icon, title, desc, buttons:[{label, variant,
       icon, onClick, keepOpen}] }).  variant: "text" | "tonal".
     ===================================================================== */
  var dlgScrim  = document.getElementById("dlgScrim");
  var dlgCard   = document.getElementById("dlgCard");
  var dlgIconEl = document.getElementById("dlgIcon");
  var dlgTitle  = document.getElementById("dlgTitle");
  var dlgDesc   = document.getElementById("dlgDesc");
  var dlgFooter = document.getElementById("dlgFooter");
  var dlgClose  = document.getElementById("dlgClose");
  var dlgLastFocus = null;

  function closeStatusDialog() {
    dlgScrim.classList.remove("is-open");
    dlgScrim.setAttribute("aria-hidden", "true");
    if (dlgLastFocus && dlgLastFocus.focus) { try { dlgLastFocus.focus(); } catch (e) {} }
  }

  function openStatusDialog(opts) {
    opts = opts || {};
    dlgLastFocus = document.activeElement;
    var noIcon = !opts.icon;
    dlgCard.className = "dlg is-" + (opts.type || "info") + (noIcon ? " dlg--no-icon" : "");
    dlgIconEl.textContent = opts.icon || "info";
    dlgTitle.textContent  = opts.title || "";
    /* opts.html permite un cuerpo enriquecido (p. ej. checkbox de declaración);
       si no, se usa texto plano via textContent. */
    if (opts.html != null) dlgDesc.innerHTML = opts.html;
    else dlgDesc.textContent = opts.desc || "";

    dlgFooter.innerHTML = "";
    (opts.buttons || []).forEach(function (b) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = b.variant === "tonal" ? "bt-tonal" : "bt-text";
      if (b.icon) {
        var ic = document.createElement("span");
        ic.className = "material-symbols-outlined";
        ic.textContent = b.icon;
        btn.appendChild(ic);
      }
      var lbl = document.createElement("span");
      lbl.textContent = b.label || "";
      btn.appendChild(lbl);
      btn.addEventListener("click", function () {
        var keep = b.onClick && b.onClick(btn, lbl);
        if (!keep && !b.keepOpen) closeStatusDialog();
      });
      dlgFooter.appendChild(btn);
    });

    dlgScrim.classList.add("is-open");
    dlgScrim.setAttribute("aria-hidden", "false");
    /* onOpen permite cablear listeners sobre el cuerpo enriquecido recién
       insertado (checkbox, etc.) antes de devolver el control. */
    if (typeof opts.onOpen === "function") opts.onOpen(dlgCard);
    var firstBtn = dlgFooter.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }

  /* expose for other modules + close wiring */
  window.openStatusDialog = openStatusDialog;
  window.closeStatusDialog = closeStatusDialog;
  dlgClose.addEventListener("click", closeStatusDialog);
  dlgScrim.addEventListener("click", function (e) { if (e.target === dlgScrim) closeStatusDialog(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dlgScrim.classList.contains("is-open")) closeStatusDialog();
  });

  /* =====================================================================
     VIEW · Bienvenida — apertura desde la alerta de Indicadores, saludo
     según el usuario activo y navegación de regreso a Indicadores.
     ===================================================================== */
  (function bienvenida() {
    /* La alerta "¡Bienvenido al sistema de seguimiento Secuence!" abre la
       pantalla de bienvenida (sólo Médico / Médico administrador). */
    var alertEl = document.getElementById("welcomeAlert");
    if (alertEl) {
      function openWelcome() { location.hash = "#/bienvenida"; }
      alertEl.addEventListener("click", openWelcome);
      alertEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openWelcome(); }
      });
    }

    /* Flecha de regreso + "Ver indicadores" → vuelven a Indicadores. */
    function goIndicadores() { location.hash = "#/indicadores"; }
    var back = document.getElementById("wlcBack");
    if (back) back.addEventListener("click", goIndicadores);
    var backAdmin = document.getElementById("wlcBackAdmin");
    if (backAdmin) backAdmin.addEventListener("click", goIndicadores);
    var verInd = document.getElementById("wlcGoIndicadores");
    if (verInd) verInd.addEventListener("click", goIndicadores);

    /* "Completar perfil" → Mi perfil. */
    var goPerfil = document.getElementById("wlcGoPerfil");
    if (goPerfil) goPerfil.addEventListener("click", function () { location.hash = "#/mi-perfil"; });

    /* "Agregar paciente" → Historias. */
    var goPaciente = document.getElementById("wlcGoPaciente");
    if (goPaciente) goPaciente.addEventListener("click", function () { location.hash = "#/historias"; });

    /* "Configurar seguimiento" → Seguimientos. */
    var goSeg = document.getElementById("wlcGoSeguimiento");
    if (goSeg) goSeg.addEventListener("click", function () { location.hash = "#/seguimientos"; });

    /* Administrador · "Completar información" → Mi perfil. */
    var admCompletar = document.getElementById("wlcAdmCompletar");
    if (admCompletar) admCompletar.addEventListener("click", function () { location.hash = "#/mi-perfil"; });

    /* Administrador · "Agregar usuario" → Nuevo usuario. */
    var admUsuario = document.getElementById("wlcAdmUsuario");
    if (admUsuario) admUsuario.addEventListener("click", function () { location.hash = "#/roles-permisos"; });

    /* Administrador · "Ver indicadores" → Indicadores. */
    var admIndicadores = document.getElementById("wlcAdmIndicadores");
    if (admIndicadores) admIndicadores.addEventListener("click", goIndicadores);

    /* ── Tweak de rol (persistido vía host) ──
       Médico y Médico administrador comparten la variante "medico"
       (sólo cambia la nota de Desempeño médico); Administrador usa
       su propia variante. */
    var WLC_TWEAKS = /*EDITMODE-BEGIN*/{
      "role": "Médico"
    }/*EDITMODE-END*/;

    var ROLES = ["Médico", "Médico administrador", "Administrador"];

    function applyRole(role) {
      var isAdmin = (role === "Administrador");
      var med = document.getElementById("wlcMedico");
      var adm = document.getElementById("wlcAdmin");
      if (med) med.hidden = isAdmin;
      if (adm) adm.hidden = !isAdmin;

      /* Nota de "Desempeño médico" sólo en la variante médico. */
      var noteEl = document.getElementById("wlcNote");
      if (noteEl) {
        noteEl.textContent = (role === "Médico administrador")
          ? ""
          : " (disponible según permisos asignados)";
      }
      /* refleja el estado en el panel si está montado */
      var panel = document.getElementById("wlcTweaks");
      if (panel) {
        panel.querySelectorAll(".tw-seg-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.role === role));
        });
      }
    }

    /* Saludo según el usuario activo (drawer) + aplica el rol del Tweak. */
    window.__syncBienvenida = function () {
      var nameSrc = document.querySelector(".nav-user .name");
      var name = nameSrc ? nameSrc.textContent.trim() : "Dr. Carlos Méndez";
      var n1 = document.getElementById("wlcName");
      var n2 = document.getElementById("wlcNameAdmin");
      if (n1) n1.textContent = name;
      if (n2) n2.textContent = name;
      applyRole(WLC_TWEAKS.role);
    };

    applyRole(WLC_TWEAKS.role);

    /* ── Panel de Tweaks (switch de rol) ── */
    function setupTweaks() {
      if (document.getElementById("wlcTweaks")) return;
      var panel = document.createElement("div");
      panel.id = "wlcTweaks";
      panel.setAttribute("hidden", "");
      var seg = ROLES.map(function (r) {
        return '<button type="button" class="tw-seg-btn" data-role="' + r + '"' +
               ' aria-pressed="' + String(r === WLC_TWEAKS.role) + '">' +
               '<span class="tw-dot"></span>' + r + '</button>';
      }).join("");
      panel.innerHTML =
        '<div class="tw-head">' +
          '<span class="tw-title">Tweaks</span>' +
          '<button type="button" class="tw-close" id="wlcTwClose" aria-label="Cerrar Tweaks">' +
            '<span class="material-symbols-outlined">close</span></button>' +
        '</div>' +
        '<div class="tw-body">' +
          '<span class="tw-label">Rol de la vista</span>' +
          '<div class="tw-seg">' + seg + '</div>' +
          '<span class="tw-hint">Médico y Médico administrador comparten la misma vista; sólo cambia la nota de Desempeño médico. Administrador muestra la vista de organización.</span>' +
        '</div>';
      document.body.appendChild(panel);

      panel.querySelectorAll(".tw-seg-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var role = btn.dataset.role;
          WLC_TWEAKS.role = role;
          applyRole(role);
          try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { role: role } }, "*"); } catch (_) {}
        });
      });
      panel.querySelector("#wlcTwClose").addEventListener("click", function () {
        panel.setAttribute("hidden", "");
        try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (_) {}
      });

      window.addEventListener("message", function (e) {
        var t = e.data && e.data.type;
        if (t === "__activate_edit_mode") { panel.removeAttribute("hidden"); }
        else if (t === "__deactivate_edit_mode") { panel.setAttribute("hidden", ""); }
      });
      try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (_) {}
    }
    setupTweaks();
  })();

  /* =====================================================================
     VIEW · Historias y evoluciones — lista de pacientes + paginación/búsqueda
     Datos de ejemplo (no hay fuente real definida). Sin navegación por fila.
     ===================================================================== */
  (function historias() {
    var rowsHost = document.getElementById("heRows");
    if (!rowsHost) return;
    var emptyEl  = document.getElementById("heEmpty");
    var rangeEl  = document.getElementById("heRange");

    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    /* Datos de ejemplo realistas (es-CO). photo=true → placeholder de foto. */
    var PACIENTES = [
      { name: "María Fernanda Gómez",   date: "12 may. 2026", base: "Hipertensión arterial",        dx: "Crisis hipertensiva",            photo: true },
      { name: "Luisa Bermúdez",         date: "08 may. 2026", base: "Diabetes mellitus tipo 2",      dx: "Hiperglucemia no controlada",    photo: false },
      { name: "Andrés Felipe Rojas",    date: "05 may. 2026", base: "EPOC",                          dx: "Exacerbación de EPOC",           photo: true },
      { name: "Diana Carolina Ruiz",    date: "02 may. 2026", base: "Asma",                          dx: "Bronquitis aguda",               photo: true },
      { name: "Santiago Vargas",        date: "28 abr. 2026", base: "Insuficiencia cardíaca",        dx: "Descompensación cardíaca",       photo: true },
      { name: "Laura Bonilla",          date: "25 abr. 2026", base: "Hipotiroidismo",                dx: "Hipotiroidismo subclínico",      photo: false },
      { name: "Lucía Beltrán",          date: "21 abr. 2026", base: "Artritis reumatoide",           dx: "Brote articular",                photo: false },
      { name: "Mateo Herrera",          date: "18 abr. 2026", base: "Enfermedad renal crónica",      dx: "ERC estadio 3",                  photo: true },
      { name: "Laura Sofía Mendoza",    date: "15 abr. 2026", base: "Migraña crónica",               dx: "Cefalea tensional",              photo: false },
      { name: "Liliana Beltrán",        date: "11 abr. 2026", base: "Dislipidemia",                  dx: "Hipercolesterolemia",            photo: false },
      { name: "Paula Andrea Castro",    date: "08 abr. 2026", base: "Hipertensión arterial",         dx: "Presión arterial elevada",       photo: true },
      { name: "Juan David Ramírez",     date: "04 abr. 2026", base: "Diabetes mellitus tipo 2",      dx: "Neuropatía diabética",           photo: true },
      { name: "Valentina Ospina",       date: "01 abr. 2026", base: "Asma",                          dx: "Asma persistente leve",          photo: false },
      { name: "Sebastián Morales",      date: "27 mar. 2026", base: "EPOC",                          dx: "Disnea de esfuerzo",             photo: true },
      { name: "Camila Restrepo",        date: "23 mar. 2026", base: "Hipotiroidismo",                dx: "TSH elevada",                    photo: true },
      { name: "Felipe Andrés Niño",     date: "20 mar. 2026", base: "Gastritis crónica",             dx: "Dispepsia funcional",            photo: false },
      { name: "Daniela Quintero",       date: "16 mar. 2026", base: "Anemia ferropénica",            dx: "Anemia leve",                    photo: true },
      { name: "Nicolás Cárdenas",       date: "12 mar. 2026", base: "Hipertensión arterial",         dx: "HTA controlada",                 photo: false },
      { name: "Sara Gutiérrez",         date: "09 mar. 2026", base: "Insuficiencia cardíaca",        dx: "Edema de miembros inferiores",   photo: true },
      { name: "Tomás Acosta",           date: "05 mar. 2026", base: "Diabetes mellitus tipo 2",      dx: "Pie diabético",                  photo: true },
      { name: "Gabriela Pineda",        date: "02 mar. 2026", base: "Artritis reumatoide",           dx: "Rigidez matutina",               photo: false },
      { name: "Esteban Salazar",        date: "26 feb. 2026", base: "EPOC",                          dx: "Infección respiratoria",         photo: true },
      { name: "Mariana Lozano",         date: "22 feb. 2026", base: "Migraña crónica",               dx: "Aura migrañosa",                 photo: false },
      { name: "David Camargo",          date: "18 feb. 2026", base: "Enfermedad renal crónica",      dx: "Proteinuria",                    photo: true }
    ];

    function initials(name) {
      var parts = name.trim().split(/\s+/);
      var a = parts[0] ? parts[0][0] : "";
      var b = parts.length > 1 ? parts[parts.length - 1][0] : "";
      return (a + b).toUpperCase();
    }

    var pageSize = 10;
    var page = 1;
    var filtered = PACIENTES.slice();

    function pageSlice() {
      var start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }

    function renderRows() {
      var list = pageSlice();
      rowsHost.innerHTML = list.map(function (p) {
        var av = p.photo
          ? '<div class="he-av is-photo"><span class="material-symbols-outlined">person</span></div>'
          : '<div class="he-av is-initials">' + esc(initials(p.name)) + '</div>';
        return '' +
          '<div class="he-row" role="link" tabindex="0">' +
            av +
            '<div class="he-content">' +
              '<span class="he-name">' + esc(p.name) + '</span>' +
              '<span class="he-evo">Fecha de evolución · ' + esc(p.date) + '</span>' +
              '<span class="he-dx">' + esc(p.base) + ' · ' + esc(p.dx) + '</span>' +
            '</div>' +
            '<span class="he-chev"><span class="material-symbols-outlined">chevron_right</span></span>' +
          '</div>';
      }).join("");
      Array.prototype.forEach.call(rowsHost.querySelectorAll(".he-row"), function (row, i) {
        var p = list[i];
        function open() { window.__selectedPaciente = p; location.hash = "#/informacion-paciente"; }
        row.addEventListener("click", open);
        row.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
      });
      emptyEl.style.display = list.length ? "none" : "block";
    }

    function renderFooter() {
      var total = filtered.length;
      if (total === 0) { rangeEl.textContent = "0 de 0"; }
      else {
        var start = (page - 1) * pageSize + 1;
        var end = Math.min(page * pageSize, total);
        rangeEl.textContent = start + "–" + end + " de " + total;
      }
      var totalPages = Math.max(1, Math.ceil(total / pageSize));
      var atFirst = page <= 1, atLast = page >= totalPages;
      document.getElementById("heFirst").disabled = atFirst;
      document.getElementById("hePrev").disabled  = atFirst;
      document.getElementById("heNext").disabled  = atLast;
      document.getElementById("heLast").disabled  = atLast;
    }

    function render() { renderRows(); renderFooter(); }

    function goTo(p) {
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(Math.max(1, p), totalPages);
      render();
    }

    document.getElementById("heFirst").addEventListener("click", function () { goTo(1); });
    document.getElementById("hePrev").addEventListener("click",  function () { goTo(page - 1); });
    document.getElementById("heNext").addEventListener("click",  function () { goTo(page + 1); });
    document.getElementById("heLast").addEventListener("click",  function () { goTo(Math.ceil(filtered.length / pageSize)); });

    /* page-size select */
    var ps     = document.getElementById("hePageSize");
    var psBtn  = ps.querySelector(".ps-select");
    var psVal  = document.getElementById("hePageSizeValue");
    var psMenu = document.getElementById("hePageSizeMenu");
    function closeMenu() { ps.classList.remove("is-open"); psBtn.setAttribute("aria-expanded", "false"); }
    psBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = ps.classList.toggle("is-open");
      psBtn.setAttribute("aria-expanded", String(open));
    });
    psMenu.querySelectorAll(".ps-item").forEach(function (item) {
      item.addEventListener("click", function () {
        pageSize = parseInt(item.dataset.size, 10);
        psVal.textContent = item.dataset.size;
        psMenu.querySelectorAll(".ps-item").forEach(function (i) { i.classList.remove("is-selected"); });
        item.classList.add("is-selected");
        page = 1;
        closeMenu();
        render();
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#hePageSize")) closeMenu();
    });

    /* búsqueda (nombre / enfermedad base / diagnóstico) */
    var searchInput = document.getElementById("heSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        filtered = PACIENTES.filter(function (p) {
          return !q ||
            p.name.toLowerCase().indexOf(q) !== -1 ||
            p.base.toLowerCase().indexOf(q) !== -1 ||
            p.dx.toLowerCase().indexOf(q) !== -1;
        });
        page = 1;
        render();
      });
    }

    render();
  })();

  /* kick off the router */
  if (!location.hash) location.replace("#/indicadores");
  applyRoute();
})();
