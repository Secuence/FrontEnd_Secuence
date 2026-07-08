/* =====================================================================
   VIEW · Detalle de usuario
   Pantalla completa (espejo de "Mi perfil") que muestra los datos de un
   usuario seleccionado desde la tabla "Usuarios". Lectura + acciones:
     · Editar (lápiz por campo → modal compacto, como Mi perfil)
     · Desactivar / Activar (mismo flujo Alert→confirmación del DS)
     · Eliminar (confirmación destructiva)
   Incluye datos de auditoría, resumen compacto de permisos por grupo y
   métricas de desempeño según el rol y los permisos del usuario.
   Depende de app.js (SecuenceUserStore, openStatusDialog).
   ===================================================================== */
(function detalleUsuario() {
  var page = document.getElementById("duPage");
  var actionsHost = document.getElementById("duActions");
  if (!page) return;

  var store = window.SecuenceUserStore;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ── Permisos canónicos por rol (de los screenshots de "Nuevo usuario") ── */
  var GROUPS = [
    { key: "seguimientos",   label: "Seguimientos",       icon: "show_chart",       total: 3 },
    { key: "historias",      label: "Historias médicas",  icon: "description",      total: 2 },
    { key: "evoluciones",    label: "Evoluciones médicas", icon: "article",         total: 2 },
    { key: "analitica",      label: "Analítica y métricas", icon: "monitoring",     total: 2 },
    { key: "administracion", label: "Administración",      icon: "manage_accounts",  total: 3 }
  ];
  var PERM = {
    "Médico":                { seguimientos: 3, historias: 2, evoluciones: 2, analitica: 1, administracion: 0 },
    "Médico administrador":  { seguimientos: 3, historias: 2, evoluciones: 2, analitica: 2, administracion: 3 },
    "Administrador":         { seguimientos: 0, historias: 0, evoluciones: 0, analitica: 2, administracion: 3 }
  };

  var ROLE_ICON = { "Médico": "stethoscope", "Médico administrador": "shield_person", "Administrador": "admin_panel_settings" };

  /* ── Campos editables (lápiz) ── */
  var PAISES = [
    "Argentina", "Bolivia", "Brasil", "Canadá", "Chile", "Colombia", "Costa Rica", "Cuba",
    "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", "Honduras", "México",
    "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"
  ];
  var ESPECS = [
    "Cardiología", "Dermatología", "Endocrinología", "Gastroenterología", "Geriatría",
    "Ginecología", "Medicina familiar", "Medicina general", "Medicina interna", "Nefrología",
    "Neumología", "Neurología", "Oftalmología", "Oncología", "Pediatría", "Psiquiatría",
    "Reumatología", "Traumatología", "Urología"
  ];
  var FIELDS = {
    nombres:   { label: "Nombres",            type: "text",   required: true, icon: "badge",        msg: "Ingrese los nombres." },
    apellidos: { label: "Apellidos",          type: "text",   required: true, icon: "badge",        msg: "Ingrese los apellidos." },
    correo:    { label: "Correo",             type: "email",  required: true, icon: "mail",         msg: "Ingrese el correo.", emailMsg: "Ingrese un correo válido (nombre@dominio)." },
    espec:     { label: "Especialización",    type: "select", icon: "medical_services", options: ESPECS },
    pais:      { label: "Principal país de ejercicio", type: "select", icon: "public", options: PAISES },
    tel:       { label: "Teléfono",           type: "text",   icon: "call" },
    web:       { label: "Sitio web personal", type: "text",   icon: "language" },
    licencia:  { label: "Número de licencia", type: "text",   icon: "badge" }
  };

  var current = null;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function initials(name) {
    var p = name.trim().split(/\s+/);
    return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "");
  }

  /* ════════════════════ Render helpers ════════════════════ */
  function statusChip(state) {
    return state === "inactivo"
      ? '<span class="status-chip is-inactive">Inactivo</span>'
      : '<span class="status-chip is-active">Activo</span>';
  }
  function rolChip(role) {
    return '<span class="rol-chip"><span class="material-symbols-outlined">' + (ROLE_ICON[role] || "verified_user") + '</span>' + esc(role) + '</span>';
  }

  function li(field, icon, title, value, editable) {
    return '' +
      '<div class="li" data-field="' + field + '">' +
        '<div class="lead"><span class="material-symbols-outlined">' + icon + '</span></div>' +
        '<div class="main">' +
          '<div class="titlerow">' +
            '<span class="title">' + esc(title) + '</span>' +
            (editable ? '<button class="li-edit" type="button" aria-label="Editar ' + esc(title.toLowerCase()) + '"><span class="material-symbols-outlined">edit</span></button>' : '') +
          '</div>' +
          '<span class="value clamp-1">' + esc(value || "Sin registrar") + '</span>' +
        '</div>' +
      '</div>';
  }
  function auditRow(icon, title, value) {
    return '' +
      '<div class="li">' +
        '<div class="lead"><span class="material-symbols-outlined">' + icon + '</span></div>' +
        '<div class="main"><div class="titlerow"><span class="title">' + esc(title) + '</span></div>' +
        '<span class="value clamp-1">' + esc(value) + '</span></div>' +
      '</div>';
  }

  function permRow(g, granted) {
    var status = granted === 0 ? "none" : (granted === g.total ? "full" : "partial");
    var label  = granted === 0 ? "Sin acceso" : (granted === g.total ? "Completo" : "Parcial");
    return '' +
      '<div class="du-perm is-' + status + '">' +
        '<div class="du-perm-ico"><span class="material-symbols-outlined">' + g.icon + '</span></div>' +
        '<span class="du-perm-name">' + g.label + '</span>' +
        '<span class="du-perm-count">' + granted + '/' + g.total + '</span>' +
        '<span class="du-perm-status">' + label + '</span>' +
      '</div>';
  }

  function statCard(label, value, accent) {
    return '<div class="du-stat' + (accent ? ' is-accent' : '') + '"><span class="du-stat-label">' + esc(label) + '</span><span class="du-stat-value">' + esc(value) + '</span></div>';
  }
  function bar(label, pct) {
    return '<div class="du-bar"><span class="du-bar-label">' + esc(label) + '</span><div class="du-bar-track"><div class="du-bar-fill" style="width:' + pct + '%"></div></div><span class="du-bar-pct">' + pct + '%</span></div>';
  }
  function donut(active, inactive) {
    var total = active + inactive || 1;
    var C = 2 * Math.PI * 52;
    var dash = (active / total * C).toFixed(1);
    return '' +
      '<div class="du-donut-wrap">' +
        '<svg viewBox="0 0 120 120" class="du-donut" role="img" aria-label="' + active + ' activos de ' + total + '">' +
          '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-primary)" stroke-width="14"/>' +
          '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-fill-accent-primary)" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + dash + ' ' + C + '" transform="rotate(-90 60 60)"/>' +
          '<text x="60" y="57" text-anchor="middle" class="du-donut-num">' + active + '</text>' +
          '<text x="60" y="76" text-anchor="middle" class="du-donut-cap">activos</text>' +
        '</svg>' +
        '<div class="du-donut-legend">' +
          '<span class="lg"><i class="dot on"></i>Activos · ' + active + '</span>' +
          '<span class="lg"><i class="dot off"></i>Inactivos · ' + inactive + '</span>' +
        '</div>' +
      '</div>';
  }

  /* ── Métricas según rol ── */
  function ensureRoleData(u) {
    function ri(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }
    var isMed  = u.role === "Médico" || u.role === "Médico administrador";
    var hasAdm = u.role === "Médico administrador" || u.role === "Administrador";
    if (isMed && !u.clinical) {
      u.clinical = {
        pacientes: ri(40, 130), alertas: ri(0, 9), seguimientos: ri(15, 45),
        adherencia: ri(80, 96), estudios: ri(70, 95), nps: ri(55, 82)
      };
    }
    if (hasAdm && !u.admin) {
      var creados = ri(8, 40), inactivos = ri(0, 5);
      u.admin = {
        usuariosCreados: creados, usuariosActivos: creados - inactivos, usuariosInactivos: inactivos,
        permisos: ri(20, 120), invitaciones: ri(3, 25), reportes: ri(10, 80)
      };
    }
  }

  function metricsBlock(u) {
    var role = u.role, c = u.clinical, a = u.admin, html = "", sub = "";
    if (role === "Médico") {
      sub = "Actividad clínica y satisfacción del paciente (NPS) del periodo actual.";
      html += '<div class="du-stats">' +
        statCard("Pacientes atendidos", c.pacientes, true) +
        statCard("Alertas por atender", c.alertas) +
        statCard("Seguimientos en curso", c.seguimientos) +
        statCard("NPS", c.nps) +
      '</div>';
      html += '<div class="du-bars">' + bar("Adherencia a tratamiento", c.adherencia) + bar("Estudios realizados", c.estudios) + bar("NPS", c.nps) + '</div>';
    } else if (role === "Médico administrador") {
      sub = "Actividad clínica del médico y gestión administrativa del equipo.";
      html += '<div class="du-stats">' +
        statCard("Pacientes atendidos", c.pacientes, true) +
        statCard("Alertas por atender", c.alertas) +
        statCard("Seguimientos en curso", c.seguimientos) +
        statCard("NPS", c.nps) +
      '</div>';
      html += '<div class="du-bars">' + bar("Adherencia a tratamiento", c.adherencia) + bar("Estudios realizados", c.estudios) + bar("NPS", c.nps) + '</div>';
      html += '<div class="du-sub-head"><span class="material-symbols-outlined">groups</span>Administración del equipo</div>';
      html += '<div class="du-admin-row">' +
        '<div class="du-stats grow">' +
          statCard("Usuarios gestionados", a.usuariosCreados) +
          statCard("Permisos asignados", a.permisos) +
          statCard("Invitaciones enviadas", a.invitaciones) +
        '</div>' +
        donut(a.usuariosActivos, a.usuariosInactivos) +
      '</div>';
    } else {
      sub = "Gestión operativa de la plataforma y uso de analítica.";
      html += '<div class="du-admin-row">' +
        '<div class="du-stats grow">' +
          statCard("Usuarios creados", a.usuariosCreados, true) +
          statCard("Permisos gestionados", a.permisos) +
          statCard("Invitaciones enviadas", a.invitaciones) +
          statCard("Reportes vistos", a.reportes) +
          statCard("Accesos (inicios de sesión)", a.accesos) +
        '</div>' +
        donut(a.usuariosActivos, a.usuariosInactivos) +
      '</div>';
    }
    return '' +
      '<section class="card perfil-card du-metrics-card">' +
        '<div class="card-header"><div class="titles"><span class="title">Métricas de desempeño</span><span class="subtitle">' + sub + '</span></div></div>' +
        '<div class="perfil-body">' + html + '</div>' +
      '</section>';
  }

  /* ── Tarjetas de información ── */
  function infoCards(u) {
    var isMed = u.role === "Médico" || u.role === "Médico administrador";
    var cards = "";

    /* Información personal */
    var personal = li("nombres", "badge", "Nombres", u.nombres, true) +
                   li("apellidos", "badge", "Apellidos", u.apellidos, true);
    if (!isMed) {
      personal += li("correo", "mail", "Correo", u.email, true) +
                  li("tel", "call", "Teléfono", u.tel, true);
    }
    cards += card("Información personal", "Cómo aparece su identidad dentro de la plataforma.",
      '<div class="perfil-list">' + personal + '</div>');

    /* Información profesional (solo Médico / Médico administrador) */
    if (isMed) {
      var prof = li("espec", "medical_services", "Especialización", u.espec, true) +
                 li("pais", "public", "Principal país de ejercicio", u.pais, true) +
                 li("tel", "call", "Teléfono", u.tel, true) +
                 li("correo", "mail", "Correo", u.email, true) +
                 li("web", "language", "Sitio web personal", u.web, true) +
                 li("licencia", "badge", "Número de licencia", u.licencia, true);
      cards += card("Información profesional", "Credenciales y datos de contacto de su ejercicio médico.",
        '<div class="perfil-list">' + prof + '</div>');
    }

    /* Datos de creación / auditoría */
    var audit = auditRow("person_add", "Creado por", u.createdBy) +
                auditRow("event", "Fecha de creación", u.createdAt) +
                auditRow("update", "Última actualización", u.updatedAt) +
                auditRow("login", "Último acceso", u.lastAccess) +
                auditRow("tag", "ID de usuario", u.id);
    cards += card("Datos de creación", "Auditoría y trazabilidad de la cuenta.",
      '<div class="perfil-list">' + audit + '</div>');

    /* Resumen de permisos por grupo */
    cards += permsCard(u);

    return '<div class="du-grid2">' + cards + '</div>';
  }

  function permsCard(u) {
    var perm = PERM[u.role] || {};
    var rows = GROUPS.map(function (g) { return permRow(g, perm[g.key] || 0); }).join("");
    return card("Resumen de permisos", "Accesos otorgados según el rol del usuario.",
      '<div class="du-perms">' + rows + '</div>');
  }

  function card(title, subtitle, body) {
    return '' +
      '<section class="card perfil-card">' +
        '<div class="card-header"><div class="titles"><span class="title">' + esc(title) + '</span><span class="subtitle">' + esc(subtitle) + '</span></div></div>' +
        '<div class="perfil-body">' + body + '</div>' +
      '</section>';
  }

  function identityCard(u, editable) {
    return '' +
      '<section class="card perfil-card du-identity">' +
        (editable ? '<button class="du-id-edit" id="duEditRol" type="button" aria-label="Editar rol del usuario"><span class="material-symbols-outlined">edit</span></button>' : '') +
        '<div class="du-id-avatar">' + esc(initials(u.name).toUpperCase()) + '</div>' +
        '<div class="du-id-main">' +
          '<h2 class="du-id-name">' + esc(u.name) + '</h2>' +
          '<div class="du-id-chips">' + rolChip(u.role) + statusChip(u.state) + '</div>' +
          '<div class="du-id-meta">' +
            '<span class="du-id-mi"><span class="material-symbols-outlined">mail</span>' + esc(u.email) + '</span>' +
            '<span class="du-id-mi"><span class="material-symbols-outlined">tag</span>' + esc(u.id) + '</span>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function renderActions(u) {
    var act = u.state === "inactivo"
      ? '<button class="btn btn-outlined" id="duToggle"><span class="material-symbols-outlined">toggle_on</span>Activar</button>'
      : '<button class="btn btn-outlined" id="duToggle"><span class="material-symbols-outlined">toggle_off</span>Desactivar</button>';
    act += '<button class="btn btn-danger" id="duDelete"><span class="material-symbols-outlined">delete</span>Eliminar</button>';
    actionsHost.innerHTML = act;
    document.getElementById("duToggle").addEventListener("click", onToggle);
    document.getElementById("duDelete").addEventListener("click", onDelete);
  }

  function render() {
    current = window.__detailUser;
    if (!current) { location.hash = "#/roles-y-permisos"; return; }
    var u = current;
    ensureRoleData(u);
    renderActions(u);
    page.innerHTML = identityCard(u, true) + metricsBlock(u) + infoCards(u);
    page.scrollTop = 0;
    var editRol = document.getElementById("duEditRol");
    if (editRol) editRol.addEventListener("click", function () {
      if (typeof window.openRolPicker !== "function") return;
      window.openRolPicker({
        currentRole: current.role,
        onSave: function (label) {
          current.role = label;
          ensureRoleData(current);
          store.refresh();
          render();
        }
      });
    });
  }
  window.__renderUserDetail = render;

  /* ════════════════════ Acciones ════════════════════ */
  function onToggle() {
    if (current.state === "inactivo") {
      store.setState(current, "activo");
      render();
      window.openStatusDialog({
        type: "success", icon: "check_circle",
        title: "Cuenta activada",
        desc: "La cuenta de " + current.name + " se activó correctamente. El usuario podrá iniciar sesión y acceder a su información en Secuence.",
        buttons: [{ label: "Aceptar", variant: "tonal" }]
      });
      return;
    }
    window.openStatusDialog({
      type: "alert", icon: "warning",
      title: "¿Desactivar esta cuenta?",
      desc: "Al desactivarla, " + current.name + " no podrá iniciar sesión en la plataforma y perderá el acceso a toda la información asociada a su cuenta dentro de Secuence.",
      buttons: [
        { label: "Regresar", variant: "text" },
        { label: "Continuar y desactivar", variant: "tonal", onClick: function () {
            store.setState(current, "inactivo");
            render();
            window.openStatusDialog({
              type: "success", icon: "check_circle",
              title: "Cuenta desactivada",
              desc: "La cuenta se desactivó correctamente. Puede recuperar el acceso a la plataforma y a toda la información asociada activando nuevamente la cuenta.",
              buttons: [
                { label: "Aceptar", variant: "text" },
                { label: "Activar de nuevo", variant: "tonal", onClick: function () {
                    store.setState(current, "activo"); render();
                  } }
              ]
            });
            return true;
          } }
      ]
    });
  }

  function onDelete() {
    window.openStatusDialog({
      type: "warning", icon: "delete",
      title: "¿Eliminar este usuario?",
      desc: "Esta acción es permanente. " + current.name + " perderá el acceso a la plataforma y se eliminará su información asociada dentro de Secuence. No podrá deshacerse.",
      buttons: [
        { label: "Cancelar", variant: "text" },
        { label: "Eliminar usuario", variant: "tonal", onClick: function () {
            var name = current.name;
            store.remove(current);
            window.__detailUser = null;
            location.hash = "#/roles-y-permisos";
            window.openStatusDialog({
              type: "success", icon: "check_circle",
              title: "Usuario eliminado",
              desc: "La cuenta de " + name + " se eliminó de la plataforma.",
              buttons: [{ label: "Aceptar", variant: "tonal" }]
            });
            return true;
          } }
      ]
    });
  }

  /* ════════════════════ Modal · Editar campo ════════════════════ */
  var editScrim = document.getElementById("duEditScrim");
  var editTitle = document.getElementById("duEditTitle");
  var editSub   = document.getElementById("duEditSub");
  var editBody  = document.getElementById("duEditBody");
  var editSave  = document.getElementById("duEditSave");
  var ectx = null;

  function reqTag(cfg) { return '<span class="req">(' + (cfg.required ? "obligatorio" : "opcional") + ')</span>'; }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  function buildText(cfg, value) {
    var t = cfg.type === "email" ? "email" : "text";
    var wrap = document.createElement("div");
    wrap.className = "ff";
    wrap.innerHTML =
      '<div class="ff-box"><input class="ff-input" id="duEditInput" type="' + t + '" autocomplete="off">' +
      '<label class="ff-label" for="duEditInput">' + cfg.label + ' ' + reqTag(cfg) + '</label></div>' +
      '<div class="ff-support" hidden></div>';
    editBody.appendChild(wrap);
    var input = wrap.querySelector(".ff-input"), sup = wrap.querySelector(".ff-support");
    input.value = value === "Sin registrar" ? "" : (value || "");
    input.addEventListener("input", function () { wrap.classList.remove("is-error"); sup.hidden = true; });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); editSave.click(); } });
    return {
      getValue: function () { return input.value.trim(); },
      setError: function (m) { wrap.classList.add("is-error"); sup.textContent = m; sup.hidden = false; },
      focus: function () { input.focus(); try { input.select(); } catch (e) {} }
    };
  }

  function buildSelect(cfg, value) {
    var committed = cfg.options.indexOf(value) >= 0 ? value : cfg.options[0];
    var sel = document.createElement("div");
    sel.className = "ff ff-select ds-search-select";
    sel.innerHTML =
      '<div class="ff-box" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="ff-value"></span><label class="ff-label">' + cfg.label + ' ' + reqTag(cfg) + '</label>' +
        '<span class="ff-icon material-symbols-outlined">arrow_drop_down</span></div>' +
      '<div class="menu nu-menu" role="listbox">' +
        '<div class="menu-search"><span class="material-symbols-outlined">search</span>' +
        '<input type="text" autocomplete="off" aria-label="Buscar ' + cfg.label + '"></div>' +
        '<div class="menu-scroll"></div></div>';
    editBody.appendChild(sel);
    var box = sel.querySelector(".ff-box"), valEl = sel.querySelector(".ff-value"),
        icon = sel.querySelector(".ff-icon"), scroll = sel.querySelector(".menu-scroll"),
        search = sel.querySelector(".menu-search input");
    function setVal(v) { committed = v; valEl.textContent = v; }
    setVal(committed);
    function renderMenu(q) {
      var nq = norm(q);
      var ms = nq ? cfg.options.filter(function (o) { return norm(o).indexOf(nq) >= 0; }) : cfg.options.slice();
      if (!ms.length) { scroll.innerHTML = '<div class="menu-empty">Sin resultados.</div>'; return; }
      scroll.innerHTML = ms.map(function (o) {
        var s = o === committed;
        return '<div class="menu-item' + (s ? " is-selected" : "") + '" role="option" data-value="' + esc(o) + '">' + esc(o) + (s ? '<span class="check material-symbols-outlined">check</span>' : "") + '</div>';
      }).join("");
    }
    function open() { sel.classList.add("is-open"); box.setAttribute("aria-expanded", "true"); icon.textContent = "arrow_drop_up"; search.value = ""; renderMenu(""); setTimeout(function () { search.focus(); }, 0); }
    function close() { sel.classList.remove("is-open"); box.setAttribute("aria-expanded", "false"); icon.textContent = "arrow_drop_down"; }
    box.addEventListener("click", function () { sel.classList.contains("is-open") ? close() : open(); });
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); } });
    search.addEventListener("input", function () { renderMenu(search.value); });
    scroll.addEventListener("mousedown", function (e) { var it = e.target.closest(".menu-item"); if (!it) return; e.preventDefault(); setVal(it.getAttribute("data-value")); close(); box.focus(); });
    document.addEventListener("click", function (e) { if (!document.body.contains(sel)) return; if (!sel.contains(e.target)) close(); });
    return { getValue: function () { return committed; }, setError: function () {}, focus: function () { box.focus(); } };
  }

  function openEdit(field) {
    var cfg = FIELDS[field];
    if (!cfg || !current) return;
    var row = page.querySelector('.li[data-field="' + field + '"] .value');
    var cur = row ? row.textContent.trim() : "";
    editTitle.textContent = "Editar " + cfg.label.charAt(0).toLowerCase() + cfg.label.slice(1);
    editSub.textContent = cfg.required ? "Este campo es obligatorio." : "Actualice el valor y guarde los cambios.";
    editBody.innerHTML = "";
    var control = cfg.type === "select" ? buildSelect(cfg, cur) : buildText(cfg, cur);
    ectx = { cfg: cfg, field: field, control: control };
    editScrim.classList.add("is-open");
    editScrim.setAttribute("aria-hidden", "false");
    setTimeout(function () { control.focus(); }, 80);
  }
  function closeEdit() { editScrim.classList.remove("is-open"); editScrim.setAttribute("aria-hidden", "true"); ectx = null; }

  editSave.addEventListener("click", function () {
    if (!ectx) return;
    var cfg = ectx.cfg, val = ectx.control.getValue();
    if (cfg.type !== "select") {
      if (cfg.required && !val) { ectx.control.setError(cfg.msg || "Este campo es obligatorio."); ectx.control.focus(); return; }
      if (cfg.type === "email" && val && !EMAIL_RE.test(val)) { ectx.control.setError(cfg.emailMsg || "Ingrese un correo válido."); ectx.control.focus(); return; }
    }
    /* Actualizar el modelo */
    if (ectx.field === "correo") current.email = val;
    else current[ectx.field] = val;
    if (ectx.field === "nombres" || ectx.field === "apellidos") {
      current.name = (current.nombres + " " + current.apellidos).trim();
    }
    store.refresh();           /* re-render de la tabla */
    closeEdit();
    render();                  /* re-render del detalle */
    window.openStatusDialog({
      type: "success", icon: "check_circle",
      title: "Cambios guardados",
      desc: "El campo «" + cfg.label + "» se actualizó correctamente.",
      buttons: [{ label: "Aceptar", variant: "tonal" }]
    });
  });

  /* Delegación: lápiz de cada fila editable */
  page.addEventListener("click", function (e) {
    var btn = e.target.closest(".li-edit");
    if (!btn) return;
    var row = btn.closest(".li[data-field]");
    if (row) openEdit(row.getAttribute("data-field"));
  });

  document.getElementById("duEditClose").addEventListener("click", closeEdit);
  document.getElementById("duEditCancel").addEventListener("click", closeEdit);
  editScrim.addEventListener("click", function (e) { if (e.target === editScrim) closeEdit(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && editScrim.classList.contains("is-open")) closeEdit(); });

  /* Volver a la lista */
  var back = document.getElementById("duBack");
  if (back) back.addEventListener("click", function () { location.hash = "#/roles-y-permisos"; });

  /* ════════════════════ Modal · Desempeño médico (métricas) ════════════════════
     Reutiliza los mismos componentes (identidad · métricas · permisos) que la
     pantalla de detalle. "Editar usuario" abre la pantalla completa de detalle. */
  var mScrim = document.getElementById("duModalScrim");
  var mBody  = document.getElementById("duModalBody");
  var mUser  = null;

  function openMetricsModal(u) {
    if (!u || !mScrim) return;
    mUser = u;
    /* Fuera del MVP (2026-07-06): + permsCard(u) — sección "Resumen de
       permisos", quitada del modal a pedido. */
    mBody.innerHTML = identityCard(u) + metricsBlock(u);
    mBody.scrollTop = 0;
    mScrim.classList.add("is-open");
    mScrim.setAttribute("aria-hidden", "false");
  }
  function closeMetricsModal() {
    if (!mScrim) return;
    mScrim.classList.remove("is-open");
    mScrim.setAttribute("aria-hidden", "true");
    mUser = null;
  }
  window.__openMetricsModal = openMetricsModal;

  if (mScrim) {
    document.getElementById("duModalClose").addEventListener("click", closeMetricsModal);
    document.getElementById("duModalCerrar").addEventListener("click", closeMetricsModal);
    var mRep = document.getElementById("duModalReportar");
    if (mRep) mRep.addEventListener("click", function () {
      if (window.openStatusDialog) window.openStatusDialog({
        type: "info", icon: "flag",
        title: "Reportar problema",
        desc: "Describa la inconsistencia que encontró en estas métricas y nuestro equipo la revisará.",
        buttons: [{ label: "Cancelar", variant: "text" }, { label: "Enviar reporte", variant: "tonal" }]
      });
    });
    /* Fuera del MVP (2026-07-06): botón "Editar usuario" quitado del modal
       (ver index.html) — llevaba a #/usuario, dentro de Roles y permisos,
       ruta ya sin destino. */
    var mEditar = document.getElementById("duModalEditar");
    if (mEditar) mEditar.addEventListener("click", function () {
      var u = mUser; closeMetricsModal();
      if (u) { window.__detailUser = u; location.hash = "#/usuario"; }
    });
    mScrim.addEventListener("click", function (e) { if (e.target === mScrim) closeMetricsModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mScrim.classList.contains("is-open")) closeMetricsModal(); });
  }

  /* Si la vista ya está activa al cargar (navegación directa), renderizar */
  var self = document.querySelector('.view[data-view="detalle-usuario"]');
  if (self && self.classList.contains("is-active")) render();
})();
