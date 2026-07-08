/* =====================================================================
   Nuevo seguimiento — modal flotante (una sola instancia, dos estados)
   ---------------------------------------------------------------------
   Estado A · Búsqueda  → sólo el Input · Search (colapsado).
   Estado B · Cargado   → al elegir un paciente se revela, de forma
     progresiva, el cuerpo completo: banner de vínculo, tarjeta del
     paciente (estilo ip-card), Canales de seguimiento (form inputs +
     input select), uploader de documentos y los Seguimientos del
     paciente (toggle + bloques editables).
   El contenido pesado se construye al seleccionar y se descarta al
   limpiar/cerrar, de modo que el modal colapsado permanece liviano.
   ===================================================================== */
(function () {
  "use strict";

  var scrim = document.getElementById("nsScrim");
  if (!scrim) return;

  var input    = document.getElementById("nsDni");
  var searchEl = document.getElementById("nsSearch");
  var trail    = document.getElementById("nsTrail");
  var trailIco = trail.querySelector(".material-symbols-outlined");
  var menu     = document.getElementById("nsMenu");
  var hint     = document.getElementById("nsHint");
  var body     = document.querySelector(".ns-modal .ns-body");
  var crearBtn = document.getElementById("nsCrear");
  var cancelar = document.getElementById("nsCancelar");
  var closeBtn = document.getElementById("nsClose");
  var reportar = document.getElementById("nsReportar");
  var openBtns = document.querySelectorAll("#crearSeguimientoBtn, [data-open-seguimiento]");
  var lastOpener = null;

  var DEFAULT_HINT = "Buscamos al paciente en su lista activa a medida que escribe.";

  /* Documentos del sistema (mock). Todos comienzan con "123" para que al
     escribir ese prefijo aparezcan como sugerencias en el dropdown. */
  var PATIENTS = [
    { dni: "1234",      name: "Lucía Ramírez Soto" },
    { dni: "1235",      name: "Carlos Andrés Gómez" },
    { dni: "1236",      name: "Valentina Ríos Mejía" },
    { dni: "123456",    name: "Jorge Esteban Niño" },
    { dni: "123456789", name: "Pedro Pepito Pérez" }
  ];

  var selected   = null;
  var focused    = false;
  var activeIdx  = 0;
  var matches    = [];
  var errorEmpty = false;
  var expanded   = null;   // referencia al nodo del estado cargado

  /* ───────────────────────── utilidades ───────────────────────── */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function digits() { return (input.value || "").replace(/[^0-9]/g, ""); }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "");
  }
  function seed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h;
  }
  function pickFrom(arr, n) { return arr[n % arr.length]; }
  function fmtDoc(dni) { return dni.length > 6 ? dni.replace(/(\d{3})(?=\d)/g, "$1 ").trim() : dni; }

  /* ──────────────────── datos mock del paciente ──────────────────── */
  var SANGRE = ["O+", "A+", "B+", "AB+", "O-", "A-", "Sin registrar"];
  var ALERGIAS = ["No registra alergias", "Penicilina · Sulfamidas", "Aspirina (AAS)", "Mariscos · Yodo", "Polen · Ácaros", "Látex"];
  var CIUDADES = ["Barquisimeto, Lara, Venezuela", "Caracas, Distrito Capital, Venezuela", "Valencia, Carabobo, Venezuela", "Maracaibo, Zulia, Venezuela", "Mérida, Mérida, Venezuela"];
  var CONTACTOS = [["María Ortega", "+58 414 123 25 67"], ["José Restrepo", "+58 412 887 41 20"], ["Ana Lucía Pérez", "+58 424 552 18 03"], ["Carlos Mendoza", "+58 416 310 77 95"], ["Patricia Gil", "+58 414 905 63 41"]];
  var MES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  var FEM = ["Mariana", "María", "Lucía", "Valentina", "Ana", "Patricia"];

  function buildData(p) {
    var s = seed(p.name + p.dni);
    var edad = 28 + (s % 51);
    var nacY = 2026 - edad, nacM = (s >>> 3) % 12, nacD = 1 + ((s >>> 6) % 27);
    var ucY = 2026, ucM = (s >>> 5) % 6, ucD = 1 + ((s >>> 9) % 27);
    var tel = "+58 4" + (10 + (s % 30)) + " " + (100 + ((s >>> 5) % 900)) + " " + (10 + ((s >>> 9) % 90)) + " " + (10 + ((s >>> 11) % 90));
    var nps = 6 + (s % 5);
    var first = String(p.name).trim().split(/\s+/)[0];
    var last  = String(p.name).trim().split(/\s+/).pop();
    var correo = (first + "." + last).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "@gmail.com";
    var c = pickFrom(CONTACTOS, s >>> 4);
    var dni = p.dni;
    var dniFmt = dni.length > 6 ? dni.replace(/(\d{3})(?=\d)/g, "$1 ").trim() : dni;
    return {
      name: p.name, dni: dni, documento: dniFmt,
      edad: edad + " años",
      genero: FEM.indexOf(first) !== -1 ? "Femenino" : "Masculino",
      sangre: pickFrom(SANGRE, s >>> 2),
      telefono: tel,
      telDigits: tel.replace(/[^0-9]/g, ""),
      nps: nps + "/10 – Paciente " + (nps >= 9 ? "muy satisfecho" : nps >= 7 ? "satisfecho" : "conforme") + " con el seguimiento; solicita recordatorios de medicación por WhatsApp y ajuste de horarios de control.",
      nacimiento: nacD + " " + MES[nacM] + " " + nacY,
      ultimaConsulta: ucD + " " + MES[ucM] + " " + ucY,
      correo: correo,
      alergias: pickFrom(ALERGIAS, s >>> 1),
      contactoNombre: c[0], contactoTel: c[1],
      direccion: "Calle " + (10 + (s % 80)) + " #" + (10 + ((s >>> 3) % 80)) + "-" + (10 + ((s >>> 6) % 80)) + ". " + pickFrom(CIUDADES, s >>> 5)
    };
  }

  /* ─────────────────────── builders de HTML ─────────────────────── */
  function fieldRow(label, value) {
    return '<div class="ip-row"><div class="ip-rl"><span class="ip-lbl">' + label + '</span>' +
      '<span class="ip-val">' + esc(value) + '</span></div></div>';
  }
  function sFieldRow(label, value, icon) {
    return '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">' + label + '</span>' +
      (icon ? '<button class="ip-ed" type="button" aria-label="Información"><span class="material-symbols-outlined">' + icon + '</span></button>' : "") +
      '</div><span class="ip-sval">' + esc(value) + '</span></div>';
  }

  function patientCard(d) {
    return '<div class="ns-banner ns-banner--success">' +
        '<span class="material-symbols-outlined">check_circle</span>' +
        '<div class="ns-banner-tx"><span class="t">¡Datos del paciente vinculados con éxito!</span>' +
        '<span class="s">Hemos vinculado de manera exitosa los datos del paciente provenientes del sistema ' + esc("<API nombre del sistema>") + '.</span></div>' +
      '</div>' +
      '<div class="ip-card ns-pcard">' +
        '<div class="ip-pc-head">' +
          '<div class="ip-who"><div class="ip-av">' + esc(initials(d.name)) + '</div>' +
            '<span class="ip-pname">' + esc(d.name) + '</span></div>' +
          '<div class="ns-pc-actions">' +
            '<button class="ip-ed plain" type="button" aria-label="Abrir paciente"><span class="material-symbols-outlined">open_in_new</span></button>' +
            '<button class="ns-pc-del" id="nsUnlink" type="button" aria-label="Desvincular paciente"><span class="material-symbols-outlined">delete</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="ip-panel">' +
          '<div class="ip-col">' +
            fieldRow("Documento/DNI:", d.documento) + fieldRow("Edad:", d.edad) +
            fieldRow("Grupo sanguíneo:", d.sangre) + fieldRow("Teléfono:", d.telefono) +
            sFieldRow("NPS:", d.nps, "info") +
          '</div>' +
          '<div class="ip-col">' +
            fieldRow("Fecha de nacimiento:", d.nacimiento) + fieldRow("Género:", d.genero) +
            fieldRow("Última consulta:", d.ultimaConsulta) + fieldRow("Correo:", d.correo) +
            sFieldRow("Alergias:", d.alergias) +
          '</div>' +
        '</div>' +
        '<div class="ip-extra">' +
          '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">Contactos de emergencia:</span></div>' +
            '<span class="ip-sval bullet">' + esc(d.contactoNombre) + ': ' + esc(d.contactoTel) + '</span></div>' +
          '<div class="ip-row" style="min-height:auto;align-items:flex-start;">' +
            '<div class="ip-rl" style="align-items:flex-start;"><span class="ip-lbl">Dirección:</span>' +
            '<span class="ip-val" style="white-space:normal;">' + esc(d.direccion) + '</span></div></div>' +
        '</div>' +
      '</div>';
  }

  /* Input · Select reutilizable */
  var COD_OPTS = [
    { v: "+58", t: "Venezuela (+58)" }, { v: "+57", t: "Colombia (+57)" },
    { v: "+52", t: "México (+52)" }, { v: "+51", t: "Perú (+51)" },
    { v: "+56", t: "Chile (+56)" }, { v: "+593", t: "Ecuador (+593)" }
  ];
  var FREQ_OPTS = ["Horas", "Días", "Semanas"];

  function selectMarkup(id, label, value, opts) {
    var items = opts.map(function (o) {
      var v = o.v != null ? o.v : o, t = o.t != null ? o.t : o;
      return '<div class="menu-item ns-opt" role="option" data-value="' + esc(v) + '"' +
        (t === value || v === value ? ' aria-selected="true"' : "") + '>' + esc(t) + '</div>';
    }).join("");
    var cur = opts.filter(function (o) { var v = o.v != null ? o.v : o, t = o.t != null ? o.t : o; return t === value || v === value; })[0];
    var curText = cur ? (cur.t != null ? cur.t : cur) : value;
    return '<div class="ff ff-select ns-select" data-id="' + id + '">' +
        '<div class="ff-box" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="ff-value">' + esc(curText) + '</span>' +
          '<label class="ff-label">' + label + '</label>' +
          '<span class="ff-icon material-symbols-outlined">arrow_drop_down</span>' +
        '</div>' +
        '<div class="menu nu-menu" role="listbox">' + items + '</div>' +
      '</div>';
  }

  function channelsMarkup(d) {
    return '<div class="ns-section">' +
        '<h3 class="ns-sec-title">Canales de seguimiento</h3>' +
        '<p class="ns-sec-sub">Esta información de contacto es obligatoria ya que a través de estos canales el paciente recibirá el seguimiento pautado.</p>' +
      '</div>' +
      '<div class="ns-form">' +
        '<div class="ff" data-nsfield="correo">' +
          '<div class="ff-box"><input class="ff-input" id="nsCorreo" type="email" autocomplete="off" placeholder="correo@correo.com" value="' + esc(d.correo) + '">' +
          '<label class="ff-label" for="nsCorreo">Correo <span class="req">*</span></label></div>' +
          '<div class="ff-support" hidden></div>' +
        '</div>' +
        '<div class="ns-grid-tel">' +
          selectMarkup("codigo", "Código", "+58", COD_OPTS) +
          '<div class="ff" data-nsfield="tel">' +
            '<div class="ff-box"><input class="ff-input" id="nsTel" type="tel" inputmode="numeric" autocomplete="off" placeholder="000 000 000" value="' + esc(d.telDigits) + '">' +
            '<label class="ff-label" for="nsTel">Teléfono <span class="req">*</span></label></div>' +
            '<div class="ff-support" hidden></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ns-uploader">' +
        '<span class="ns-up-label">Documentos adicionales del paciente (Historia, ordenes y/o estudios).</span>' +
        '<div class="nu-drop" id="nsDrop" role="button" tabindex="0">' +
          '<span class="material-symbols-outlined">cloud_upload</span>' +
          '<span class="nu-cta">Haga click para subir archivos <span class="nu-cta-plain">o arrastre archivos aquí</span></span>' +
          '<span class="nu-support">Sólo archivos PDF, JPG o JPEG (máximo 10MB)</span>' +
        '</div>' +
        '<input id="nsFileInput" type="file" accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg" multiple hidden>' +
        '<div class="nu-files" id="nsFiles"></div>' +
      '</div>';
  }

  /* ── Seguimientos / programación ── */
  var DEFAULT_QS = {
    1: ["¿Pudo iniciar el tratamiento indicado?", "¿Ha sentido alguna reacción adversa o molestia nueva tras haber iniciado el tratamiento indicado?", "¿Qué intensidad tiene su molestia o síntoma principal el día de hoy?", "¿Tiene alguna duda sobre las indicaciones?"],
    2: ["¿Ha continuado con su tratamiento exactamente como se indicó?", "Comparado con el primer día, ¿cómo describiría la evolución de su síntoma principal hoy?", "¿Ha aparecido algún síntoma NUEVO que no tenía el día de la consulta?"],
    cierre: ["¿Logró terminar todo el esquema de tratamiento por los días indicados?", "En términos generales, ¿considera que el problema por el que consultó ya se resolvió?", "Según cómo se siente, ¿necesita agendar una nueva consulta de control con su médico?"]
  };

  /* locked=true → pregunta por defecto: input deshabilitado y sin botón ×.
     locked=false → pregunta que agrega el usuario: editable y con ×. */
  function questionRow(text, locked) {
    if (locked) {
      return '<div class="ns-q ns-q--locked">' +
        '<input class="ns-q-input" type="text" value="' + esc(text) + '" disabled aria-readonly="true"></div>';
    }
    return '<div class="ns-q"><input class="ns-q-input" type="text" value="' + esc(text) + '" placeholder="Escriba la pregunta del seguimiento">' +
      '<button class="ns-q-rm" type="button" aria-label="Quitar pregunta"><span class="material-symbols-outlined">close</span></button></div>';
  }
  function attachRow() {
    return '<div class="ns-q ns-q--attach"><span class="ns-q-attach-tx">Adjunte resultados de ordenes o estudio médicos realizados</span>' +
      '<button class="ns-q-add-file" type="button" aria-label="Adjuntar"><span class="material-symbols-outlined">add</span></button></div>';
  }
  function followupBlock(opts) {
    var freq = opts.freq || "Días", num = opts.num != null ? opts.num : 8;
    /* Las preguntas por defecto (precargadas) van bloqueadas; las que el
       usuario agregue luego serán editables (locked=false). */
    var lockDefaults = !!opts.lockQuestions;
    var qs = (opts.questions || []).map(function (q) { return questionRow(q, lockDefaults); }).join("");
    var titleTx = opts.cierre ? ("Seguimiento #" + opts.n + " (seguimiento de cierre)") : ("Seguimiento #" + opts.n);
    /* solo los seguimientos que agrega el usuario son eliminables */
    var delBtn = opts.deletable
      ? '<button class="ns-fu-del" type="button" aria-label="Eliminar seguimiento"><span class="material-symbols-outlined">delete</span></button>'
      : '';
    return '<div class="ns-fu' + (opts.deletable ? ' ns-fu--deletable' : '') + '" data-cierre="' + (opts.cierre ? "1" : "0") + '">' +
        '<div class="ns-fu-head"><span class="ns-fu-title">' + esc(titleTx) + '</span>' + delBtn + '</div>' +
        '<div class="ns-grid-freq">' +
          selectMarkup("freq", "Frecuencia", freq, FREQ_OPTS) +
          '<div class="ff" data-nsfield="num"><div class="ff-box">' +
            '<input class="ff-input ns-fu-num" type="text" inputmode="numeric" value="' + esc(num) + '"></div></div>' +
        '</div>' +
        '<span class="ns-q-label">Preguntas</span>' +
        '<div class="ns-qs">' + qs + '</div>' +
        '<button class="ns-add-q" type="button"><span class="material-symbols-outlined">add</span>Agregar pregunta</button>' +
        attachRow() +
      '</div>';
  }

  function scheduleMarkup() {
    return '<div class="ns-section ns-section--row">' +
        '<div><h3 class="ns-sec-title">Seguimientos del paciente</h3>' +
        '<p class="ns-sec-sub">Defina el horario de cada mensaje de seguimiento que recibirá el paciente.</p></div>' +
        '<button class="track on" id="nsSchedToggle" role="switch" aria-checked="true" aria-label="Activar seguimientos"></button>' +
      '</div>' +
      '<div class="ns-sched" id="nsSched">' +
        followupBlock({ n: 1, freq: "Horas", num: 36, questions: DEFAULT_QS[1], lockQuestions: true }) +
        followupBlock({ n: 2, freq: "Días", num: 4, questions: DEFAULT_QS[2], lockQuestions: true }) +
        '<button class="ns-add-fu" id="nsAddFu" type="button"><span class="material-symbols-outlined">add</span>Agregar seguimiento</button>' +
        followupBlock({ n: 3, freq: "Días", num: 8, questions: DEFAULT_QS.cierre, cierre: true, lockQuestions: true }) +
      '</div>';
  }

  /* Línea de disponibilidad repetida sobre el footer (estado cargado) */
  function availabilityRepeat() {
    return '<div class="ns-avail-foot">' +
        '<span class="pg-label">Seguimientos disponibles: 50/100</span>' +
        '<div class="pg-track"><div class="pg-fill" style="width:50%"></div></div>' +
      '</div>';
  }

  /* ───────────────────── render del estado cargado ───────────────────── */
  function buildExpanded(p) {
    var d = buildData(p);
    var wrap = document.createElement("div");
    wrap.className = "ns-expanded";
    wrap.id = "nsExpanded";
    /* clip wrapper: la técnica grid 0fr→1fr hace crecer el bloque hasta la
       altura NATURAL del contenido con una transición CSS pura, sin medir. */
    wrap.innerHTML = '<div class="ns-expanded-clip"><div class="ns-expanded-inner">' +
      patientCard(d) + channelsMarkup(d) + scheduleMarkup() + availabilityRepeat() +
      '</div></div>';
    body.appendChild(wrap);
    expanded = wrap;
    wireExpanded(wrap);
    animateOpen(wrap);
  }

  /* Apertura: animación de ALTURA explícita (técnica acordeón universal).
     Medimos la altura natural del contenido (scrollHeight, que ignora el
     recorte), partimos de 0 y transicionamos a esa altura en px; al terminar
     liberamos a `auto` para que el modal siga siendo responsivo. Todo vía
     estilos inline (no togglear clases tras insertar el nodo, que un observador
     del editor podría revertir) y sin depender de la interpolación de unidades
     `fr` en grid — funciona idéntico en todos los navegadores. */
  function animateOpen(wrap) {
    var inner = wrap.querySelector(".ns-expanded-inner");
    if (prefersReduced()) {
      wrap.style.height = "auto";
      wrap.style.overflow = "visible";
      if (inner) inner.style.opacity = "1";
      return;
    }
    wrap.style.overflow = "hidden";
    wrap.style.height = "0px";
    if (inner) { inner.style.opacity = "0"; inner.style.transform = "translateY(6px)"; }
    var target = wrap.scrollHeight;                 /* altura natural del contenido */
    void wrap.offsetHeight;                         /* compromete el estado base 0px */
    wrap.style.transition = "height 340ms cubic-bezier(0.4,0,0.2,1)";
    if (inner) inner.style.transition = "opacity 240ms ease 80ms, transform 260ms cubic-bezier(0.4,0,0.2,1) 80ms";
    wrap.style.height = target + "px";
    if (inner) { inner.style.opacity = "1"; inner.style.transform = "none"; }
    var done = false;
    function end(e) {
      if (done || (e && (e.target !== wrap || (e.propertyName && e.propertyName !== "height")))) return;
      done = true;
      wrap.removeEventListener("transitionend", end);
      /* liberar: altura natural + overflow visible (selects internos no recortados) */
      wrap.style.transition = "";
      wrap.style.height = "auto";
      wrap.style.overflow = "visible";
      if (inner) { inner.style.transition = ""; inner.style.transform = ""; }
    }
    wrap.addEventListener("transitionend", end);
    setTimeout(end, 460);                           /* fallback fiable */
  }

  function destroyExpanded() {
    if (expanded && expanded.parentNode) expanded.parentNode.removeChild(expanded);
    expanded = null;
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Cierre: contrae la altura de su valor actual a 0 (simétrico con la
     apertura) y elimina el nodo al terminar, sin salto. */
  function animateClose(cb) {
    var wrap = expanded;
    if (!wrap) { if (cb) cb(); return; }
    if (prefersReduced()) { destroyExpanded(); if (cb) cb(); return; }
    var inner = wrap.querySelector(".ns-expanded-inner");
    var start = wrap.offsetHeight;                  /* altura actual real */
    wrap.style.overflow = "hidden";
    wrap.style.height = start + "px";
    void wrap.offsetHeight;                         /* compromete la altura inicial */
    wrap.style.transition = "height 260ms cubic-bezier(0.4,0,0.2,1)";
    if (inner) { inner.style.transition = "opacity 180ms ease"; inner.style.opacity = "0"; }
    wrap.style.height = "0px";
    var done = false;
    function end(e) {
      if (done || (e && (e.target !== wrap || (e.propertyName && e.propertyName !== "height")))) return;
      done = true;
      wrap.removeEventListener("transitionend", end);
      destroyExpanded();
      if (cb) cb();
    }
    wrap.addEventListener("transitionend", end);
    setTimeout(end, 380);   /* fallback fiable */
  }

  /* ───────────────────────── wiring expandido ───────────────────────── */
  function wireExpanded(root) {
    /* desvincular paciente → volver a estado búsqueda */
    var del = root.querySelector("#nsUnlink");
    if (del) del.addEventListener("click", function () { clearInput(); });

    /* selects (código + frecuencias) */
    Array.prototype.forEach.call(root.querySelectorAll(".ns-select"), initSelect);

    /* uploader */
    initUploader(root);

    /* toggle de programación */
    var toggle = root.querySelector("#nsSchedToggle");
    var sched  = root.querySelector("#nsSched");
    toggle.addEventListener("click", function () {
      var on = toggle.getAttribute("aria-checked") !== "true";
      toggle.setAttribute("aria-checked", on ? "true" : "false");
      toggle.classList.toggle("on", on);
      sched.classList.toggle("is-disabled", !on);
    });

    /* delegación: agregar/quitar pregunta, agregar seguimiento */
    root.addEventListener("click", function (e) {
      var addQ = e.target.closest(".ns-add-q");
      if (addQ) {
        var qs = addQ.parentNode.querySelector(".ns-qs");
        qs.insertAdjacentHTML("beforeend", questionRow(""));
        var last = qs.lastElementChild.querySelector(".ns-q-input");
        if (last) last.focus();
        return;
      }
      var rmQ = e.target.closest(".ns-q-rm");
      if (rmQ) { var qrow = rmQ.closest(".ns-q"); if (qrow) qrow.remove(); return; }

      var addFu = e.target.closest("#nsAddFu");
      if (addFu) { addFollowup(root, addFu); return; }

      /* eliminar seguimiento (solo añadidos por el usuario) → confirmar inline */
      var delFu = e.target.closest(".ns-fu-del");
      if (delFu) { askDeleteFu(delFu.closest(".ns-fu")); return; }
      var cancelFu = e.target.closest(".ns-fu-cancel");
      if (cancelFu) { closeDeleteConfirm(cancelFu.closest(".ns-fu")); return; }
      var confirmFu = e.target.closest(".ns-fu-confirm-del");
      if (confirmFu) {
        var fu = confirmFu.closest(".ns-fu");
        if (fu) { fu.remove(); renumber(root); }
        return;
      }
    });
  }

  /* Confirmación inline (sin diálogo nativo): el encabezado muestra una
     pregunta + Cancelar / Eliminar. */
  function askDeleteFu(fu) {
    if (!fu) return;
    var head = fu.querySelector(".ns-fu-head");
    if (head.querySelector(".ns-fu-confirm")) return;
    fu.classList.add("is-confirming");
    var box = document.createElement("div");
    box.className = "ns-fu-confirm";
    box.innerHTML = '<span class="ns-fu-confirm-tx">¿Eliminar este seguimiento?</span>' +
      '<button class="ns-fu-cancel" type="button">Cancelar</button>' +
      '<button class="ns-fu-confirm-del" type="button">Eliminar</button>';
    head.appendChild(box);
  }
  function closeDeleteConfirm(fu) {
    if (!fu) return;
    fu.classList.remove("is-confirming");
    var box = fu.querySelector(".ns-fu-confirm");
    if (box) box.remove();
  }

  function addFollowup(root, beforeBtn) {
    var html = followupBlock({ n: 0, freq: "Días", num: 7, questions: [""], deletable: true });
    beforeBtn.insertAdjacentHTML("beforebegin", html);
    var node = beforeBtn.previousElementSibling;
    Array.prototype.forEach.call(node.querySelectorAll(".ns-select"), initSelect);
    renumber(root);
    var inp = node.querySelector(".ns-q-input");
    if (inp) inp.focus();
  }

  function renumber(root) {
    var blocks = root.querySelectorAll(".ns-fu");
    var n = 0;
    Array.prototype.forEach.call(blocks, function (b) {
      n++;
      var cierre = b.getAttribute("data-cierre") === "1";
      var title = b.querySelector(".ns-fu-title");
      title.textContent = cierre ? ("Seguimiento #" + n + " (seguimiento de cierre)") : ("Seguimiento #" + n);
    });
  }

  /* ── Input · Select genérico ── */
  var openSelect = null;
  function initSelect(sel) {
    var box  = sel.querySelector(".ff-box");
    var val  = sel.querySelector(".ff-value");
    var icon = sel.querySelector(".ff-icon");
    function close() { sel.classList.remove("is-open"); box.setAttribute("aria-expanded", "false"); icon.textContent = "arrow_drop_down"; if (openSelect === sel) openSelect = null; }
    function open() {
      if (openSelect && openSelect !== sel) openSelect.classList.remove("is-open");
      sel.classList.add("is-open"); box.setAttribute("aria-expanded", "true"); icon.textContent = "arrow_drop_up"; openSelect = sel;
    }
    box.addEventListener("click", function (e) { e.stopPropagation(); sel.classList.contains("is-open") ? close() : open(); });
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); } });
    Array.prototype.forEach.call(sel.querySelectorAll(".ns-opt"), function (opt) {
      opt.addEventListener("click", function (e) {
        e.stopPropagation();
        Array.prototype.forEach.call(sel.querySelectorAll(".ns-opt"), function (o) { o.removeAttribute("aria-selected"); });
        opt.setAttribute("aria-selected", "true");
        val.textContent = opt.textContent;
        sel.setAttribute("data-value", opt.getAttribute("data-value"));
        close();
      });
    });
    sel._close = close;
  }
  document.addEventListener("click", function () { if (openSelect && openSelect._close) openSelect._close(); });

  /* ── File uploader ── */
  function initUploader(root) {
    var drop  = root.querySelector("#nsDrop");
    var fileI = root.querySelector("#nsFileInput");
    var list  = root.querySelector("#nsFiles");
    var files = [];

    function fmtSize(b) { return b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB"; }
    function render() {
      list.innerHTML = files.map(function (f, i) {
        var ext = (f.name.split(".").pop() || "").toLowerCase();
        var cls = ext === "pdf" ? "pdf" : "jpg";
        var ic  = ext === "pdf" ? "picture_as_pdf" : "image";
        return '<div class="nu-file"><div class="thumb ' + cls + '"><span class="material-symbols-outlined">' + ic + '</span></div>' +
          '<div class="meta"><div class="name">' + esc(f.name) + '</div><div class="size">' + fmtSize(f.size) + '</div></div>' +
          '<button class="rm" type="button" data-i="' + i + '" aria-label="Quitar archivo"><span class="material-symbols-outlined">close</span></button></div>';
      }).join("");
      Array.prototype.forEach.call(list.querySelectorAll(".rm"), function (b) {
        b.addEventListener("click", function () { files.splice(+b.getAttribute("data-i"), 1); render(); });
      });
    }
    function add(fl) {
      Array.prototype.forEach.call(fl, function (f) {
        var ext = (f.name.split(".").pop() || "").toLowerCase();
        if (["pdf", "jpg", "jpeg"].indexOf(ext) !== -1) files.push(f);
      });
      render();
    }
    drop.addEventListener("click", function () { fileI.click(); });
    drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileI.click(); } });
    fileI.addEventListener("change", function () { add(fileI.files); fileI.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-dragover"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-dragover"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files); });
  }

  /* ───────────────────────── Input · Search ───────────────────────── */
  function computeMatches() {
    var d = digits();
    matches = d ? PATIENTS.filter(function (p) { return p.dni.indexOf(d) === 0; }) : [];
  }
  function renderMenu() {
    var d = digits();
    var show = focused && d.length > 0 && !selected;
    if (!show) { menu.hidden = true; menu.innerHTML = ""; return; }
    menu.hidden = false;
    if (matches.length > 0) {
      menu.innerHTML = matches.map(function (p, i) {
        return '<button type="button" class="ns-item' + (i === activeIdx ? " is-active" : "") + '" role="option" data-dni="' + p.dni + '" aria-selected="' + (i === activeIdx) + '">' +
          '<span class="mi-icon"><span class="material-symbols-outlined">person</span></span>' +
          '<span class="mi-text"><span class="mi-name">' + esc(p.name) + '</span>' +
          '<span class="mi-meta"><b>' + p.dni.slice(0, d.length) + '</b>' + p.dni.slice(d.length) + '</span></span></button>';
      }).join("");
      /* Sin listeners por-nodo: la selección y el hover se manejan por
         DELEGACIÓN en el contenedor `menu` (ver más abajo). Reconstruir el
         innerHTML aquí ya no destruye los handlers, porque viven en el padre
         estable — esto arregla el bug de "clic en resultado no hace nada"
         en navegadores donde el rebuild detachá el nodo antes del click. */
    } else {
      menu.innerHTML = '<div class="ns-empty">No hemos encontrado resultados para <b>' + d + '</b></div>' +
        '<button type="button" class="ns-add" id="nsAdd"><span class="material-symbols-outlined">add</span>Agregar nueva historia</button>';
    }
  }

  /* Resalta el item activo SIN reconstruir el innerHTML (solo togglea clases),
     para no destruir el nodo bajo el cursor durante la interacción. */
  function setActive(i) {
    var items = menu.querySelectorAll(".ns-item");
    if (!items.length) return;
    activeIdx = Math.max(0, Math.min(i, items.length - 1));
    Array.prototype.forEach.call(items, function (el, idx) {
      el.classList.toggle("is-active", idx === activeIdx);
      el.setAttribute("aria-selected", idx === activeIdx ? "true" : "false");
    });
  }

  /* DELEGACIÓN (se registra UNA vez sobre el contenedor estable `menu`):
     — selección en `mousedown` (dispara antes del blur y antes de cualquier
       cancelación de `click`; preventDefault mantiene el foco hasta pick()).
     — hover con `mouseover` que solo togglea clases. */
  menu.addEventListener("mousedown", function (e) {
    var item = e.target.closest(".ns-item");
    var add  = e.target.closest("#nsAdd");
    if (item || add) e.preventDefault();       /* no perder foco del input */
    if (item) {
      var dni = item.getAttribute("data-dni");
      var p = matches.filter(function (x) { return x.dni === dni; })[0];
      if (p) pick(p);
    }
  });
  menu.addEventListener("mouseover", function (e) {
    var item = e.target.closest(".ns-item");
    if (!item) return;
    var items = Array.prototype.slice.call(menu.querySelectorAll(".ns-item"));
    var i = items.indexOf(item);
    if (i >= 0 && i !== activeIdx) setActive(i);
  });

  function update() {
    var d = digits();
    var hasText = d.length > 0;
    var showError = errorEmpty && !hasText;
    searchEl.classList.toggle("is-focused", focused);
    searchEl.classList.toggle("is-error", showError);
    searchEl.classList.toggle("has-text", hasText);
    if (showError)     trailIco.textContent = "error";
    else if (hasText)  trailIco.textContent = "close";
    else               trailIco.textContent = "search";
    trail.setAttribute("aria-label", hasText && !showError ? "Borrar" : "Buscar");

    hint.classList.toggle("is-error", showError);
    hint.classList.toggle("is-ok", !!selected);
    if (showError) hint.innerHTML = '<span class="material-symbols-outlined">error</span>Debe especificar documento/DNI para crear seguimiento.';
    else if (selected) hint.innerHTML = '<span class="material-symbols-outlined">check_circle</span>Paciente encontrado en su lista activa.';
    else hint.textContent = DEFAULT_HINT;
    renderMenu();
  }

  function pick(p) {
    selected = p;
    errorEmpty = false;
    input.value = p.name + " · " + fmtDoc(p.dni);
    focused = false;
    input.blur();
    update();
    destroyExpanded();
    buildExpanded(p);
    scrim.scrollTop = 0;
  }

  function clearInput() {
    input.value = "";
    selected = null;
    activeIdx = 0;
    errorEmpty = false;
    if (expanded) {
      animateClose(function () { computeMatches(); input.focus(); update(); });
    } else {
      destroyExpanded();
      computeMatches();
      input.focus();
      update();
    }
  }

  input.addEventListener("input", function () {
    var d = digits();
    if (input.value !== d && !selected) input.value = d;
    if (selected) { selected = null; destroyExpanded(); }
    activeIdx = 0; errorEmpty = false;
    computeMatches();
    /* NO se vincula/expande automáticamente al escribir, ni siquiera con
       coincidencia exacta: la expansión ocurre SOLO al elegir un resultado
       del dropdown (clic) o con Enter sobre el resultado resaltado. */
    update();
  });
  input.addEventListener("focus", function () { focused = true; update(); });
  input.addEventListener("blur", function () { focused = false; setTimeout(update, 0); });
  input.addEventListener("keydown", function (e) {
    var show = !menu.hidden && matches.length > 0;
    if (e.key === "ArrowDown" && show) { e.preventDefault(); setActive(activeIdx + 1); }
    else if (e.key === "ArrowUp" && show) { e.preventDefault(); setActive(activeIdx - 1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      /* Enter vincula SOLO el resultado actualmente resaltado en el dropdown,
         nunca por coincidencia exacta de lo escrito (eso sería automático). */
      if (show && matches[activeIdx]) pick(matches[activeIdx]);
    } else if (e.key === "Escape") { if (!menu.hidden) { focused = false; update(); } else closeModal(); }
  });
  searchEl.addEventListener("mousedown", function (e) {
    if (e.target.closest(".ns-trail") || e.target.closest(".ns-menu")) return;
    e.preventDefault(); input.focus();
  });
  trail.addEventListener("click", function () { if (digits().length > 0) clearInput(); else input.focus(); });

  /* ───────────────────────── abrir / cerrar ───────────────────────── */
  function openModal() {
    selected = null; activeIdx = 0; focused = false; errorEmpty = false;
    input.value = "";
    destroyExpanded();
    computeMatches(); update();
    scrim.classList.add("is-open");
    scrim.setAttribute("aria-hidden", "false");
    scrim.scrollTop = 0;
    setTimeout(function () { input.focus(); }, 80);
  }
  function closeModal() {
    scrim.classList.remove("is-open");
    scrim.setAttribute("aria-hidden", "true");
    menu.hidden = true;
    if (lastOpener && lastOpener.focus) { try { lastOpener.focus(); } catch (e) {} }
  }

  Array.prototype.forEach.call(openBtns, function (b) { b.addEventListener("click", function () { lastOpener = b; openModal(); }); });
  closeBtn.addEventListener("click", closeModal);
  cancelar.addEventListener("click", closeModal);
  scrim.addEventListener("click", function (e) { if (e.target === scrim) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrim.classList.contains("is-open") && menu.hidden && !openSelect) closeModal();
  });

  reportar.addEventListener("click", function () {
    window.open(window.SC_REPORT_FORM_URL, "_blank", "noopener");
  });

  /* ───────────────────── validación + crear ───────────────────── */
  function markField(field, bad, msg) {
    if (!field) return;
    field.classList.toggle("is-error", bad);
    var sup = field.querySelector(".ff-support");
    if (sup) { if (bad && msg) { sup.textContent = msg; sup.hidden = false; } else { sup.hidden = true; } }
  }

  function validateChannels() {
    if (!expanded) return false;
    var correoF = expanded.querySelector('[data-nsfield="correo"]');
    var telF    = expanded.querySelector('[data-nsfield="tel"]');
    var correo  = expanded.querySelector("#nsCorreo").value.trim();
    var tel     = expanded.querySelector("#nsTel").value.replace(/[^0-9]/g, "");
    var okCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    var okTel = tel.length >= 7;
    markField(correoF, !okCorreo, "Ingrese un correo válido.");
    markField(telF, !okTel, "Ingrese un teléfono válido.");
    var first = !okCorreo ? expanded.querySelector("#nsCorreo") : (!okTel ? expanded.querySelector("#nsTel") : null);
    if (first) { first.focus(); first.scrollIntoView && first.scrollIntoView({ block: "center" }); }
    return okCorreo && okTel;
  }

  /* limpiar error del campo al editar */
  body.addEventListener("input", function (e) {
    var ff = e.target.closest && e.target.closest(".ff.is-error");
    if (ff) { ff.classList.remove("is-error"); var s = ff.querySelector(".ff-support"); if (s) s.hidden = true; }
  });

  crearBtn.addEventListener("click", function () {
    /* Estado búsqueda · sin paciente */
    if (!selected) {
      if (!digits()) { errorEmpty = true; update(); input.focus(); return; }
      var ex = PATIENTS.filter(function (p) { return p.dni === digits(); })[0];
      if (ex) { pick(ex); return; }
      focused = true; input.focus(); update(); return;
    }
    /* Estado cargado · validar canales */
    if (!validateChannels()) return;
    var p = selected;
    openDeclaration(p);
  });

  /* ── Flujo legal: Declaración de responsabilidad → éxito ──
     Al pulsar "Crear seguimiento" (con canales válidos) se muestra la
     Declaración de responsabilidad. El checkbox de consentimiento viene
     marcado; si el usuario lo desmarca y pulsa "Aceptar", se muestra el
     error inline y no avanza. Al aceptar con el checkbox marcado se registra
     el log legal y se muestra el modal de éxito. */
  function declarationHTML() {
    return '<div class="ns-decl">' +
        '<p class="ns-decl-p">El seguimiento en Secuence se realiza mediante herramientas automatizadas y no constituye monitoreo en tiempo real.</p>' +
        '<p class="ns-decl-p">Usted sigue siendo responsable del seguimiento clínico activo del paciente.</p>' +
        '<p class="ns-decl-p">Debe asegurarse de que el paciente haya otorgado su consentimiento informado para el uso de esta herramienta.</p>' +
        '<p class="ns-decl-err" id="nsDeclErr" hidden>Por favor seleccione la siguiente declaración para finalizar configuración de seguimiento:</p>' +
        '<label class="ns-decl-check" id="nsDeclRow" for="nsDeclCheck">' +
          '<input type="checkbox" id="nsDeclCheck" checked>' +
          '<span class="ns-decl-box" aria-hidden="true"><span class="material-symbols-outlined">check</span></span>' +
          '<span class="ns-decl-tx">Entiendo que la información y alertas generadas por Secuence deben ser interpretadas dentro de mi criterio clínico y no constituyen decisiones médicas automáticas. Confirmo que el paciente ha otorgado su consentimiento informado.</span>' +
        '</label>' +
      '</div>';
  }

  function openDeclaration(p) {
    if (!window.openStatusDialog) return;
    window.openStatusDialog({
      type: "decl", icon: "", title: "Declaración de responsabilidad",
      html: declarationHTML(),
      onOpen: function () {
        var cb  = document.getElementById("nsDeclCheck");
        var err = document.getElementById("nsDeclErr");
        var row = document.getElementById("nsDeclRow");
        if (cb) cb.addEventListener("change", function () {
          if (cb.checked) { if (err) err.hidden = true; if (row) row.classList.remove("is-error"); }
        });
      },
      buttons: [{
        label: "Aceptar", variant: "tonal",
        onClick: function () {
          var cb  = document.getElementById("nsDeclCheck");
          var err = document.getElementById("nsDeclErr");
          var row = document.getElementById("nsDeclRow");
          if (!cb || !cb.checked) {
            if (err) err.hidden = false;
            if (row) row.classList.add("is-error");
            return true;   /* keepOpen: no avanza sin consentimiento */
          }
          /* Log legal (prototipo · sin backend) */
          console.log("[Secuence · Log legal]", {
            quienActivo: "Sesión médica actual",
            pacienteAsociado: p.name + " · DNI " + p.dni,
            confirmaciones: ["Criterio clínico", "Consentimiento informado del paciente"],
            fecha: new Date().toISOString()
          });
          closeModal();
          openSuccess(p);
          return true;   /* keepOpen: openSuccess ya reabrió el diálogo; evita
                            que el framework lo cierre tras este onClick */
        }
      }]
    });
  }

  function openSuccess(p) {
    window.openStatusDialog({
      type: "success", icon: "check_circle",
      title: "¡Seguimiento médico creado con éxito!",
      desc: "El paciente recibirá mensajes de seguimiento vía WhatsApp y correo electrónico registrados.",
      buttons: [{ label: "Finalizar", variant: "tonal" }]
    });
  }
})();
