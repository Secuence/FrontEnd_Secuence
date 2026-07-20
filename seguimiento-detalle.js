/* =====================================================================
   Detalle de seguimiento (#/seguimiento-detalle)
   Renderiza la pantalla a partir del paciente/seguimiento seleccionado en
   la tabla "Seguimientos" (window.__selectedSeguimiento). Datos clínicos
   deterministas (seed = hash del nombre): sólo el nombre, fechas y nivel de
   alerta provienen de la fila. El nivel de alerta de la fila define el
   nivel por defecto del Banner follow-up del seguimiento activo.
   Componentes DS: Header page · Breadcrumb · Card info patient · Accordion
   · List variants · Chips · Banner follow-up · Card open follow-up ·
   Button filled tonal.
   ===================================================================== */
(function () {
  "use strict";

  var page = document.getElementById("sdPage");
  if (!page) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    return ((p[0] ? p[0][0] : "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  }
  function seed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }
  function pick(arr, n) { return arr[(n >>> 0) % arr.length]; }

  var MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  function fmtDate(d, m, y) { return d + " " + MESES[((m % 12) + 12) % 12] + " " + y; }
  /* desplaza una fecha "DD mmm. YYYY" hacia atrás `days` días (aprox.) */
  function shiftDate(label, days) {
    var m = String(label).match(/(\d{1,2})\s+([a-záé.]+)\s+(\d{4})/i);
    if (!m) return label;
    var d = parseInt(m[1], 10);
    var mi = MESES.indexOf(m[2].toLowerCase());
    var y = parseInt(m[3], 10);
    var dt = new Date(y, mi < 0 ? 0 : mi, d);
    dt.setDate(dt.getDate() - days);
    return fmtDate(dt.getDate(), dt.getMonth(), dt.getFullYear());
  }

  var DOCTOR = { name: "Dr. Carlos Méndez" };
  var TODAY = "13 sept. 2026";

  /* ── Card info patient · datos deterministas ── */
  var SANGRE = ["O+", "A+", "B+", "O-", "A-", "AB+", "B-", "Sin registrar"];
  var ALERGIAS = ["No registra alergias", "Penicilina · Sulfamidas", "Aspirina (AAS)", "Mariscos · Yodo", "Polen · Ácaros", "Látex"];
  var CIUDADES = ["Barquisimeto, Lara, Venezuela", "Caracas, Distrito Capital, Venezuela", "Valencia, Carabobo, Venezuela", "Maracaibo, Zulia, Venezuela", "Mérida, Mérida, Venezuela"];
  var CONTACTOS = [["María Ortega", "+58 414 123 25 67"], ["José Restrepo", "+58 412 887 41 20"], ["Ana Lucía Pérez", "+58 424 552 18 03"], ["Carlos Mendoza", "+58 416 310 77 95"], ["Patricia Gil", "+58 414 905 63 41"]];
  var FEM = ["maría", "lucía", "valentina", "ana", "patricia", "daniela", "camila", "paula", "isabella", "mariana", "sara", "antonia", "gabriela", "valeria"];

  function genero(name) {
    var first = String(name).trim().split(/\s+/)[0].toLowerCase();
    if (FEM.indexOf(first) !== -1) return "Femenino";
    return first.charAt(first.length - 1) === "a" ? "Femenino" : "Masculino";
  }

  function buildPatient(row) {
    var s = seed(row.name);
    var edad = 28 + (s % 51);
    var nacY = 2026 - edad, nacM = (s >>> 3) % 12, nacD = 1 + ((s >>> 6) % 27);
    var docA = 10 + (s % 20), docB = 100 + ((s >>> 4) % 900), docC = 100 + ((s >>> 8) % 900);
    var tel = "+58 4" + (10 + (s % 30)) + " " + (100 + ((s >>> 5) % 900)) + " " + (10 + ((s >>> 9) % 90)) + " " + (10 + ((s >>> 11) % 90));
    var nps = row.nps != null ? row.nps : (60 + (s % 35));
    var first = String(row.name).trim().split(/\s+/)[0];
    var last = String(row.name).trim().split(/\s+/).pop();
    var correo = (first + "." + last).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "@gmail.com";
    var c = pick(CONTACTOS, s >>> 4);
    return {
      name: row.name,
      documento: "V-" + docA + "." + docB + "." + docC,
      edad: edad + " años",
      sangre: pick(SANGRE, s >>> 2),
      telefono: tel,
      nps: nps + "/100 – Paciente " + (nps >= 80 ? "muy satisfecho" : nps >= 65 ? "satisfecho" : "conforme") + " con el seguimiento; solicita recordatorios de medicación por WhatsApp.",
      nacimiento: fmtDate(nacD, nacM, nacY),
      genero: genero(row.name),
      ultimaConsulta: row.cons || "—",
      correo: correo,
      alergias: pick(ALERGIAS, s >>> 1),
      contactoNombre: c[0], contactoTel: c[1],
      direccion: "Calle " + (10 + (s % 80)) + " #" + (10 + ((s >>> 3) % 80)) + "-" + (10 + ((s >>> 6) % 80)) + ". " + pick(CIUDADES, s >>> 5)
    };
  }

  /* ── Casos clínicos deterministas (uno por paciente, según seed) ── */
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

  /* criterios del Banner follow-up por nivel (DS) */
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
  var ALERT_TO_LEVEL = { baja: "low", media: "medium", alta: "high" };
  var SOURCE_LABEL = { seguimientos: "Seguimientos", alertas: "Alertas" };
  var SOURCE_HASH = { seguimientos: "#/seguimientos", alertas: "#/alertas" };

  /* nº de seguimientos (acordeones): 1..4 determinista */
  function numFollowups(s) { return 1 + (s % 4); }
  /* esquema de días por acordeón (el más reciente primero) */
  var DIAS_POOL = [15, 5, 30, 45, 60];

  /* ── Builders ── */
  function chip(label, tone, withInfo) {
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
        chip(st.label, st.tone, true) + '</div>';
    }
    var consulta = c.consulta.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("");
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

  function bannerFollowup(level, confirmed, idx) {
    var crit = CRIT[level];
    var critLis = crit.body.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join("");
    var isHigh = level === "high";
    var palert = isHigh
      ? '<span class="palert"><span class="material-symbols-outlined">warning</span>Requiere contacto médico inmediato o remisión a urgencias.</span>'
      : '';
    var sub = confirmed ? '<span class="psub">Confirmada por: ' + esc(DOCTOR.name) + ' · ' + TODAY + '</span>' : '';
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

  function proximos(respDate) {
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

  /* ── Render principal ── */
  function render() {
    var row = window.__selectedSeguimiento || { name: "Paciente", ult: TODAY, prox: "—", cons: "—", alert: "media", nps: 70, source: "seguimientos" };
    var source = SOURCE_LABEL[row.source] ? row.source : "seguimientos";
    var s = seed(row.name);
    var p = buildPatient(row);
    var c = pick(CASES, s);
    var rowLevel = ALERT_TO_LEVEL[row.alert] || "medium";
    var n = numFollowups(s);

    var STAT = [
      { label: "Iniciado", tone: "green" },
      { label: "Completado", tone: "blue" },
      { label: "Pendiente", tone: "yellow" }
    ];

    /* acordeones: el #0 (más reciente) es el seguimiento activo (sin confirmar,
       nivel = alerta de la fila); los anteriores quedan confirmados. */
    var accs = "";
    for (var i = 0; i < n; i++) {
      var dias = DIAS_POOL[i % DIAS_POOL.length];
      var resp = i === 0 ? (row.ult || TODAY) : shiftDate(row.ult || TODAY, i * 22);
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
              '<div class="sd-right">' + bannerFollowup(level, confirmed, i) + '</div>' +
            '</div>' +
            proximos(resp) +
          '</div>' +
        '</div>';
    }

    function infoRow(label, value, aria) {
      return '<div class="ip-row"><div class="ip-rl"><span class="ip-lbl">' + label + '</span>' +
        '<span class="ip-val">' + esc(value) + '</span></div></div>';
    }
    function infoSrow(label, value, aria, icon) {
      /* En esta vista la Card info patient es de sólo lectura: sólo se conserva
         el icono informativo (NPS); no se muestran botones de edición. */
      var btn = icon === "info"
        ? '<button class="ip-ed" type="button" aria-label="' + esc(aria) + '"><span class="material-symbols-outlined">info</span></button>'
        : '';
      return '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">' + label + '</span>' + btn + '</div>' +
        '<span class="ip-sval">' + esc(value) + '</span></div>';
    }

    page.innerHTML = '' +
      /* Header page */
      '<div class="ip-header">' +
        '<button class="ip-back" id="sdBack" type="button" aria-label="Volver"><span class="material-symbols-outlined">arrow_back</span></button>' +
        '<div class="ip-titles">' +
          '<h1 class="ip-title">Detalle de seguimiento</h1>' +
          '<span class="ip-subtitle">Accede a la información general del paciente, historia médica e informes de seguimiento.</span>' +
        '</div>' +
      '</div>' +

      /* Breadcrumb (origen → detalle) */
      '<nav class="ip-crumbs" aria-label="Ruta de navegación">' +
        '<a class="ip-crumb" id="sdCrumbSrc" href="' + SOURCE_HASH[source] + '">' + esc(SOURCE_LABEL[source]) + '</a>' +
        '<span class="ip-sep toward-current">/</span>' +
        '<span class="ip-crumb current" aria-current="page">Detalle de seguimiento</span>' +
      '</nav>' +

      /* Card info patient */
      '<div class="ip-card">' +
        '<div class="ip-pc-head">' +
          '<div class="ip-who"><div class="ip-av">' + esc(initials(p.name)) + '</div>' +
            '<span class="ip-pname">' + esc(p.name) + '</span></div>' +
          '<span class="ip-chip alert-' + row.alert + '">' + (row.alert === "alta" ? "Alta" : row.alert === "media" ? "Media" : "Baja") + '</span>' +
        '</div>' +
        '<div class="ip-panel">' +
          '<div class="ip-col">' +
            infoRow("Documento/DNI:", p.documento, "Editar documento") +
            infoRow("Edad:", p.edad, "Editar edad") +
            infoRow("Grupo sanguíneo:", p.sangre, "Editar grupo sanguíneo") +
            infoRow("Teléfono:", p.telefono, "Editar teléfono") +
            infoSrow("NPS:", p.nps, "Información NPS", "info") +
          '</div>' +
          '<div class="ip-col">' +
            infoRow("Fecha de nacimiento:", p.nacimiento, "Editar fecha de nacimiento") +
            infoRow("Género:", p.genero, "Editar género") +
            infoRow("Última consulta:", p.ultimaConsulta, "Editar última consulta") +
            infoRow("Correo:", p.correo, "Editar correo") +
            infoSrow("Alergias:", p.alergias, "Editar alergias") +
          '</div>' +
        '</div>' +
        '<div class="ip-extra">' +
          '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">Contactos de emergencia:</span></div>' +
            '<span class="ip-sval bullet">' + esc(p.contactoNombre) + ': ' + esc(p.contactoTel) + '</span></div>' +
          '<div class="ip-row" style="min-height:auto; align-items:flex-start;">' +
            '<div class="ip-rl" style="align-items:flex-start;"><span class="ip-lbl">Dirección:</span>' +
            '<span class="ip-val" style="white-space:normal;">' + esc(p.direccion) + '</span></div></div>' +
        '</div>' +
      '</div>' +

      /* Tabs + acciones (mismo patrón que Información del paciente; Seguimientos
         seleccionado por defecto en esta pantalla) */
      '<div class="ip-tabs-row">' +
        '<div class="ip-tablist" role="tablist" aria-label="Vista del paciente">' +
          '<button class="ip-tab" role="tab" id="sdTabSeg" aria-controls="sdPanelSeg" aria-selected="true" tabindex="0">' +
            '<span class="material-symbols-outlined">show_chart</span>Seguimientos' +
          '</button>' +
          '<button class="ip-tab" role="tab" id="sdTabHis" aria-controls="sdPanelHis" aria-selected="false" tabindex="-1">' +
            '<span class="material-symbols-outlined">description</span>Historia' +
          '</button>' +
        '</div>' +
        '<div class="ip-actions">' +
          '<button class="bt-text" type="button" id="sdCrearEvolucion"><span class="material-symbols-outlined">add</span><span>Crear evolución</span></button>' +
          '<button class="bt-tonal" type="button" id="sdCrearHistoria"><span class="material-symbols-outlined">add</span><span>Crear historia</span></button>' +
        '</div>' +
      '</div>' +

      /* Paneles */
      '<div class="ip-panelarea">' +
        '<div class="ip-tabpanel" role="tabpanel" id="sdPanelSeg" aria-labelledby="sdTabSeg">' +
          '<div class="sd-accordion">' + accs + '</div>' +
        '</div>' +
        '<div class="ip-tabpanel" role="tabpanel" id="sdPanelHis" aria-labelledby="sdTabHis" hidden>' +
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

    wire(row, source, c, p);
  }

  function wire(row, source, c, p) {
    /* volver al origen */
    var back = document.getElementById("sdBack");
    if (back) back.addEventListener("click", function () {
      if (history.length > 1) history.back();
      else location.hash = SOURCE_HASH[source] || "#/seguimientos";
    });

    /* tabs (DS boxed) — selección + teclado, mismo patrón que Información del paciente */
    var tablist = page.querySelector('.ip-tablist[role="tablist"]');
    if (tablist) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var select = function (tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      };
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

    /* "Crear historia" / "Crear evolución" → mismos flujos que Información del
       paciente, usando los datos de ESTE paciente; el origen se guarda para
       que el botón "←" de esas pantallas vuelva aquí. */
    var pForNav = { name: row.name, date: p.ultimaConsulta, base: c.base, dx: c.dx };
    var crearHistoria = document.getElementById("sdCrearHistoria");
    if (crearHistoria) crearHistoria.addEventListener("click", function () {
      window.__selectedPaciente = pForNav;
      window.__selectedPacienteData = p;
      window.__nuevaHistoriaOrigin = "seguimiento-detalle";
      location.hash = "#/nueva-historia";
    });
    var crearEvolucion = document.getElementById("sdCrearEvolucion");
    if (crearEvolucion) crearEvolucion.addEventListener("click", function () {
      window.__selectedPaciente = pForNav;
      window.__selectedPacienteData = p;
      window.__evolucionClinicaOrigin = "seguimiento-detalle";
      location.hash = "#/evolucion-clinica";
    });

    /* acordeón */
    Array.prototype.forEach.call(page.querySelectorAll("[data-acc-head]"), function (head) {
      head.addEventListener("click", function () {
        var acc = head.closest("[data-acc]");
        var open = acc.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    /* banner follow-up · interactivo (uno por acordeón sin confirmar) */
    Array.prototype.forEach.call(page.querySelectorAll("[data-bfu]"), function (bfu) {
      if (bfu.classList.contains("confirmed")) return;
      wireBanner(bfu);
    });

    /* card open follow-up → dialog "Próximos seguimientos" del paciente */
    Array.prototype.forEach.call(page.querySelectorAll("[data-fu-card]"), function (card) {
      function open() {
        if (window.openProximosDialog) window.openProximosDialog({ name: row.name });
      }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });

    /* Editar seguimientos → modal "Próximos seguimientos" del paciente */
    Array.prototype.forEach.call(page.querySelectorAll("[data-edit-seguimientos]"), function (btn) {
      btn.addEventListener("click", function () {
        if (window.openProximosDialog) window.openProximosDialog({ name: row.name });
      });
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
    var current = (function () {
      var m = (bfu.className.match(/\b(low|medium|high)\b/));
      return m ? m[1] : "low";
    })();

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
        /* firma + (alta) línea de urgencia */
        var plabels = input.querySelector(".plabels");
        if (plabels && !plabels.querySelector(".psub")) {
          if (current === "high" && !plabels.querySelector(".palert")) {
            var pa = document.createElement("span");
            pa.className = "palert";
            pa.innerHTML = '<span class="material-symbols-outlined">warning</span>Requiere contacto médico inmediato o remisión a urgencias.';
            plabels.appendChild(pa);
          }
          var sub = document.createElement("span");
          sub.className = "psub";
          sub.textContent = "Confirmada por: " + DOCTOR.name + " · " + TODAY;
          plabels.appendChild(sub);
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
    /* Confirmar abre primero el modal System status (DS) de confirmación:
       la acción es irreversible, así que se pide ratificación explícita. */
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
    document.addEventListener("click", function (e) {
      if (!bfu.contains(e.target)) openMenu(false);
    });
  }

  window.__renderSeguimientoDetalle = render;
})();
