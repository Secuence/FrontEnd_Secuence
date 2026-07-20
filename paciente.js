/* =====================================================================
   Información del paciente (#/informacion-paciente)
   Renderiza la vista de detalle a partir del paciente seleccionado en la
   tabla "Pacientes" (Historias). Los datos clínicos se generan de forma
   determinista (seed = hash del nombre) — sólo el nombre es real.
   Componentes DS: Header page · Breadcrumb · Card info patient ·
   Banner medical discharge · Tabs · Buttons · Card outlined.
   ===================================================================== */
(function () {
  "use strict";

  var page = document.getElementById("ipPage");
  if (!page) return;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    var a = p[0] ? p[0][0] : "";
    var b = p.length > 1 ? p[p.length - 1][0] : "";
    return (a + b).toUpperCase();
  }
  /* hash determinista → entero ≥ 0 */
  function seed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }
  function pick(arr, n) { n = (n >>> 0) % arr.length; return arr[n]; }

  var MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  function fmtDate(d, m, y) { return d + " " + MESES[m] + " " + y; }

  var SANGRE = ["O+", "A+", "B+", "O-", "A-", "AB+", "B-", "Sin registrar"];
  var GENERO_F_FIN = "a";
  function genero(name) {
    var first = String(name).trim().split(/\s+/)[0].toLowerCase();
    if (first.charAt(first.length - 1) === GENERO_F_FIN) return "Femenino";
    if (first.charAt(first.length - 1) === "o") return "Masculino";
    var FEM = ["lucía", "beatriz", "isabel", "raquel", "noemí", "abril"];
    return FEM.indexOf(first) !== -1 ? "Femenino" : "Masculino";
  }
  var ALERGIAS = [
    "Penicilina · Sulfamidas",
    "No registra alergias",
    "Aspirina (AAS)",
    "Mariscos · Yodo",
    "Polen · Ácaros",
    "No registra alergias",
    "Látex"
  ];
  var CIUDADES = [
    "Barquisimeto, Lara, Venezuela",
    "Caracas, Distrito Capital, Venezuela",
    "Valencia, Carabobo, Venezuela",
    "Maracaibo, Zulia, Venezuela",
    "Mérida, Mérida, Venezuela"
  ];
  var CONTACTOS = [
    ["María Ortega", "+58 414 123 25 67"],
    ["José Restrepo", "+58 412 887 41 20"],
    ["Ana Lucía Pérez", "+58 424 552 18 03"],
    ["Carlos Mendoza", "+58 416 310 77 95"],
    ["Patricia Gil", "+58 414 905 63 41"]
  ];
  /* enfermedad base → especialidad de seguimiento */
  var ESPECIALIDAD = {
    "Hipertensión arterial": "Cardiología",
    "Insuficiencia cardíaca": "Cardiología",
    "Diabetes mellitus tipo 2": "Endocrinología",
    "Hipotiroidismo": "Endocrinología",
    "Dislipidemia": "Endocrinología",
    "EPOC": "Neumología",
    "Asma": "Neumología",
    "Enfermedad renal crónica": "Nefrología",
    "Artritis reumatoide": "Reumatología",
    "Migraña crónica": "Neurología",
    "Gastritis crónica": "Gastroenterología",
    "Anemia ferropénica": "Hematología"
  };
  var ALERTA = [
    { txt: "Media", cls: "" },
    { txt: "Alta", cls: "alert-alta" },
    { txt: "Baja", cls: "alert-baja" }
  ];

  /* ── Seguimientos (accordion) — mismos datos/comportamiento que "Detalle
     de seguimiento": casos clínicos deterministas, banner de alerta
     confirmable, y tarjetas de próximos seguimientos. ── */
  var DOCTOR_SEG = { name: "Dr. Carlos Méndez" };
  function shiftDate(label, days) {
    var m = String(label).match(/(\d{1,2})\s+([a-záé.]+)\s+(\d{4})/i);
    if (!m) return label;
    var dd = parseInt(m[1], 10);
    var mi = MESES.indexOf(m[2].toLowerCase());
    var yy = parseInt(m[3], 10);
    var dt = new Date(yy, mi < 0 ? 0 : mi, dd);
    dt.setDate(dt.getDate() - days);
    return fmtDate(dt.getDate(), dt.getMonth(), dt.getFullYear());
  }
  var CASES = [
    {
      base: "Infección del tracto urinario (ITU) no complicada", dx: "Infección del tracto urinario (ITU) no complicada",
      historia: "Paciente con antecedentes de infecciones urinarias recurrentes (3 episodios en el último año). Sin comorbilidades crónicas. No cirugías previas. Buen estado general.",
      consulta: [
        "Paciente consulta por: disuria (dolor al orinar), aumento de frecuencia urinaria, sensación de urgencia urinaria.",
        "Examen físico sin signos de complicación sistémica.",
        "Se prescribe Nitrofurantoína 100 mg cada 12 horas por 5 días, analgésico urinario según necesidad, hidratación aumentada.",
        "Se solicita urocultivo: compatible con ITU."
      ],
      sintomas: ["Mejoría de síntomas iniciales", "Sin aparición de signos sistémicos", "Buena tolerancia al tratamiento"],
      accion: ["Continuar esquema antibiótico indicado", "Reforzar hidratación", "Control con urocultivo de seguimiento"]
    },
    {
      base: "Hipertensión arterial", dx: "Hipertensión arterial esencial",
      historia: "Paciente con hipertensión arterial diagnosticada hace 4 años, en manejo con losartán. Antecedentes familiares de cardiopatía isquémica. Sin alergias conocidas.",
      consulta: [
        "Paciente consulta por: cefalea occipital matutina y cifras tensionales elevadas en domicilio.",
        "Examen físico: PA 152/96 mmHg, resto sin hallazgos relevantes.",
        "Se ajusta losartán a 100 mg/día y se añade hidroclorotiazida 25 mg.",
        "Se solicita perfil lipídico y función renal de control."
      ],
      sintomas: ["Reducción de cefalea", "Cifras tensionales en descenso", "Sin mareo ni palpitaciones"],
      accion: ["Mantener ajuste antihipertensivo", "Registro diario de presión arterial", "Control de laboratorio en 4 semanas"]
    },
    {
      base: "Diabetes mellitus tipo 2", dx: "Diabetes mellitus tipo 2 descompensada",
      historia: "Paciente con diabetes mellitus tipo 2 de 6 años de evolución, en manejo con metformina. Adherencia irregular al tratamiento. Sobrepeso.",
      consulta: [
        "Paciente consulta por: poliuria, polidipsia y astenia de dos semanas de evolución.",
        "Glucemia capilar en consulta: 248 mg/dL.",
        "Se intensifica metformina y se inicia educación en dieta y conteo de carbohidratos.",
        "Se solicita HbA1c y perfil renal."
      ],
      sintomas: ["Disminución de poliuria", "Menor sensación de sed", "Persiste astenia leve"],
      accion: ["Reforzar adherencia al tratamiento", "Monitoreo de glucemia capilar", "Control con HbA1c en seguimiento"]
    },
    {
      base: "EPOC", dx: "Exacerbación de EPOC",
      historia: "Paciente con EPOC moderado, exfumador. Antecedente de dos exacerbaciones en el último año. En manejo con broncodilatador de acción prolongada.",
      consulta: [
        "Paciente consulta por: aumento de disnea, tos productiva y cambio en coloración del esputo.",
        "Examen físico: sibilancias difusas, SpO₂ 92% al aire ambiente.",
        "Se inicia broncodilatador de rescate, corticoide oral en pauta corta y antibiótico.",
        "Se indica control de saturación domiciliario."
      ],
      sintomas: ["Mejoría parcial de la disnea", "Disminución de la tos", "Saturación en recuperación"],
      accion: ["Completar pauta de corticoide y antibiótico", "Vigilar saturación de oxígeno", "Control respiratorio en seguimiento"]
    }
  ];
  var CRIT = {
    low: {
      h: "Se asignó porque paciente cumple con los siguientes criterios:",
      body: ["Inició el tratamiento como fue indicado.", "No presenta dudas significativas.", "Síntomas han mejorado o están en franca mejoría.", "No hay nuevos síntomas.", "Se realizaron los estudios médicos si fueron indicados.", "No hay signos de alarma clínicos ni riesgo de descompensación."]
    },
    medium: {
      h: "Se asignó porque paciente cumple uno (1) o más de los siguientes criterios:",
      body: ["Inicio parcial del tratamiento o suspensión sin motivos médicos claros.", "Dudas leves o moderadas que podrían resolverse con explicación.", "Persistencia de síntomas sin empeoramiento, pero sin clara mejoría.", "Nuevos síntomas leves o no específicos que requieren vigilancia.", "Estudios médicos aún no realizados, pero de baja urgencia o programables.", "Antecedentes controlados, sin signos de descompensación, pero sin mejoría clínica evidente."]
    },
    high: {
      h: "Se asignó porque paciente cumple uno (1) o más de los siguientes criterios:",
      body: ["No inició el tratamiento y el motivo implica riesgo (falta de acceso, rechazo, desconocimiento grave del manejo).", "Síntomas persisten o empeoran, especialmente respiratorios, digestivos severos, fiebre mantenida o dolor agudo.", "Dudas críticas que comprometen la adherencia o la seguridad (errores en dosis, vías de administración).", "Aparecen nuevos síntomas sugerentes de complicación o descompensación.", "No se realizaron estudios médicos indicados y eran urgentes para el diagnóstico.", "En comorbilidades (HTA, DM, EPOC): síntomas persistentes o signos de progresión."]
    }
  };
  var LEVEL_LABEL = { low: "Alerta baja", medium: "Alerta media", high: "Alerta alta" };
  var ALERT_TXT_TO_LEVEL = { Baja: "low", Media: "medium", Alta: "high" };
  var DIAS_POOL = [15, 5, 30, 45, 60];
  function numFollowups(s) { return 1 + (s % 4); }

  function chipSeg(label, tone, withInfo) {
    return '<span class="sd-chip ' + tone + '">' + esc(label) +
      (withInfo ? '<button class="info-i" type="button" aria-label="Más información"><span class="material-symbols-outlined">info</span></button>' : '') +
      '</span>';
  }
  function clinicalList(c, statTrat, statEst) {
    function section(title, bodyHtml) {
      return '<div class="sd-li"><span class="sd-li-title">' + esc(title) + '</span>' +
        '<div class="sd-li-body">' + bodyHtml + '</div></div>';
    }
    function inlineStatus(title, st) {
      return '<div class="sd-li sd-li--inline"><span class="sd-li-title">' + esc(title) + '</span>' +
        chipSeg(st.label, st.tone, true) + '</div>';
    }
    var consulta = c.consulta.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join("");
    var sintomas = c.sintomas.map(function (l) { return '<span class="ln">' + esc(l) + '</span>'; }).join("");
    var accion = c.accion.map(function (l) { return '<span class="ln">' + esc(l) + '</span>'; }).join("");
    return '<div class="sd-list">' +
      section("Resumen de historia", '<p>' + esc(c.historia) + '</p>') +
      section("Resumen última consulta", consulta) +
      section("Diagnóstico", '<p>' + esc(c.dx) + '</p>') +
      inlineStatus("Estado de tratamiento", statTrat) +
      inlineStatus("Estado de procedimientos y estudios", statEst) +
      section("Síntomas actuales", sintomas) +
      section("Acción clínica sugerida", accion) +
    '</div>';
  }
  function bannerFollowup(level, confirmed) {
    var crit = CRIT[level];
    var critLis = crit.body.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join("");
    var isHigh = level === "high";
    var palert = isHigh
      ? '<span class="palert"><span class="material-symbols-outlined">warning</span>Requiere contacto médico inmediato o remisión a urgencias.</span>'
      : '';
    var sub = confirmed ? '<span class="psub">Confirmada por: ' + esc(DOCTOR_SEG.name) + ' · ' + TODAY + '</span>' : '';
    var disc = confirmed
      ? 'No constituyen diagnósticos ni indican urgencia médica. La toma de decisiones clínicas es exclusivamente su responsabilidad como profesional de salud. Por lo tanto debe validar clínicamente esta información antes de actuar ya que la alerta no reemplaza su criterio profesional.'
      : 'No constituyen diagnósticos ni indican urgencia médica. La toma de decisiones clínicas es exclusivamente su responsabilidad como profesional de salud. Al seleccionar "Confirmar" está aceptando esta declaración de responsabilidad.';
    var head = confirmed ? '' :
      '<div class="sd-bfu-head">' +
        '<div class="labels">' +
          '<span class="title">Por favor confirme el tipo de alerta generado</span>' +
          '<span class="subtitle">Si considera que la alerta es errónea puede cambiar su prioridad.</span>' +
        '</div>' +
        '<div class="right"><button class="sd-confirm" type="button" data-bfu-confirm>Confirmar</button></div>' +
      '</div>';
    var selector =
      '<div class="sd-pmenu-wrap">' +
        '<div class="sd-pinput ' + level + (confirmed ? ' confirmed locked' : '') + '" data-bfu-input role="button" tabindex="' + (confirmed ? '-1' : '0') + '" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="material-symbols-outlined bell">notifications_none</span>' +
          '<div class="plabels">' +
            '<span class="ptitle" data-bfu-label>' + LEVEL_LABEL[level] + '</span>' +
            palert +
            sub +
          '</div>' +
          (confirmed ? '' : '<span class="material-symbols-outlined chev">arrow_drop_down</span>') +
        '</div>' +
        (confirmed ? '' :
        '<div class="sd-pmenu" data-bfu-menu role="listbox">' +
          '<button class="opt" type="button" data-level="low"><span class="dot low"></span><span class="ol">Alerta baja</span><span class="material-symbols-outlined chk" style="visibility:' + (level === "low" ? "visible" : "hidden") + '">check</span></button>' +
          '<button class="opt" type="button" data-level="medium"><span class="dot medium"></span><span class="ol">Alerta media</span><span class="material-symbols-outlined chk" style="visibility:' + (level === "medium" ? "visible" : "hidden") + '">check</span></button>' +
          '<button class="opt" type="button" data-level="high"><span class="dot high"></span><span class="ol">Alerta alta</span><span class="material-symbols-outlined chk" style="visibility:' + (level === "high" ? "visible" : "hidden") + '">check</span></button>' +
        '</div>') +
      '</div>';
    return '<div class="sd-bfu ' + level + (confirmed ? ' confirmed' : '') + '" data-bfu>' +
      head + selector +
      '<div class="sd-alert-info">' +
        '<span class="material-symbols-outlined ai-ic">info</span>' +
        '<div class="ai-txt">' +
          '<span class="ai-t">¡Las alertas mostradas en Secuence tienen carácter informativo!</span>' +
          '<span class="ai-s" data-bfu-disc>' + esc(disc) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="sd-perror"><span class="material-symbols-outlined">error</span>Selecciona un tipo de alerta antes de confirmar.</div>' +
      '<div class="sd-bfu-body">' +
        '<span class="crit-h" data-bfu-crith>' + esc(crit.h) + '</span>' +
        '<ul class="crit" data-bfu-crit>' + critLis + '</ul>' +
      '</div>' +
    '</div>';
  }
  function proximosSeg(respDate) {
    var labels = [
      ["30 días", shiftDate(respDate, -30)],
      ["45 días", shiftDate(respDate, -45)],
      ["60 días", shiftDate(respDate, -60)]
    ];
    var cards = labels.map(function (l) {
      return '<div class="sd-fu-card" data-fu-card role="button" tabindex="0">' +
          '<span class="sd-fu-lead"><span class="material-symbols-outlined">open_in_new</span></span>' +
          '<div class="sd-fu-body"><span class="title">Seguimiento</span>' +
          '<span class="value">' + esc(l[0]) + ' – ' + esc(l[1]) + '</span></div>' +
        '</div>';
    }).join("");
    return '<div class="sd-proximos">' +
        '<span class="sd-proximos-title">Próximos seguimientos</span>' +
        '<div class="sd-proximos-row">' +
          '<div class="sd-fu-cards">' + cards + '</div>' +
          '<button class="sd-tonal" type="button" data-edit-seguimientos><span class="material-symbols-outlined">edit</span>Editar seguimientos</button>' +
        '</div>' +
      '</div>';
  }
  function seguimientosPanelMarkup(p, d) {
    var s = seed(p.name);
    var c = pick(CASES, s);
    var rowLevel = ALERT_TXT_TO_LEVEL[d.alerta.txt] || "medium";
    var n = numFollowups(s);
    if (!n) {
      return '<div class="ip-empty">' +
          '<div class="em-ic"><span class="material-symbols-outlined">event_repeat</span></div>' +
          '<span class="em-title">Aún no hay seguimientos</span>' +
          '<span class="em-sub">Cuando programes un seguimiento para este paciente, aparecerá aquí con su estado y próxima fecha de envío.</span>' +
        '</div>';
    }
    var STAT = [
      { label: "Iniciado", tone: "green" },
      { label: "Completado", tone: "blue" },
      { label: "Pendiente", tone: "yellow" }
    ];
    var accs = "";
    for (var i = 0; i < n; i++) {
      var dias = DIAS_POOL[i % DIAS_POOL.length];
      var resp = i === 0 ? (p.date || TODAY) : shiftDate(p.date || TODAY, i * 22);
      var confirmed = i !== 0;
      var level = i === 0 ? rowLevel : pick(["low", "medium", "high"], s >> (i + 1));
      var statTrat = pick(STAT, s >> i);
      var statEst = pick(STAT, s >> (i + 3));
      accs += '<div class="sd-acc' + (i === 0 ? ' is-open' : '') + '" data-acc>' +
          '<button class="sd-acc-head" type="button" data-acc-head aria-expanded="' + (i === 0 ? 'true' : 'false') + '">' +
            '<div class="sd-acc-labels">' +
              '<span class="sd-acc-title">Seguimiento: ' + dias + ' días</span>' +
              '<span class="sd-acc-sub">Fecha de respuesta: ' + esc(resp) + '</span>' +
            '</div>' +
            '<span class="sd-acc-chev"><span class="material-symbols-outlined">expand_more</span></span>' +
          '</button>' +
          '<div class="sd-acc-body">' +
            '<div class="sd-grid">' +
              '<div class="sd-left">' + clinicalList(c, statTrat, statEst) + '</div>' +
              '<div class="sd-right">' + bannerFollowup(level, confirmed) + '</div>' +
            '</div>' +
            proximosSeg(resp) +
          '</div>' +
        '</div>';
    }
    return '<div class="sd-accordion">' + accs + '</div>';
  }
  function wireSeguimientosPanel(panel, p) {
    Array.prototype.forEach.call(panel.querySelectorAll("[data-acc-head]"), function (head) {
      head.addEventListener("click", function () {
        var acc = head.closest("[data-acc]");
        var open = acc.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-bfu]"), function (bfu) {
      if (bfu.classList.contains("confirmed")) return;
      wireBanner(bfu);
    });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-fu-card]"), function (card) {
      function open() { if (window.openProximosDialog) window.openProximosDialog({ name: p.name }); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-edit-seguimientos]"), function (btn) {
      btn.addEventListener("click", function () { if (window.openProximosDialog) window.openProximosDialog({ name: p.name }); });
    });
  }
  function wireBanner(bfu) {
    var input = bfu.querySelector("[data-bfu-input]");
    var menu = bfu.querySelector("[data-bfu-menu]");
    var label = bfu.querySelector("[data-bfu-label]");
    var critH = bfu.querySelector("[data-bfu-crith]");
    var critUl = bfu.querySelector("[data-bfu-crit]");
    var disc = bfu.querySelector("[data-bfu-disc]");
    var confirmBtn = bfu.querySelector("[data-bfu-confirm]");
    var chev = input ? input.querySelector(".chev") : null;
    var current = (function () { var m = bfu.className.match(/\b(low|medium|high)\b/); return m ? m[1] : "low"; })();
    function setLevel(level) {
      ["low", "medium", "high"].forEach(function (l) {
        bfu.classList.toggle(l, l === level);
        if (input) input.classList.toggle(l, l === level);
      });
      bfu.classList.remove("is-error");
      current = level;
      label.textContent = LEVEL_LABEL[level];
      critH.textContent = CRIT[level].h;
      critUl.innerHTML = CRIT[level].body.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join("");
      if (menu) menu.querySelectorAll(".opt").forEach(function (o) {
        o.querySelector(".chk").style.visibility = (o.dataset.level === level) ? "visible" : "hidden";
      });
    }
    function openMenu(open) {
      if (!menu) return;
      menu.classList.toggle("is-open", open);
      if (input) input.setAttribute("aria-expanded", open ? "true" : "false");
      if (chev) chev.style.transform = open ? "rotate(180deg)" : "none";
    }
    function confirmAlert() {
      openMenu(false);
      bfu.classList.add("confirmed");
      if (input) {
        input.classList.add("confirmed", "locked");
        input.setAttribute("tabindex", "-1");
        input.setAttribute("aria-expanded", "false");
        if (chev) chev.style.display = "none";
        var plabels = input.querySelector(".plabels");
        if (plabels && !plabels.querySelector(".psub")) {
          if (current === "high" && !plabels.querySelector(".palert")) {
            var pa = document.createElement("span");
            pa.className = "palert";
            pa.innerHTML = '<span class="material-symbols-outlined">warning</span>Requiere contacto médico inmediato o remisión a urgencias.';
            plabels.appendChild(pa);
          }
          var subEl = document.createElement("span");
          subEl.className = "psub";
          subEl.textContent = "Confirmada por: " + DOCTOR_SEG.name + " · " + TODAY;
          plabels.appendChild(subEl);
        }
      }
      if (disc) disc.textContent = "No constituyen diagnósticos ni indican urgencia médica. La toma de decisiones clínicas es exclusivamente su responsabilidad como profesional de salud. Por lo tanto debe validar clínicamente esta información antes de actuar ya que la alerta no reemplaza su criterio profesional.";
    }
    if (input) {
      input.addEventListener("click", function () {
        if (input.classList.contains("locked")) return;
        openMenu(!menu.classList.contains("is-open"));
      });
      input.addEventListener("keydown", function (e) {
        if (input.classList.contains("locked")) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMenu(!menu.classList.contains("is-open")); }
        else if (e.key === "Escape") { openMenu(false); }
      });
    }
    if (menu) menu.querySelectorAll(".opt").forEach(function (o) {
      o.addEventListener("click", function () { setLevel(o.dataset.level); openMenu(false); });
    });
    function requestConfirm() {
      openMenu(false);
      if (!window.openStatusDialog) { confirmAlert(); return; }
      window.openStatusDialog({
        type: "warning", icon: "back_hand",
        title: "Confirmar tipo de alerta",
        desc: "Está a punto de confirmar la alerta como \u201c" + LEVEL_LABEL[current] + "\u201d. Una vez confirmada, esta acción no podrá modificarse.",
        buttons: [
          { label: "Cancelar", variant: "text" },
          { label: "Confirmar alerta", variant: "tonal", onClick: function () { confirmAlert(); } }
        ]
      });
    }
    if (confirmBtn) confirmBtn.addEventListener("click", requestConfirm);
    document.addEventListener("click", function (e) { if (!bfu.contains(e.target)) openMenu(false); });
  }

  /* genera el set de datos determinista para un paciente */
  function buildData(p) {
    var s = seed(p.name);
    var edad = 28 + (s % 51);                 // 28–78
    var nacY = 2026 - edad;
    var nacM = (s >>> 3) % 12;
    var nacD = 1 + ((s >>> 6) % 27);
    var docA = 10 + (s % 20);
    var docB = 100 + ((s >>> 4) % 900);
    var docC = 100 + ((s >>> 8) % 900);
    var tel = "+58 4" + (10 + (s % 30)) + " " + (100 + ((s >>> 5) % 900)) + " " + (10 + ((s >>> 9) % 90)) + " " + (10 + ((s >>> 11) % 90));
    var npsScore = 6 + (s % 5);               // 6–10
    var esp = ESPECIALIDAD[p.base] || "Medicina interna";
    var altaY = 2026;
    var altaM = (s >>> 7) % 6;                  // primer semestre
    var altaD = 1 + ((s >>> 2) % 27);
    var firstName = String(p.name).trim().split(/\s+/)[0];
    var lastName = String(p.name).trim().split(/\s+/).pop();
    var correo = (firstName + "." + lastName).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "@gmail.com";
    var contacto = pick(CONTACTOS, s >>> 4);
    return {
      name: p.name,
      alerta: pick(ALERTA, s),
      documento: "V-" + docA + "." + docB + "." + docC,
      edad: edad + " años",
      sangre: pick(SANGRE, s >>> 2),
      telefono: tel,
      nps: npsScore + "/10 – Paciente " + (npsScore >= 9 ? "muy satisfecho" : npsScore >= 7 ? "satisfecho" : "conforme") +
           " con el seguimiento; solicita recordatorios de medicación por WhatsApp y ajuste de horarios de control.",
      nacimiento: fmtDate(nacD, nacM, nacY),
      genero: genero(p.name),
      ultimaConsulta: p.date || "—",
      correo: correo,
      alergias: pick(ALERGIAS, s >>> 1),
      contactoNombre: contacto[0],
      contactoTel: contacto[1],
      direccion: "Calle " + (10 + (s % 80)) + " #" + (10 + ((s >>> 3) % 80)) + "-" + (10 + ((s >>> 6) % 80)) + ". " + pick(CIUDADES, s >>> 5),
      altaFecha: fmtDate(altaD, altaM, altaY),
      altaEsp: esp
    };
  }

  function row(label, value, aria) {
    return '' +
      '<div class="ip-row">' +
        '<div class="ip-rl"><span class="ip-lbl">' + label + '</span><span class="ip-val">' + esc(value) + '</span></div>' +
        '<button class="ip-ed" type="button" aria-label="' + esc(aria) + '"><span class="material-symbols-outlined">edit</span></button>' +
      '</div>';
  }
  function srow(label, value, aria, icon) {
    return '' +
      '<div class="ip-srow">' +
        '<div class="ip-stitle"><span class="ip-lbl">' + label + '</span>' +
          '<button class="ip-ed" type="button" aria-label="' + esc(aria) + '"><span class="material-symbols-outlined">' + (icon || "edit") + '</span></button>' +
        '</div>' +
        '<span class="ip-sval">' + esc(value) + '</span>' +
      '</div>';
  }

  var TODAY = "13 sept. 2026";

  /* ── Alta médica · estado por paciente (persiste durante la sesión) ── */
  var DISCHARGED = {};
  var DOCTOR = { name: "Dr. Carlos Méndez", av: "CM", reg: "Reg. médico 48 219" };
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function nowStamp() {
    var dt = new Date();
    return {
      fecha: dt.getDate() + " " + MESES[dt.getMonth()] + " " + dt.getFullYear(),
      hora: pad2(dt.getHours()) + ":" + pad2(dt.getMinutes()) + " h"
    };
  }

  /* chip del header: alerta (activo) ↔ Dado de alta (registrado) */
  function chipMarkup(d) {
    if (DISCHARGED[d.key]) {
      return '<span class="ip-chip discharged" id="ipChip"><span class="material-symbols-outlined">check_circle</span>Dado de alta</span>';
    }
    return '<span class="ip-chip ' + d.alerta.cls + '" id="ipChip"><span class="material-symbols-outlined">open_in_new</span>Última alerta: ' + d.alerta.txt + '</span>';
  }

  /* banner: info·sin marcar (con checkbox) ↔ registrada·alta otorgada (con registro) */
  function bannerMarkup(d) {
    var rec = DISCHARGED[d.key];
    if (rec) {
      return '' +
        '<div class="ip-discharge registered" id="ipDischarge">' +
          '<span class="ip-dh-title">Alta médica</span>' +
          '<div class="ip-dh-desc">' +
            '<span class="ip-dh-strong">El alta médica fue registrada. No se ejecutarán más seguimientos programados para este paciente.</span>' +
          '</div>' +
          '<div class="ip-dh-record">' +
            '<div class="ip-rec-av">' + esc(DOCTOR.av) + '</div>' +
            '<div class="ip-rec-who">' +
              '<span class="ip-rec-name">' + esc(DOCTOR.name) + '</span>' +
              '<span class="ip-rec-spec">' + esc(rec.spec) + ' · ' + esc(DOCTOR.reg) + '</span>' +
            '</div>' +
            '<div class="ip-rec-meta">' +
              '<span><span class="material-symbols-outlined">calendar_today</span>' + esc(rec.fecha) + '</span>' +
              '<span><span class="material-symbols-outlined">schedule</span>' + esc(rec.hora) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    return '' +
      '<div class="ip-discharge info" id="ipDischarge">' +
        '<span class="ip-dh-title">Alta médica</span>' +
        '<div class="ip-dh-desc">' +
          '<span class="ip-dh-body">Selecciona esta opción si el paciente cumple con los criterios médicos para finalizar su proceso de seguimiento, es decir, si el paciente ha completado al menos 2 seguimientos y las alertas generadas han sido bajas.</span>' +
          '<span class="ip-dh-strong">No se continuarán ejecutando seguimientos médicos programados al dar alta médica.</span>' +
        '</div>' +
        '<div class="ip-dh-checks">' +
          '<button class="ip-checkbox" type="button" id="ipDischargeCheck"><span class="box"><span class="material-symbols-outlined">check_box_outline_blank</span></span><span class="lbl">Dar alta médica</span></button>' +
        '</div>' +
      '</div>';
  }

  /* swap en sitio del banner + chip tras confirmar el alta */
  function applyDischarge(d) {
    var banner = document.getElementById("ipDischarge");
    if (banner) banner.outerHTML = bannerMarkup(d);
    var chip = document.getElementById("ipChip");
    if (chip) chip.outerHTML = chipMarkup(d);
  }

  /* flujo: checkbox → alert de confirmación → registro + éxito */
  function openDischargeFlow(d) {
    window.openStatusDialog({
      type: "alert", icon: "warning",
      title: "¿Dar de alta médica a este paciente?",
      desc: "Al dar el alta médica no se continuarán ejecutando los seguimientos médicos programados para " + d.name + ". Esta acción quedará registrada y no se puede deshacer.",
      buttons: [
        { label: "No, regresar", variant: "text" },
        { label: "Sí, dar de alta", variant: "tonal", keepOpen: true, onClick: function () {
            var st = nowStamp();
            DISCHARGED[d.key] = { fecha: st.fecha, hora: st.hora, spec: d.altaEsp };
            applyDischarge(d);
            window.openStatusDialog({
              type: "success", icon: "check_circle",
              title: "Alta médica registrada",
              desc: "El alta médica de " + d.name + " fue registrada correctamente. No se ejecutarán más seguimientos programados para este paciente.",
              buttons: [{ label: "Aceptar", variant: "tonal" }]
            });
          } }
      ]
    });
  }

  function render() {
    var p = window.__selectedPaciente || { name: "Paciente", date: "—", base: "Hipertensión arterial", dx: "" };
    var d = buildData(p);
    d.key = p.name;

    page.innerHTML = '' +
      /* ── Header — page ── */
      '<div class="ip-header">' +
        '<button class="ip-back" id="ipBack" type="button" aria-label="Volver"><span class="material-symbols-outlined">arrow_back</span></button>' +
        '<div class="ip-titles">' +
          '<h1 class="ip-title">Información del paciente</h1>' +
          '<span class="ip-subtitle">Accede a la información general del paciente, historia médica e informes de seguimiento.</span>' +
        '</div>' +
      '</div>' +

      /* ── Breadcrumb ── */
      '<nav class="ip-crumbs" aria-label="Ruta de navegación">' +
        '<a class="ip-crumb" id="ipCrumbHist" href="#/historias-y-evoluciones">Historias</a>' +
        '<span class="ip-sep toward-current">/</span>' +
        '<span class="ip-crumb current" aria-current="page">Información del paciente</span>' +
      '</nav>' +

      /* ── Card info patient (variante Chip) ── */
      '<div class="ip-card">' +
        '<div class="ip-pc-head">' +
          '<div class="ip-who">' +
            '<div class="ip-av">' + esc(initials(p.name)) + '</div>' +
            '<span class="ip-pname">' + esc(p.name) + '</span>' +
          '</div>' +
          chipMarkup(d) +
        '</div>' +

        '<div class="ip-panel">' +
          '<div class="ip-col">' +
            row("Documento/DNI:", d.documento, "Editar documento") +
            row("Edad:", d.edad, "Editar edad") +
            row("Grupo sanguíneo:", d.sangre, "Editar grupo sanguíneo") +
            row("Teléfono:", d.telefono, "Editar teléfono") +
            srow("NPS:", d.nps, "Información NPS", "info") +
          '</div>' +
          '<div class="ip-col">' +
            row("Fecha de nacimiento:", d.nacimiento, "Editar fecha de nacimiento") +
            row("Género:", d.genero, "Editar género") +
            row("Última consulta:", d.ultimaConsulta, "Editar última consulta") +
            row("Correo:", d.correo, "Editar correo") +
            srow("Alergias:", d.alergias, "Editar alergias") +
          '</div>' +
        '</div>' +

        '<div class="ip-extra">' +
          '<div class="ip-srow">' +
            '<div class="ip-stitle"><span class="ip-lbl">Contactos de emergencia:</span>' +
              '<button class="ip-ed" type="button" aria-label="Editar contactos de emergencia"><span class="material-symbols-outlined">edit</span></button>' +
            '</div>' +
            '<span class="ip-sval bullet">' + esc(d.contactoNombre) + ': ' + esc(d.contactoTel) + '</span>' +
          '</div>' +
          '<div class="ip-row" style="min-height:auto; align-items:flex-start;">' +
            '<div class="ip-rl" style="align-items:flex-start;">' +
              '<span class="ip-lbl">Dirección:</span>' +
              '<span class="ip-val" style="white-space:normal;">' + esc(d.direccion) + '</span>' +
            '</div>' +
            '<button class="ip-ed" type="button" aria-label="Editar dirección"><span class="material-symbols-outlined">edit</span></button>' +
          '</div>' +
        '</div>' +

        '<div class="ip-alta">' +
          '<div class="ip-rl">' +
            '<span class="ip-lbl">Última alta médica:</span>' +
            '<span class="ip-val">' + esc(d.altaFecha) + ' – ' + esc(d.altaEsp) + '</span>' +
          '</div>' +
          '<button class="ip-ed plain" type="button" aria-label="Abrir alta médica"><span class="material-symbols-outlined">open_in_new</span></button>' +
        '</div>' +
      '</div>' +

      /* ── Banner medical discharge ── */
      bannerMarkup(d) +

      /* ── Tabs + acciones ── */
      '<div class="ip-tabs-row">' +
        '<div class="ip-tablist" role="tablist" aria-label="Vista del paciente">' +
          '<button class="ip-tab" role="tab" id="ipTabSeg" aria-controls="ipPanelSeg" aria-selected="false" tabindex="-1">' +
            '<span class="material-symbols-outlined">show_chart</span>Seguimientos' +
          '</button>' +
          '<button class="ip-tab" role="tab" id="ipTabHis" aria-controls="ipPanelHis" aria-selected="true" tabindex="0">' +
            '<span class="material-symbols-outlined">description</span>Historia' +
          '</button>' +
        '</div>' +
        '<div class="ip-actions">' +
          '<button class="bt-text" type="button" id="ipCrearEvolucion"><span class="material-symbols-outlined">add</span><span>Crear evolución</span></button>' +
          '<button class="bt-tonal" type="button" id="ipCrearHistoria"><span class="material-symbols-outlined">add</span><span>Crear historia</span></button>' +
        '</div>' +
      '</div>' +

      /* ── Paneles ── */
      '<div class="ip-panelarea">' +
        '<div class="ip-tabpanel" role="tabpanel" id="ipPanelSeg" aria-labelledby="ipTabSeg" hidden>' +
          seguimientosPanelMarkup(p, d) +
        '</div>' +
        '<div class="ip-tabpanel" role="tabpanel" id="ipPanelHis" aria-labelledby="ipTabHis">' +
          '<div class="ip-co-card">' +
            '<div class="ip-co-content">' +
              '<span class="ip-co-title">¡Bienvenido a Secuence!</span>' +
              '<span class="ip-co-sub">Fecha: ' + TODAY + '</span>' +
              '<span class="ip-co-body">En esta sección podrás ver las historias de tus pacientes por especialidad. Secuence es una plataforma que ayuda a los profesionales de la salud a dar continuidad al cuidado de sus pacientes.</span>' +
            '</div>' +
            '<div class="ip-co-footer">' +
              '<button class="ip-co-act" type="button">Ver más</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    /* back → siempre a la lista de Pacientes */
    document.getElementById("ipBack").addEventListener("click", function () {
      location.hash = "#/historias-y-evoluciones";
    });

    /* alta médica → confirmación */
    var chk = document.getElementById("ipDischargeCheck");
    if (chk) chk.addEventListener("click", function () { openDischargeFlow(d); });

    /* "Crear historia" → Nueva historia */
    var crearHistoria = document.getElementById("ipCrearHistoria");
    if (crearHistoria) crearHistoria.addEventListener("click", function () {
      window.__selectedPaciente = p;
      window.__selectedPacienteData = d;
      window.__nuevaHistoriaOrigin = "informacion-paciente";
      location.hash = "#/nueva-historia";
    });

    /* "Crear evolución" → Evolución clínica */
    var crearEvolucion = document.getElementById("ipCrearEvolucion");
    if (crearEvolucion) crearEvolucion.addEventListener("click", function () {
      window.__selectedPaciente = p;
      window.__selectedPacienteData = d;
      window.__evolucionClinicaOrigin = "informacion-paciente";
      location.hash = "#/evolucion-clinica";
    });

    /* seguimientos (accordion) */
    var segPanel = document.getElementById("ipPanelSeg");
    if (segPanel) wireSeguimientosPanel(segPanel, p);

    /* tabs (DS boxed) — selección + teclado */
    var tablist = page.querySelector('.ip-tablist[role="tablist"]');
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  window.__renderPaciente = render;
  window.__buildPacienteData = buildData;
})();
