/* =====================================================================
   VIEW · Mi perfil — interacciones
   Los datos se presentan como filas "List variant" (DS). El botón-ícono
   "Editar" abre un modal compacto con el campo correspondiente; al
   confirmar se valida (obligatorios + email), se actualiza la fila y se
   muestra la modal Success del DS. Picture uploaders y el toggle de
   cuenta se mantienen. La contraseña abre su propio modal.
   Depende de app.js (window.openStatusDialog).
   ===================================================================== */
(function miPerfil() {
  var page = document.getElementById("perfilPage");
  if (!page) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  /* URL válida: dominio con TLD, opcional http(s):// , www, ruta, etc. */
  var URL_RE = /^(https?:\/\/)?(www\.)?[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d+)?(\/[^\s]*)?$/i;
  var PAISES = [
    "Argentina", "Bolivia", "Brasil", "Canadá", "Chile", "Colombia",
    "Costa Rica", "Cuba", "Ecuador", "El Salvador", "España", "Estados Unidos",
    "Guatemala", "Haití", "Honduras", "México", "Nicaragua", "Panamá",
    "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"
  ];

  /* Código país (nombre + indicativo telefónico) para los campos de teléfono */
  var PHONE_CODES = [
    { c: "Argentina", d: "+54" },  { c: "Bolivia", d: "+591" }, { c: "Brasil", d: "+55" },
    { c: "Canadá", d: "+1" },      { c: "Chile", d: "+56" },    { c: "Colombia", d: "+57" },
    { c: "Costa Rica", d: "+506" },{ c: "Cuba", d: "+53" },     { c: "Ecuador", d: "+593" },
    { c: "El Salvador", d: "+503" },{ c: "España", d: "+34" },  { c: "Estados Unidos", d: "+1" },
    { c: "Guatemala", d: "+502" }, { c: "Haití", d: "+509" },   { c: "Honduras", d: "+504" },
    { c: "México", d: "+52" },     { c: "Nicaragua", d: "+505" },{ c: "Panamá", d: "+507" },
    { c: "Paraguay", d: "+595" },  { c: "Perú", d: "+51" },     { c: "Puerto Rico", d: "+1" },
    { c: "República Dominicana", d: "+1" }, { c: "Uruguay", d: "+598" }, { c: "Venezuela", d: "+58" }
  ];
  var PHONE_LABELS = PHONE_CODES.map(function (p) { return p.c + " (" + p.d + ")"; });

  /* Especialidades médicas (orden alfabético) */
  var ESPECIALIDADES = [
    "Acupuntura", "Alergología", "Cardiología", "Cardiología Pediátrica",
    "Cirugía Cardiovascular", "Cirugía General", "Cirugía Maxilofacial",
    "Cirugía Pediátrica", "Cirugía Plástica", "Cirugía Vascular", "Coloproctología",
    "Cuidados Paliativos", "Dermatología", "Endocrinología", "Endocrinología Pediátrica",
    "Endodoncia", "Fertilidad y Reproducción", "Fisiatría", "Fisioterapia",
    "Fonoaudiología", "Gastroenterología", "Geriatría", "Ginecología",
    "Ginecología y Obstetricia", "Hematología", "Homeopatía", "Infectología",
    "Inmunología", "Laboratorio Clínico", "Medicina Aeroespacial", "Medicina del Dolor",
    "Medicina del Sueño", "Medicina Deportiva", "Medicina de Emergencias",
    "Medicina Estética", "Medicina Familiar", "Medicina Física y Rehabilitación",
    "Medicina General", "Medicina Intensiva", "Medicina Integrativa", "Medicina Interna",
    "Medicina Laboral", "Medicina Materno Fetal", "Medicina Nuclear", "Medicina Preventiva",
    "Nefrología", "Neonatología", "Neumología", "Neurocirugía", "Neurología",
    "Neuropediatría", "Neuropsicología", "Nutrición Clínica", "Obstetricia",
    "Odontología General", "Oftalmología", "Oncología", "Ortopedia y Traumatología",
    "Ortodoncia", "Otorrinolaringología", "Patología", "Pediatría", "Periodoncia",
    "Psiquiatría", "Psicología Clínica", "Radiología e Imagenología", "Reumatología",
    "Terapia Ocupacional", "Terapia Respiratoria", "Toxicología Clínica", "Urología"
  ];

  /* Configuración de cada campo editable (clave = data-field de la fila) */
  var ROLE_ICON = { "Médico": "stethoscope", "Médico administrador": "shield_person", "Administrador": "admin_panel_settings" };
  var ROLE_BY_KEY = { "medico": "Médico", "medico-administrador": "Médico administrador", "administrador": "Administrador" };
  var ROLE_KEY = { "Médico": "medico", "Médico administrador": "medico-administrador", "Administrador": "administrador" };

  var FIELDS = {
    centroNombre: { label: "Nombre del centro de salud", type: "text", required: true, msg: "Ingrese el nombre del centro de salud." },
    paisCentro:   { label: "País", type: "select", options: PAISES, required: true, msg: "Seleccione un país." },
    centroDir:    { label: "Dirección", type: "text" },
    centroTel:    { label: "Teléfono", type: "phone" },
    centroWeb:    { label: "Sitio web", type: "url", urlMsg: "Ingrese una URL válida (p. ej. www.sitio.com)." },
    nombres:      { label: "Nombres", type: "text", required: true, msg: "Ingrese los nombres." },
    apellidos:    { label: "Apellidos", type: "text", required: true, msg: "Ingrese los apellidos." },
    espec:        { label: "Especialización", type: "select", options: ESPECIALIDADES },
    paisEjercicio:{ label: "Principal país de ejercicio", type: "select", options: PAISES },
    profTel:      { label: "Teléfono", type: "phone" },
    correo:       { label: "Correo", type: "email", required: true, msg: "Ingrese el correo.", emailMsg: "Ingrese un correo válido (nombre@dominio)." },
    profWeb:      { label: "Sitio web personal", type: "url", urlMsg: "Ingrese una URL válida (p. ej. www.sitio.com)." },
    licencia:     { label: "Número de licencia", type: "text" }
  };

  /* ════════════════════ Picture uploader (DS) ════════════════════ */
  var uploaderURLs = {};
  Array.prototype.forEach.call(page.querySelectorAll("[data-uploader]"), function (pu) {
    var key    = pu.getAttribute("data-uploader");
    var action = pu.querySelector(".pu-action");
    var label  = pu.querySelector(".pu-action-label");
    var aIcon  = action.querySelector(".material-symbols-outlined");
    var remove = pu.querySelector(".pu-remove");
    var input  = pu.querySelector(".pu-input");

    function toFilled(file) {
      pu.classList.remove("is-empty");
      pu.classList.add("is-filled");
      if (uploaderURLs[key]) { URL.revokeObjectURL(uploaderURLs[key]); uploaderURLs[key] = null; }
      if (file && /^image\//.test(file.type)) {
        var url = URL.createObjectURL(file);
        uploaderURLs[key] = url;
        pu.style.backgroundImage = 'url("' + url + '")';
      } else {
        pu.style.backgroundImage = "none";
      }
      label.textContent = "Editar imagen";
      aIcon.textContent = "edit";
    }
    function toEmpty() {
      pu.classList.add("is-empty");
      pu.classList.remove("is-filled");
      pu.style.backgroundImage = "";
      if (uploaderURLs[key]) { URL.revokeObjectURL(uploaderURLs[key]); uploaderURLs[key] = null; }
      label.textContent = "Subir imagen";
      aIcon.textContent = "file_upload";
      input.value = "";
    }
    action.addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () {
      if (input.files && input.files[0]) toFilled(input.files[0]);
    });
    remove.addEventListener("click", function (e) { e.stopPropagation(); toEmpty(); });
  });

  /* ════════════════════ Firma y sello — visibles sólo para Médico / Médico administrador ════════════════════ */
  function gateFirmaSello() {
    var block = document.getElementById("firmaSelloBlock");
    if (!block) return;
    var chip = page.querySelector('.li[data-field="rol"] .rol-chip');
    var role = "";
    if (chip) {
      var last = chip.lastChild;
      role = (last && last.nodeType === 3 ? last.textContent : chip.textContent).trim();
    }
    var allowed = role === "Médico" || role === "Médico administrador";
    block.style.display = allowed ? "" : "none";
  }
  gateFirmaSello();

  /* ════════════════════ Slide toggle (DS) — desactivar cuenta con confirmación ════════════════════ */
  var toggle = document.getElementById("cpCuentaActiva");
  if (toggle) {
    var setToggle = function (on) {
      toggle.classList.toggle("on", on);
      toggle.setAttribute("aria-checked", on ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      /* Activar: directo, sin diálogo */
      if (!toggle.classList.contains("on")) { setToggle(true); return; }

      /* Desactivar: el switch NO cambia hasta confirmar — Alert del DS */
      window.openStatusDialog({
        type: "alert", icon: "warning",
        title: "¿Desactivar esta cuenta?",
        desc: "Al desactivarla, este usuario no podrá iniciar sesión en la plataforma y perderá el acceso a toda la información asociada a su cuenta dentro de Secuence.",
        buttons: [
          { label: "Regresar", variant: "text" },
          { label: "Continuar y desactivar", variant: "tonal", onClick: function () {
              setToggle(false);
              /* Modal de confirmación (éxito) — informa cómo recuperar el acceso */
              window.openStatusDialog({
                type: "success", icon: "check_circle",
                title: "Cuenta desactivada",
                desc: "La cuenta se desactivó correctamente. Puede recuperar el acceso a la plataforma y a toda la información asociada activando nuevamente la cuenta.",
                buttons: [
                  { label: "Aceptar", variant: "text" },
                  { label: "Activar de nuevo", variant: "tonal", onClick: function () { setToggle(true); } }
                ]
              });
              return true; /* mantener abierto: ya lo reemplazamos por el modal de confirmación */
            } }
        ]
      });
    });
  }

  /* ════════════════════ Input · Select (DS) — reutilizable ════════════════════ */
  function initSelect(sel) {
    var box   = sel.querySelector(".ff-box");
    var value = sel.querySelector(".ff-value");
    var menu  = sel.querySelector(".nu-menu");
    function open()  { sel.classList.add("is-open");  box.setAttribute("aria-expanded", "true"); }
    function close() { sel.classList.remove("is-open"); box.setAttribute("aria-expanded", "false"); }
    box.addEventListener("click", function () { sel.classList.contains("is-open") ? close() : open(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel.classList.contains("is-open") ? close() : open(); }
      if (e.key === "Escape") close();
    });
    Array.prototype.forEach.call(menu.querySelectorAll(".menu-item"), function (item) {
      item.addEventListener("click", function () {
        value.textContent = item.getAttribute("data-value");
        menu.querySelectorAll(".menu-item").forEach(function (i) { i.classList.remove("is-selected"); });
        item.classList.add("is-selected");
        close();
      });
    });
    /* cerrar al hacer click fuera (sólo mientras el select exista en el DOM) */
    document.addEventListener("click", function (e) {
      if (!document.body.contains(sel)) return;
      if (!sel.contains(e.target)) close();
    });
  }

  /* ════════════════════ Modal · Editar campo ════════════════════ */
  var editScrim  = document.getElementById("editScrim");
  var editTitle  = document.getElementById("editTitle");
  var editSub    = document.getElementById("editSub");
  var editBody   = document.getElementById("editBody");
  var editSaveBtn = document.getElementById("editSave");
  var ctx = null;   /* { cfg, valueEl, getValue, setError, focus } */

  function reqTag(cfg) {
    return '<span class="req">(' + (cfg.required ? "obligatorio" : "opcional") + ')</span>';
  }

  function buildTextControl(cfg, value, parent) {
    var t = cfg.type === "email" ? "email" : cfg.type === "tel" ? "tel" : "text";
    var wrap = document.createElement("div");
    wrap.className = "ff";
    wrap.innerHTML =
      '<div class="ff-box">' +
        '<input class="ff-input" id="editInput" type="' + t + '" autocomplete="off">' +
        '<label class="ff-label" for="editInput">' + cfg.label + ' ' + reqTag(cfg) + '</label>' +
      '</div>' +
      '<div class="ff-support" hidden></div>';
    (parent || editBody).appendChild(wrap);
    var input = wrap.querySelector(".ff-input");
    var sup   = wrap.querySelector(".ff-support");
    input.value = value;
    input.addEventListener("input", function () { wrap.classList.remove("is-error"); sup.hidden = true; });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); editSaveBtn.click(); } });
    return {
      getValue: function () { return input.value.trim(); },
      setError: function (msg) { wrap.classList.add("is-error"); sup.textContent = msg; sup.hidden = false; },
      focus: function () { input.focus(); try { input.select(); } catch (e) {} }
    };
  }

  /* Input · Select "Open con búsqueda" (DS · preview/input-select.html).
     Caja de valor estática + menú flotante con buscador pinned arriba y
     lista de opciones scrolleable; la opción elegida muestra un check.
     getValue siempre devuelve una opción válida (committed). */
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function buildSelectControl(cfg, value, parent) {
    var committed = cfg.options.indexOf(value) >= 0 ? value : cfg.options[0];
    var sel = document.createElement("div");
    sel.className = "ff ff-select ds-search-select";
    sel.innerHTML =
      '<div class="ff-box" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="ff-value"></span>' +
        '<label class="ff-label">' + cfg.label + " " + reqTag(cfg) + "</label>" +
        '<span class="ff-icon material-symbols-outlined">arrow_drop_down</span>' +
      "</div>" +
      '<div class="menu nu-menu" role="listbox">' +
        '<div class="menu-search">' +
          '<span class="material-symbols-outlined">search</span>' +
          '<input type="text" autocomplete="off" aria-label="Buscar ' + cfg.label + '">' +
        "</div>" +
        '<div class="menu-scroll"></div>' +
      "</div>";
    (parent || editBody).appendChild(sel);

    var box    = sel.querySelector(".ff-box");
    var valEl  = sel.querySelector(".ff-value");
    var icon   = sel.querySelector(".ff-icon");
    var menu   = sel.querySelector(".nu-menu");
    var scroll = sel.querySelector(".menu-scroll");
    var search = sel.querySelector(".menu-search input");
    var activeIdx = -1;

    function setValue(v) { committed = v; valEl.textContent = v; }
    setValue(committed);

    function renderMenu(q) {
      var nq = norm(q);
      var matches = nq ? cfg.options.filter(function (o) { return norm(o).indexOf(nq) >= 0; }) : cfg.options.slice();
      activeIdx = -1;
      if (!matches.length) {
        scroll.innerHTML = '<div class="menu-empty">Sin resultados' + (q.trim() ? ' para “' + q.trim() + '”' : "") + ".</div>";
        return;
      }
      scroll.innerHTML = matches.map(function (o) {
        var isSel = o === committed;
        return '<div class="menu-item' + (isSel ? " is-selected" : "") + '" role="option" data-value="' + o + '"' + (isSel ? ' aria-selected="true"' : "") +
          ">" + o + (isSel ? '<span class="check material-symbols-outlined">check</span>' : "") + "</div>";
      }).join("");
    }
    function visItems() { return Array.prototype.slice.call(scroll.querySelectorAll(".menu-item")); }
    function paintActive(items) {
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === activeIdx); });
      if (items[activeIdx]) items[activeIdx].scrollIntoView({ block: "nearest" });
    }
    function open() {
      if (sel.classList.contains("is-open")) return;
      sel.classList.add("is-open");
      box.setAttribute("aria-expanded", "true");
      icon.textContent = "arrow_drop_up";
      search.value = "";
      renderMenu("");
      var cur = scroll.querySelector(".menu-item.is-selected");
      if (cur) cur.scrollIntoView({ block: "nearest" });
      setTimeout(function () { search.focus(); }, 0);
    }
    function close() {
      sel.classList.remove("is-open");
      box.setAttribute("aria-expanded", "false");
      icon.textContent = "arrow_drop_down";
    }
    function commit(v) { setValue(v); close(); box.focus(); }

    box.addEventListener("click", function () { sel.classList.contains("is-open") ? close() : open(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); }
    });
    search.addEventListener("input", function () { renderMenu(search.value); });
    search.addEventListener("keydown", function (e) {
      var items = visItems();
      if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); paintActive(items); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, items.length ? 0 : -1); paintActive(items); }
      else if (e.key === "Enter") { e.preventDefault(); var t = items[activeIdx] || items[0]; if (t) commit(t.getAttribute("data-value")); }
      else if (e.key === "Escape") { if (sel.classList.contains("is-open")) { e.stopPropagation(); close(); box.focus(); } }
    });
    scroll.addEventListener("mousedown", function (e) {
      var it = e.target.closest(".menu-item");
      if (!it) return;
      e.preventDefault();
      commit(it.getAttribute("data-value"));
    });
    document.addEventListener("click", function (e) {
      if (!document.body.contains(sel)) return;
      if (!sel.contains(e.target)) close();
    });

    return {
      getValue: function () { return committed; },
      setError: function () {},
      focus: function () { box.focus(); }
    };
  }

  /* Teléfono = Input·Select "Open con búsqueda" (código país) + Form input
     (número, solo dígitos). El valor del row se guarda como "<indicativo> <número>". */
  function buildPhoneControl(cfg, value) {
    /* parsear "<+dial> <número>" del valor actual del row */
    var m = (value || "").match(/^(\+\d+)\s*(.*)$/);
    var curDial = m ? m[1] : "+57";
    var curNum  = m ? m[2].trim() : (value || "").replace(/\D/g, "");
    var entry = PHONE_CODES.filter(function (p) { return p.d === curDial; })[0];
    var curLabel = entry ? entry.c + " (" + entry.d + ")" : "Colombia (+57)";

    var grid = document.createElement("div");
    grid.className = "phone-grid";
    editBody.appendChild(grid);

    /* Columna 1 · código país (select con búsqueda) */
    var codeCol = document.createElement("div");
    grid.appendChild(codeCol);
    var codeCtl = buildSelectControl(
      { label: "Código", required: true, options: PHONE_LABELS },
      curLabel, codeCol
    );

    /* Columna 2 · número (form input, solo dígitos) */
    var numCol = document.createElement("div");
    grid.appendChild(numCol);
    var numWrap = document.createElement("div");
    numWrap.className = "ff";
    numWrap.innerHTML =
      '<div class="ff-box">' +
        '<input class="ff-input" id="editPhoneNum" type="tel" inputmode="numeric" autocomplete="off" placeholder="Escriba teléfono">' +
        '<label class="ff-label" for="editPhoneNum">Teléfono <span class="req">(obligatorio)</span></label>' +
      '</div>' +
      '<div class="ff-support" hidden></div>';
    numCol.appendChild(numWrap);
    var numInput = numWrap.querySelector(".ff-input");
    var numSup   = numWrap.querySelector(".ff-support");
    numInput.value = curNum;

    /* solo permite dígitos y espacios */
    function sanitize() {
      var clean = numInput.value.replace(/[^\d ]/g, "");
      if (clean !== numInput.value) numInput.value = clean;
    }
    numInput.addEventListener("input", function () {
      sanitize();
      numWrap.classList.remove("is-error"); numSup.hidden = true;
    });
    numInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); editSaveBtn.click(); }
    });

    function digits() { return numInput.value.replace(/\D/g, ""); }
    function dialOf() {
      var label = codeCtl.getValue();
      var mm = label.match(/\((\+\d+)\)/);
      return mm ? mm[1] : "+57";
    }

    return {
      getValue: function () { return dialOf() + " " + numInput.value.trim(); },
      validate: function () {
        if (!digits()) {
          numWrap.classList.add("is-error");
          numSup.textContent = "Ingrese el número de teléfono.";
          numSup.hidden = false;
          numInput.focus();
          return false;
        }
        return true;
      },
      focus: function () { numInput.focus(); try { numInput.select(); } catch (e) {} }
    };
  }

  function openEdit(key) {
    var cfg = FIELDS[key];
    var row = page.querySelector('.li[data-field="' + key + '"]');
    if (!cfg || !row) return;
    var valueEl = row.querySelector(".value");
    var current = valueEl.textContent.trim();

    editTitle.textContent = "Editar " + cfg.label.charAt(0).toLowerCase() + cfg.label.slice(1);
    editSub.textContent = cfg.required ? "Este campo es obligatorio." : "Actualice el valor y guarde los cambios.";
    editBody.innerHTML = "";

    var control = cfg.type === "select" ? buildSelectControl(cfg, current)
                : cfg.type === "phone"  ? buildPhoneControl(cfg, current)
                : buildTextControl(cfg, current);
    ctx = { cfg: cfg, valueEl: valueEl };
    ctx.getValue = control.getValue;
    ctx.setError = control.setError;
    ctx.validate = control.validate;
    ctx.focus = control.focus;

    editScrim.classList.add("is-open");
    editScrim.setAttribute("aria-hidden", "false");
    setTimeout(function () { control.focus(); }, 80);
  }

  function closeEdit() {
    editScrim.classList.remove("is-open");
    editScrim.setAttribute("aria-hidden", "true");
    ctx = null;
  }

  editSaveBtn.addEventListener("click", function () {
    if (!ctx) return;
    if (ctx.validate && !ctx.validate()) return;
    var cfg = ctx.cfg, val = ctx.getValue();
    if (cfg.type !== "select" && cfg.type !== "phone") {
      if (cfg.required && !val) { ctx.setError(cfg.msg || "Este campo es obligatorio."); ctx.focus(); return; }
      if (cfg.type === "email" && val && !EMAIL_RE.test(val)) { ctx.setError(cfg.emailMsg || "Ingrese un correo válido."); ctx.focus(); return; }
      if (cfg.type === "url" && val && !URL_RE.test(val)) { ctx.setError(cfg.urlMsg || "Ingrese una URL válida."); ctx.focus(); return; }
    }
    var label = cfg.label;

    ctx.valueEl.textContent = val || "—";
    closeEdit();
    window.openStatusDialog({
      type: "success", icon: "check_circle",
      title: "Cambios guardados",
      desc: "El campo «" + label + "» se actualizó correctamente.",
      buttons: [{ label: "Aceptar", variant: "tonal" }]
    });
  });

  document.getElementById("editClose").addEventListener("click", closeEdit);
  document.getElementById("editCancel").addEventListener("click", closeEdit);
  editScrim.addEventListener("click", function (e) { if (e.target === editScrim) closeEdit(); });

  /* ════════════════════ Delegación: botón Editar de cada fila ════════════════════ */
  page.addEventListener("click", function (e) {
    var btn = e.target.closest(".li-edit");
    if (!btn) return;
    var row = btn.closest(".li[data-field]");
    if (!row) return;
    var key = row.getAttribute("data-field");
    if (key === "password") { openPw(); return; }
    openEdit(key);
  });

  /* ════════════════════ Modal · Cambiar rol del usuario ════════════════════
     Selector de rol (radio cards) + permisos preestablecidos por rol
     (solo lectura — reglas tomadas de "Nuevo usuario"). */
  var rolScrim    = document.getElementById("rolScrim");
  var rolOptions  = document.getElementById("rolOptions");
  var rolSaveBtn  = document.getElementById("rolSave");
  var rolChecks   = Array.prototype.slice.call(rolScrim.querySelectorAll(".perm-check"));
  var ELEVATED     = ["ana-desempeno", "adm-crear", "adm-eliminar", "adm-asignar"];
  var ADMIN_GROUPS = ["analitica", "administracion"];
  var rolSelected  = "medico";   /* key */
  var rolOnSave    = null;        /* callback(label) provisto por quien abre el modal */
  var rolCurrentRole = "";        /* rol del usuario ANTES del cambio (label) */

  /* Campos médicos (Licencia + Foto) — obligatorios al promover un Administrador */
  var rolMedico    = document.getElementById("rolMedico");
  var rolLicencia  = document.getElementById("rolLicencia");
  var rolFfLic     = document.getElementById("rolFfLicencia");
  var rolSupLic    = document.getElementById("rolSupLicencia");
  var rolSupFoto   = document.getElementById("rolSupFoto");
  var rolDrop      = document.getElementById("rolDrop");
  var rolFileInput = document.getElementById("rolFileInput");
  var rolFilesHost = document.getElementById("rolFiles");
  var rolFiles     = [];

  function rolMedicoVisible() {
    var medicalTarget = rolSelected === "medico" || rolSelected === "medico-administrador";
    return rolCurrentRole === "Administrador" && medicalTarget;
  }

  /* Estado canónico de cada permiso por rol (preview, siempre disabled). */
  function rolPermState(btn) {
    var key = btn.dataset.perm, group = btn.dataset.group;
    if (rolSelected === "medico-administrador") return true;
    if (rolSelected === "administrador") return ADMIN_GROUPS.indexOf(group) !== -1;
    /* medico → permisos base; los elevables no están en el preset */
    return ELEVATED.indexOf(key) === -1;
  }

  function renderRolModal() {
    Array.prototype.forEach.call(rolOptions.querySelectorAll(".rol-option"), function (opt) {
      var on = opt.dataset.role === rolSelected;
      opt.classList.toggle("is-selected", on);
      opt.setAttribute("aria-checked", on ? "true" : "false");
      opt.querySelector(".rol-option-radio").textContent = on ? "radio_button_checked" : "radio_button_unchecked";
    });
    rolMedico.hidden = !rolMedicoVisible();
    rolChecks.forEach(function (btn) {
      var on = rolPermState(btn);
      btn.classList.toggle("checked", on);
      btn.classList.add("is-disabled");
      btn.disabled = true;
      btn.setAttribute("aria-checked", on ? "true" : "false");
      btn.querySelector(".material-symbols-outlined").textContent = on ? "check_box" : "check_box_outline_blank";
    });
  }

  function currentRoleLabel() {
    var chip = page.querySelector('.li[data-field="rol"] .rol-chip');
    if (!chip) return "Médico";
    var last = chip.lastChild;
    return (last && last.nodeType === 3 ? last.textContent : chip.textContent).trim();
  }

  function openRolPicker(opts) {
    opts = opts || {};
    rolCurrentRole = opts.currentRole || "";
    rolSelected = ROLE_KEY[opts.currentRole] || "medico";
    rolOnSave = typeof opts.onSave === "function" ? opts.onSave : null;
    /* reset campos médicos */
    rolFiles = [];
    rolLicencia.value = "";
    rolFfLic.classList.remove("is-error");
    rolSupLic.hidden = true;
    rolSupFoto.hidden = true;
    renderRolFiles();
    renderRolModal();
    rolScrim.classList.add("is-open");
    rolScrim.setAttribute("aria-hidden", "false");
  }
  window.openRolPicker = openRolPicker;
  function closeRolModal() {
    rolScrim.classList.remove("is-open");
    rolScrim.setAttribute("aria-hidden", "true");
  }

  Array.prototype.forEach.call(rolOptions.querySelectorAll(".rol-option"), function (opt) {
    opt.addEventListener("click", function () {
      rolSelected = opt.dataset.role;
      renderRolModal();
    });
  });

  rolSaveBtn.addEventListener("click", function () {
    var label = ROLE_BY_KEY[rolSelected] || "Médico";

    /* Validación de campos médicos obligatorios (promoción de Administrador) */
    if (rolMedicoVisible()) {
      var bad = false;
      if (!rolLicencia.value.trim()) {
        rolFfLic.classList.add("is-error");
        rolSupLic.textContent = "Ingrese el número de licencia médica.";
        rolSupLic.hidden = false;
        bad = true;
      }
      if (!rolFiles.length) {
        rolSupFoto.textContent = "Adjunte la foto de la licencia o título.";
        rolSupFoto.hidden = false;
        rolDrop.classList.add("is-error");
        bad = true;
      }
      if (bad) {
        if (!rolLicencia.value.trim()) { try { rolLicencia.focus(); } catch (e) {} }
        return;
      }
    }

    if (rolOnSave) rolOnSave(label);
    closeRolModal();
    window.openStatusDialog({
      type: "success", icon: "check_circle",
      title: "Rol actualizado",
      desc: "El rol del usuario se cambió a «" + label + "» correctamente. Los permisos se ajustaron automáticamente.",
      buttons: [{ label: "Aceptar", variant: "tonal" }]
    });
  });

  document.getElementById("rolClose").addEventListener("click", closeRolModal);
  document.getElementById("rolCancel").addEventListener("click", closeRolModal);
  rolScrim.addEventListener("click", function (e) { if (e.target === rolScrim) closeRolModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && rolScrim.classList.contains("is-open")) closeRolModal();
  });

  /* ── Uploader · Foto de licencia o título (mismo comportamiento que Nuevo usuario) ── */
  function rolFmtSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }
  function rolKind(name) { return /\.pdf$/i.test(name) ? "pdf" : "jpg"; }
  function renderRolFiles() {
    rolFilesHost.innerHTML = rolFiles.map(function (f, i) {
      var k = rolKind(f.name);
      return '' +
      '<div class="nu-file">' +
        '<div class="thumb ' + k + '">' + k.toUpperCase() + '</div>' +
        '<div class="meta">' +
          '<div class="name">' + f.name.replace(/</g, "&lt;") + '</div>' +
          '<div class="size">' + rolFmtSize(f.size) + ' · subido</div>' +
        '</div>' +
        '<button class="rm" type="button" data-i="' + i + '" aria-label="Quitar archivo"><span class="material-symbols-outlined">close</span></button>' +
      '</div>';
    }).join("");
    rolFilesHost.querySelectorAll(".rm").forEach(function (b) {
      b.addEventListener("click", function () {
        rolFiles.splice(parseInt(b.dataset.i, 10), 1);
        renderRolFiles();
      });
    });
  }
  function addRolFiles(list) {
    Array.prototype.forEach.call(list, function (f) {
      if (/\.(pdf|jpe?g)$/i.test(f.name)) rolFiles.push({ name: f.name, size: f.size });
    });
    rolSupFoto.hidden = true;
    rolDrop.classList.remove("is-error");
    renderRolFiles();
  }
  rolLicencia.addEventListener("input", function () {
    rolFfLic.classList.remove("is-error");
    rolSupLic.hidden = true;
  });
  rolDrop.addEventListener("click", function () { rolFileInput.click(); });
  rolDrop.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rolFileInput.click(); }
  });
  rolFileInput.addEventListener("change", function () { addRolFiles(rolFileInput.files); rolFileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) {
    rolDrop.addEventListener(ev, function (e) { e.preventDefault(); rolDrop.classList.add("is-dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    rolDrop.addEventListener(ev, function (e) { e.preventDefault(); rolDrop.classList.remove("is-dragover"); });
  });
  rolDrop.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addRolFiles(e.dataTransfer.files);
  });

  /* ════════════════════ Modal · Cambiar contraseña ════════════════════ */
  var pwScrim   = document.getElementById("pwScrim");
  var pwActual  = document.getElementById("pwActual");
  var pwNueva   = document.getElementById("pwNueva");
  var pwConfirm = document.getElementById("pwConfirm");

  function openPw() {
    [pwActual, pwNueva, pwConfirm].forEach(function (i) { i.value = ""; i.type = "password"; });
    ["ffPwActual", "ffPwNueva", "ffPwConfirm"].forEach(function (ff) { document.getElementById(ff).classList.remove("is-error"); });
    document.getElementById("supPwActual").hidden = true;
    document.getElementById("supPwConfirm").hidden = true;
    var sn = document.getElementById("supPwNueva"); sn.textContent = "Mínimo 8 caracteres."; sn.hidden = false;
    Array.prototype.forEach.call(pwScrim.querySelectorAll("[data-pw-toggle]"), function (t) { t.textContent = "visibility"; });
    pwScrim.classList.add("is-open");
    pwScrim.setAttribute("aria-hidden", "false");
    setTimeout(function () { pwActual.focus(); }, 60);
  }
  function closePw() { pwScrim.classList.remove("is-open"); pwScrim.setAttribute("aria-hidden", "true"); }

  document.getElementById("pwClose").addEventListener("click", closePw);
  document.getElementById("pwCancelar").addEventListener("click", closePw);
  pwScrim.addEventListener("click", function (e) { if (e.target === pwScrim) closePw(); });

  Array.prototype.forEach.call(pwScrim.querySelectorAll("[data-pw-toggle]"), function (toggleIcon) {
    toggleIcon.addEventListener("click", function () {
      var input = document.getElementById(toggleIcon.getAttribute("data-pw-toggle"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      toggleIcon.textContent = show ? "visibility_off" : "visibility";
    });
  });

  document.getElementById("pwGuardar").addEventListener("click", function () {
    var ok = true, firstBad = null;
    function bad(ff, sup, msg) {
      document.getElementById(ff).classList.add("is-error");
      var s = document.getElementById(sup); s.textContent = msg; s.hidden = false;
      ok = false; if (!firstBad) firstBad = ff;
    }
    function good(ff, sup, keep) {
      document.getElementById(ff).classList.remove("is-error");
      var s = document.getElementById(sup); if (s) { if (keep) { s.textContent = keep; s.hidden = false; } else s.hidden = true; }
    }
    good("ffPwActual", "supPwActual");
    good("ffPwNueva", "supPwNueva", "Mínimo 8 caracteres.");
    good("ffPwConfirm", "supPwConfirm");

    if (!pwActual.value) bad("ffPwActual", "supPwActual", "Ingrese su contraseña actual.");
    if (pwNueva.value.length < 8) bad("ffPwNueva", "supPwNueva", "La nueva contraseña debe tener al menos 8 caracteres.");
    if (!pwConfirm.value) bad("ffPwConfirm", "supPwConfirm", "Confirme la nueva contraseña.");
    else if (pwNueva.value !== pwConfirm.value) bad("ffPwConfirm", "supPwConfirm", "Las contraseñas no coinciden.");

    if (!ok) { var el = document.getElementById(firstBad).querySelector("input"); if (el) setTimeout(function () { el.focus(); }, 60); return; }
    closePw();
    var upd = document.getElementById("pwUpdatedValue");
    if (upd) upd.textContent = "Última actualización: 5 jun. 2026";
    window.openStatusDialog({
      type: "success", icon: "check_circle",
      title: "Contraseña actualizada",
      desc: "Su contraseña se cambió correctamente. Úsela la próxima vez que inicie sesión.",
      buttons: [{ label: "Aceptar", variant: "tonal" }]
    });
  });

  /* ════════════════════ Escape global (cierra el modal abierto) ════════════════════ */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (editScrim.classList.contains("is-open")) closeEdit();
    else if (pwScrim.classList.contains("is-open")) closePw();
  });
})();
