/* =====================================================================
   Dialog · Próximos seguimientos (con edición inline)
   window.openProximosDialog(patient) abre el modal con TODOS los próximos
   seguimientos programados del paciente. Cada seguimiento es un Accordion
   (DS) que muestra su calendario de "Preguntas".

   El lápiz de cada seguimiento conmuta ESE seguimiento a modo edición
   (sin salir de la vista): se editan la frecuencia + nº (Horas/Días/
   Semanas, como en "Nuevo seguimiento") y las preguntas (editar texto,
   agregar y quitar). Guardar / Cancelar por seguimiento. Eliminar pide
   confirmación inline. "Agregar seguimiento" añade un seguimiento nuevo
   inline en modo edición. Los cambios persisten durante la sesión
   (sobreviven al cerrar/reabrir el modal). Datos deterministas por
   paciente (seed = hash del nombre) la primera vez.
   ===================================================================== */
(function () {
  "use strict";

  var scrim = document.getElementById("psScrim");
  if (!scrim) return;

  var accHost = document.getElementById("psAccordion");
  var closeBtn = document.getElementById("psClose");
  var addBtn = document.getElementById("psAdd");
  var lastFocus = null;
  var currentName = null;

  /* persistencia de sesión: nombre → [{freq, num, preguntas:[...]}] */
  var STORE = {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function seed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }

  var MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  var BASE = new Date(2026, 8, 13); /* fecha de referencia */
  var FREQ_OPTS = ["Horas", "Días", "Semanas"];

  function fmtDate(d) { return d.getDate() + " " + MESES[d.getMonth()] + " " + d.getFullYear(); }
  function freqDays(freq, num) {
    var n = parseInt(num, 10) || 0;
    if (freq === "Horas") return Math.max(0, Math.round(n / 24));
    if (freq === "Semanas") return n * 7;
    return n; /* Días */
  }
  /* etiqueta del encabezado: "N días" salvo Horas (que muestra horas) */
  function diasLabel(freq, num) {
    var n = parseInt(num, 10) || 0;
    if (freq === "Horas") return n + (n === 1 ? " hora" : " horas");
    if (freq === "Semanas") return (n * 7) + " días";
    return n + " días";
  }

  var Q_BANK = [
    "¿Ha notado alguna mejora en sus síntomas desde la última consulta?",
    "¿Ha experimentado efectos secundarios con la medicación que le receté?",
    "¿Hay algo nuevo que le preocupe en relación a su salud desde nuestra última cita?",
    "¿Ha continuado con el tratamiento exactamente como se indicó?",
    "¿Pudo realizarse los estudios o exámenes médicos solicitados?",
    "¿Cómo calificaría hoy la intensidad de su molestia principal?",
    "¿Ha aparecido algún síntoma nuevo que no tenía el día de la consulta?",
    "¿Tiene alguna duda sobre las indicaciones o la dosis del medicamento?",
    "¿Ha podido mantener las recomendaciones de hidratación y reposo?",
    "¿Considera que necesita una nueva cita de control presencial?"
  ];

  var DIAS_POOL = [5, 8, 15, 30, 45, 60];
  function buildSchedule(name) {
    var s = seed(name + "|prox");
    var n = 2 + (s % 3); /* 2–4 próximos seguimientos */
    var out = [];
    for (var i = 0; i < n; i++) {
      var dias = DIAS_POOL[(s >> i) % DIAS_POOL.length];
      var qn = 3 + ((s >> (i + 2)) % 2); /* 3–4 preguntas */
      var qs = [];
      var start = (s >> (i + 1)) % Q_BANK.length;
      for (var k = 0; k < qn; k++) qs.push(Q_BANK[(start + k) % Q_BANK.length]);
      out.push({ freq: "Días", num: dias, preguntas: qs });
    }
    return out;
  }
  /* devuelve (y memoiza) el horario del paciente para la sesión */
  function getSchedule(name) {
    if (!STORE[name]) STORE[name] = buildSchedule(name);
    return STORE[name];
  }

  /* fecha acumulada del seguimiento `idx` (suma de intervalos previos) */
  function fechaFor(list, idx) {
    var acc = 0;
    for (var i = 0; i <= idx; i++) acc += freqDays(list[i].freq, list[i].num);
    var dt = new Date(BASE.getTime());
    dt.setDate(dt.getDate() + acc);
    return fmtDate(dt);
  }

  /* ── Markup · Input Select (DS, igual que Nuevo seguimiento) ── */
  function selectMarkup(id, freq) {
    var items = FREQ_OPTS.map(function (v) {
      return '<div class="menu-item ns-opt" role="option" data-value="' + esc(v) + '"' +
        (v === freq ? ' aria-selected="true"' : "") + '>' + esc(v) + '</div>';
    }).join("");
    return '<div class="ff ff-select ns-select" data-id="' + id + '" data-value="' + esc(freq) + '">' +
        '<div class="ff-box" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="ff-value">' + esc(freq) + '</span>' +
          '<span class="ff-icon material-symbols-outlined">arrow_drop_down</span>' +
        '</div>' +
        '<div class="menu nu-menu" role="listbox">' + items + '</div>' +
      '</div>';
  }
  function questionRow(text) {
    return '<div class="ns-q"><input class="ns-q-input" type="text" value="' + esc(text) + '" placeholder="Escriba la pregunta del seguimiento">' +
      '<button class="ns-q-rm" type="button" aria-label="Quitar pregunta"><span class="material-symbols-outlined">close</span></button></div>';
  }

  /* ── Markup · seguimiento en modo LECTURA ── */
  function readMarkup(it, idx, list, open) {
    var qs = it.preguntas.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join("");
    return '<div class="ps-fu' + (open ? ' is-open' : '') + '" data-ps-item data-idx="' + idx + '">' +
        '<button class="ps-head" type="button" data-ps-head aria-expanded="' + (open ? 'true' : 'false') + '">' +
          '<div class="ps-labels">' +
            '<span class="ps-title">Seguimiento: ' + esc(diasLabel(it.freq, it.num)) + '</span>' +
            '<span class="ps-sub">Fecha de respuesta: ' + esc(fechaFor(list, idx)) + '</span>' +
          '</div>' +
          '<span class="ps-chev"><span class="material-symbols-outlined">expand_more</span></span>' +
        '</button>' +
        '<div class="ps-panel">' +
          '<div class="ps-q-head">' +
            '<span class="ps-q-title">Preguntas</span>' +
            '<button class="ps-q-edit" type="button" data-ps-edit aria-label="Editar seguimiento"><span class="material-symbols-outlined">edit</span></button>' +
          '</div>' +
          '<ol class="ps-qlist">' + qs + '</ol>' +
        '</div>' +
      '</div>';
  }

  /* ── Markup · seguimiento en modo EDICIÓN ── */
  function editMarkup(it, idx) {
    var qs = it.preguntas.map(function (q) { return questionRow(q); }).join("");
    return '<div class="ps-fu is-open ps-fu--editing" data-ps-item data-idx="' + idx + '">' +
        '<div class="ps-edit">' +
          '<div class="ns-fu-head">' +
            '<span class="ns-fu-title">Editar seguimiento</span>' +
            '<button class="ns-fu-del" type="button" data-ps-del aria-label="Eliminar seguimiento"><span class="material-symbols-outlined">delete</span></button>' +
          '</div>' +
          '<span class="ps-edit-lbl">Frecuencia del seguimiento</span>' +
          '<div class="ns-grid-freq">' +
            selectMarkup("freq", it.freq) +
            '<div class="ff" data-nsfield="num"><div class="ff-box">' +
              '<input class="ff-input ps-num" type="text" inputmode="numeric" value="' + esc(it.num) + '"></div></div>' +
          '</div>' +
          '<span class="ns-q-label">Preguntas</span>' +
          '<div class="ns-qs" data-ps-qs>' + qs + '</div>' +
          '<button class="ns-add-q" type="button" data-ps-addq><span class="material-symbols-outlined">add</span>Agregar pregunta</button>' +
          '<div class="ps-edit-err" data-ps-err><span class="material-symbols-outlined">error</span>Cada seguimiento debe tener al menos una pregunta y una frecuencia válida.</div>' +
          '<div class="ps-edit-actions">' +
            '<button class="ps-cancel" type="button" data-ps-cancel>Cancelar</button>' +
            '<button class="ps-save" type="button" data-ps-save>Guardar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ── Input · Select genérico (DS) ── */
  var openSelect = null;
  function initSelect(sel) {
    var box = sel.querySelector(".ff-box");
    var val = sel.querySelector(".ff-value");
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

  /* ── Render completo ── */
  function render() {
    var list = getSchedule(currentName);
    accHost.innerHTML = list.map(function (it, i) { return readMarkup(it, i, list, i === 0); }).join("");
  }

  /* re-renderiza un nodo concreto (lectura) preservando su estado abierto */
  function renderRead(node, idx, open) {
    var list = getSchedule(currentName);
    var html = readMarkup(list[idx], idx, list, open);
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    node.replaceWith(tmp.firstChild);
  }

  function nodeByIdx(idx) {
    return accHost.querySelector('[data-ps-item][data-idx="' + idx + '"]');
  }

  function enterEdit(idx) {
    var node = nodeByIdx(idx);
    if (!node) return;
    var list = getSchedule(currentName);
    var tmp = document.createElement("div");
    tmp.innerHTML = editMarkup(list[idx], idx);
    var ed = tmp.firstChild;
    node.replaceWith(ed);
    Array.prototype.forEach.call(ed.querySelectorAll(".ns-select"), initSelect);
    var firstInput = ed.querySelector(".ns-q-input");
    if (firstInput) firstInput.focus();
  }

  function saveItem(idx) {
    var node = nodeByIdx(idx);
    if (!node) return;
    var list = getSchedule(currentName);
    var sel = node.querySelector(".ns-select");
    var freq = sel ? sel.getAttribute("data-value") : "Días";
    var num = parseInt((node.querySelector(".ps-num") || {}).value, 10);
    var inputs = node.querySelectorAll(".ns-q-input");
    var preguntas = [];
    Array.prototype.forEach.call(inputs, function (i) {
      var t = (i.value || "").trim();
      if (t) preguntas.push(t);
    });
    if (!num || num < 1 || preguntas.length < 1) {
      node.classList.add("is-error");
      return;
    }
    list[idx] = { freq: freq, num: num, preguntas: preguntas };
    /* re-render de TODO: cambiar un intervalo desplaza las fechas siguientes */
    var openIdx = idx;
    render();
    var re = nodeByIdx(openIdx);
    if (re && !re.classList.contains("is-open")) {
      re.classList.add("is-open");
      var head = re.querySelector("[data-ps-head]");
      if (head) head.setAttribute("aria-expanded", "true");
    }
  }

  function cancelItem(idx) {
    var node = nodeByIdx(idx);
    if (!node) return;
    /* si era un seguimiento nuevo sin guardar (marcado), se descarta */
    if (node.getAttribute("data-ps-new") === "1") {
      var list = getSchedule(currentName);
      list.splice(idx, 1);
      render();
      return;
    }
    renderRead(node, idx, true);
  }

  function deleteItem(idx) {
    var node = nodeByIdx(idx);
    if (!node) return;
    var head = node.querySelector(".ns-fu-head");
    if (!head || head.querySelector(".ns-fu-confirm")) return;
    node.classList.add("is-confirming");
    var box = document.createElement("div");
    box.className = "ns-fu-confirm";
    box.innerHTML = '<span class="ns-fu-confirm-tx">¿Eliminar este seguimiento?</span>' +
      '<button class="ns-fu-cancel" type="button" data-ps-delcancel>Cancelar</button>' +
      '<button class="ns-fu-confirm-del" type="button" data-ps-delok>Eliminar</button>';
    head.appendChild(box);
  }
  function cancelDelete(idx) {
    var node = nodeByIdx(idx);
    if (!node) return;
    node.classList.remove("is-confirming");
    var box = node.querySelector(".ns-fu-confirm");
    if (box) box.remove();
  }
  function confirmDelete(idx) {
    var list = getSchedule(currentName);
    list.splice(idx, 1);
    render();
  }

  function addFollowup() {
    var list = getSchedule(currentName);
    list.push({ freq: "Días", num: 7, preguntas: [""] });
    var idx = list.length - 1;
    render();
    /* convertir el último a edición y marcarlo como nuevo */
    var node = nodeByIdx(idx);
    var tmp = document.createElement("div");
    tmp.innerHTML = editMarkup(list[idx], idx);
    var ed = tmp.firstChild;
    ed.setAttribute("data-ps-new", "1");
    node.replaceWith(ed);
    Array.prototype.forEach.call(ed.querySelectorAll(".ns-select"), initSelect);
    var body = scrim.querySelector(".du-modal-body");
    if (body) body.scrollTop = body.scrollHeight;
    var inp = ed.querySelector(".ns-q-input");
    if (inp) inp.focus();
  }

  /* ── Delegación de eventos en el acordeón ── */
  accHost.addEventListener("click", function (e) {
    var item = e.target.closest("[data-ps-item]");
    var idx = item ? parseInt(item.getAttribute("data-idx"), 10) : -1;

    /* toggle acordeón (sólo en lectura) */
    var head = e.target.closest("[data-ps-head]");
    if (head) {
      var open = item.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (e.target.closest("[data-ps-edit]")) { enterEdit(idx); return; }
    if (e.target.closest("[data-ps-save]")) { saveItem(idx); return; }
    if (e.target.closest("[data-ps-cancel]")) { cancelItem(idx); return; }
    if (e.target.closest("[data-ps-del]")) { deleteItem(idx); return; }
    if (e.target.closest("[data-ps-delcancel]")) { cancelDelete(idx); return; }
    if (e.target.closest("[data-ps-delok]")) { confirmDelete(idx); return; }

    var addQ = e.target.closest("[data-ps-addq]");
    if (addQ) {
      var qs = item.querySelector("[data-ps-qs]");
      qs.insertAdjacentHTML("beforeend", questionRow(""));
      var last = qs.lastElementChild.querySelector(".ns-q-input");
      if (last) last.focus();
      item.classList.remove("is-error");
      return;
    }
    var rmQ = e.target.closest(".ns-q-rm");
    if (rmQ) { var row = rmQ.closest(".ns-q"); if (row) row.remove(); return; }
  });

  /* ── abrir / cerrar ── */
  function open(patient) {
    currentName = (patient && patient.name) || "Paciente";
    lastFocus = document.activeElement;
    render();
    scrim.classList.add("is-open");
    scrim.setAttribute("aria-hidden", "false");
    if (closeBtn) setTimeout(function () { try { closeBtn.focus(); } catch (e) {} }, 60);
  }
  function close() {
    scrim.classList.remove("is-open");
    scrim.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  closeBtn.addEventListener("click", close);
  if (addBtn) addBtn.addEventListener("click", addFollowup);
  var reportarBtn = document.getElementById("psReportar");
  if (reportarBtn) reportarBtn.addEventListener("click", function () {
    window.open(window.SC_REPORT_FORM_URL, "_blank", "noopener");
  });
  scrim.addEventListener("click", function (e) { if (e.target === scrim) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrim.classList.contains("is-open")) close();
  });

  window.openProximosDialog = open;
})();
