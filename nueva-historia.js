/* =====================================================================
   Nueva historia (#/nueva-historia)
   ---------------------------------------------------------------------
   Formulario largo de una sola columna con drawer contextual (9
   secciones + scroll-spy). Al activar el toggle de la sección 9 se abre
   el modal "Nuevo seguimiento" con la programación de seguimientos.
   Datos clínicos (CIE, diagnóstico, antecedentes) son mocks ilustrativos.
   ===================================================================== */
(function () {
  "use strict";

  var page = document.getElementById("nhPage");
  if (!page) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  function todayFmt() {
    var d = new Date();
    return d.getDate() + " " + MESES[d.getMonth()] + " " + d.getFullYear();
  }

  /* ───────────────────────── mock reference data ───────────────────────── */
  var CIE_OPTS = [
    "I10 · Hipertensión esencial (primaria)",
    "E11 · Diabetes mellitus tipo 2",
    "E78 · Trastornos del metabolismo de lipoproteínas",
    "J45 · Asma",
    "J44 · Enfermedad pulmonar obstructiva crónica",
    "N18 · Enfermedad renal crónica",
    "M06 · Artritis reumatoide",
    "K29 · Gastritis y duodenitis",
    "G43 · Migraña",
    "D50 · Anemia por deficiencia de hierro",
    "E03 · Hipotiroidismo",
    "Sin antecedentes registrados"
  ];
  var FAM_OPTS = ["Sin antecedentes", "Diabetes mellitus", "Hipertensión arterial", "Cáncer", "Enfermedad cardiovascular", "Enfermedad renal", "Otro"];
  var DIAG_OPTS = [
    "I10 - Hipertensión esencial", "E11 - Diabetes mellitus tipo 2", "J45 - Asma",
    "J44 - EPOC", "N18 - Enfermedad renal crónica", "M06 - Artritis reumatoide",
    "K29 - Gastritis crónica", "G43 - Migraña crónica"
  ];
  var COD_OPTS = [
    { v: "+58", t: "+58 - Venezuela" }, { v: "+57", t: "+57 - Colombia" },
    { v: "+52", t: "+52 - México" }, { v: "+51", t: "+51 - Perú" },
    { v: "+56", t: "+56 - Chile" }, { v: "+593", t: "+593 - Ecuador" }
  ];
  var FREQ_OPTS = ["Horas", "Días"];
  var DEFAULT_QS = {
    1: ["¿Pudo iniciar el tratamiento indicado?", "¿Ha sentido alguna reacción adversa o molestia nueva tras haber iniciado el tratamiento indicado?", "¿Qué intensidad tiene su molestia o síntoma principal el día de hoy?", "¿Tienes alguna duda sobre las indicaciones?"],
    2: ["¿Ha continuado con su tratamiento exactamente como se indicó?", "Comparado con el primer día, ¿cómo describiría la evolución de su síntoma principal hoy?", "¿Ha aparecido algún síntoma NUEVO que no tenía el día de la consulta?"],
    cierre: ["¿Logró terminar todo el esquema de tratamiento por los días indicados?", "En términos generales, ¿considera que el problema por el que consultó ya se resolvió?", "Según cómo se siente, ¿necesita agendar una nueva consulta de control con su médico?"]
  };

  var SECTIONS = [
    { n: "1", id: "sec-1", label: "Datos del paciente", icon: "person" },
    { n: "2", id: "sec-2", label: "Motivo de consulta", icon: "chat" },
    { n: "3", id: "sec-3", label: "Antecedentes", icon: "history" },
    { n: "4", id: "sec-4", label: "Exámen funcional", icon: "stethoscope" },
    { n: "5", id: "sec-5", label: "Exámen físico", icon: "monitor_heart" },
    { n: "6", id: "sec-6", label: "Diagnóstico", icon: "medical_information" },
    { n: "7", id: "sec-7", label: "Documentos", icon: "description" },
    { n: "8", id: "sec-8", label: "Plan", icon: "checklist" },
    { n: "9", id: "sec-9", label: "Seguimiento", icon: "event_repeat" }
  ];

  /* ───────────────────────── field builders ───────────────────────── */
  function field(id, label, placeholder, opts) {
    opts = opts || {};
    var req = opts.required ? ' <span class="req">*</span>' : "";
    var type = opts.type || "text";
    var suffix = opts.suffix ? '<span class="ff-suffix">' + esc(opts.suffix) + "</span>" : "";
    var icon = opts.icon ? '<span class="ff-icon material-symbols-outlined"' + (opts.iconTitle ? ' title="' + esc(opts.iconTitle) + '"' : "") + ">" + opts.icon + "</span>" : "";
    return (
      '<div class="ff" data-field="' + id + '">' +
        '<div class="ff-box">' +
          '<input class="ff-input" id="' + id + '" type="' + type + '" placeholder="' + esc(placeholder) + '" autocomplete="off">' +
          '<label class="ff-label" for="' + id + '">' + label + req + "</label>" +
          suffix + icon +
        "</div>" +
        '<div class="ff-support" hidden></div>' +
      "</div>"
    );
  }

  function textareaField(id, label, placeholder, opts) {
    opts = opts || {};
    var req = opts.required ? ' <span class="req">*</span>' : "";
    return (
      '<div class="ff" data-field="' + id + '">' +
        '<div class="ff-box" style="height:auto; min-height:88px; align-items:flex-start; padding-top:20px; padding-bottom:12px;">' +
          '<textarea class="ff-input" id="' + id + '" rows="3" placeholder="' + esc(placeholder) + '" style="resize:vertical; min-height:56px;"></textarea>' +
          '<label class="ff-label" for="' + id + '">' + label + req + "</label>" +
        "</div>" +
      "</div>"
    );
  }

  function selectField(id, label, options, value) {
    var items = options.map(function (o) {
      var v = o.v != null ? o.v : o, t = o.t != null ? o.t : o;
      return '<div class="menu-item" role="option" data-value="' + esc(v) + '">' + esc(t) + "</div>";
    }).join("");
    return (
      '<div class="ff ff-select" data-select="' + id + '" data-value="' + esc(value || "") + '">' +
        '<div class="ff-box" id="' + id + '-box" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="ff-value" id="' + id + '-value">' + esc(value || "") + "</span>" +
          '<label class="ff-label">' + label + "</label>" +
          '<span class="ff-icon material-symbols-outlined">arrow_drop_down</span>' +
        "</div>" +
        '<div class="nu-menu" role="listbox">' + items + "</div>" +
      "</div>"
    );
  }

  function cieField(id, label, placeholder) {
    return (
      '<div class="ff nh-ac" data-cie="' + id + '">' +
        '<div class="ff-box">' +
          '<input class="ff-input" id="' + id + '" type="text" placeholder="' + esc(placeholder) + '" autocomplete="off">' +
          '<label class="ff-label" for="' + id + '">' + label + "</label>" +
          '<span class="ff-icon material-symbols-outlined">search</span>' +
        "</div>" +
        '<div class="nh-ac-menu" role="listbox"></div>' +
      "</div>"
    );
  }

  function segToggle(name, options, selIdx) {
    return (
      '<div class="nh-seg" data-seg="' + name + '">' +
        options.map(function (o, i) {
          return '<button type="button" class="nh-seg-btn' + (i === selIdx ? " sel" : "") + '" data-value="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("") +
      "</div>"
    );
  }

  function vitalField(id, label, placeholder, suffix, infoTitle) {
    return field(id, label, placeholder, { suffix: suffix, icon: "info", iconTitle: infoTitle });
  }

  /* ───────────────────────── modal · Nuevo seguimiento ───────────────────────── */
  function questionRow(text, locked) {
    if (locked) {
      return '<div class="ns-q ns-q--locked"><input class="ns-q-input" type="text" value="' + esc(text) + '" disabled aria-readonly="true"></div>';
    }
    return (
      '<div class="ns-q ns-q--new">' +
        '<input class="ns-q-input" type="text" value="' + esc(text || "") + '" placeholder="¿Nueva pregunta de seguimiento?">' +
        '<button class="ns-q-rm" type="button" aria-label="Quitar pregunta"><span class="material-symbols-outlined">delete</span></button>' +
        '<button class="ns-q-add" type="button" aria-label="Agregar pregunta"><span class="material-symbols-outlined">add</span></button>' +
      "</div>"
    );
  }

  function followupBlock(opts) {
    var qs = (opts.questions || []).map(function (q) { return questionRow(q, true); }).join("") + questionRow("", false);
    var titleTx = opts.cierre ? "Seguimiento #" + opts.n + " (seguimiento de cierre)" : "Seguimiento #" + opts.n;
    var delBtn = opts.deletable
      ? '<button class="ns-fu-del" type="button" aria-label="Eliminar seguimiento"><span class="material-symbols-outlined">delete</span></button>'
      : "";
    return (
      '<div class="ns-fu' + (opts.deletable ? " ns-fu--deletable" : "") + '" data-cierre="' + (opts.cierre ? "1" : "0") + '">' +
        '<div class="ns-fu-head"><span class="ns-fu-title">' + esc(titleTx) + "</span>" + delBtn + "</div>" +
        '<div class="ns-grid-freq">' +
          selectField("freq-" + opts.uid, "Frecuencia", FREQ_OPTS, opts.freq) +
          '<div class="ff" data-field="num-' + opts.uid + '"><div class="ff-box">' +
            '<input class="ff-input" type="text" inputmode="numeric" value="' + esc(opts.num) + '"></div></div>' +
        "</div>" +
        '<span class="ns-q-label">Preguntas</span>' +
        '<div class="ns-qs">' + qs + "</div>" +
      "</div>"
    );
  }

  var fuCounter = 0;
  function segModalMarkup() {
    fuCounter = 3;
    return (
      '<div class="scrim" id="nhSegScrim" aria-hidden="true">' +
        '<div class="du-modal" role="dialog" aria-modal="true" aria-labelledby="nhSegTitle" data-screen-label="Nuevo seguimiento">' +
          '<div class="hd">' +
            '<div class="hd-top">' +
              '<div class="hd-title" id="nhSegTitle">Nuevo seguimiento</div>' +
              '<button class="hd-close" id="nhSegClose" type="button" aria-label="Cerrar"><span class="material-symbols-outlined">close</span></button>' +
            "</div>" +
          "</div>" +
          '<div class="nh-seg-modal-body" id="nhSegBody">' +
            '<div class="ns-sched" id="nhSched">' +
              followupBlock({ uid: 1, n: 1, freq: "Horas", num: 36, questions: DEFAULT_QS[1] }) +
              followupBlock({ uid: 2, n: 2, freq: "Horas", num: 36, questions: DEFAULT_QS[2] }) +
              '<button class="ns-add-fu" id="nhAddFu" type="button"><span class="material-symbols-outlined">add</span>Agregar seguimiento</button>' +
              followupBlock({ uid: 3, n: 3, freq: "Días", num: 8, questions: DEFAULT_QS.cierre, cierre: true }) +
            "</div>" +
            '<div class="nh-avail nh-seg-modal-foot">' +
              '<span class="pg-label">Seguimientos disponibles: 50/100</span>' +
              '<div class="pg-track"><div class="pg-fill" style="width:50%"></div></div>' +
            "</div>" +
          "</div>" +
          '<div class="ft ft--large">' +
            '<div class="ft-left"><button class="bt bt-text-brand" id="nhSegReportar" type="button">Reportar problema</button></div>' +
            '<div class="ft-right">' +
              '<button class="bt bt-text-brand" id="nhSegCancelar" type="button">Cancelar</button>' +
              '<button class="bt bt-filled" id="nhSegGuardar" type="button">Guardar</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  /* ───────────────────────── main render ───────────────────────── */
  function render() {
    page.innerHTML =
      '<div class="nh-page">' +
        /* ── Navigation drawer (contextual) ── */
        '<aside class="nh-nav" id="nhNav">' +
          '<div class="nh-nav-logo">' +
            '<a class="nh-nav-logo-link" id="nhNavLogoLink" href="#/indicadores" aria-label="Ir a Indicadores">' +
              '<img class="full" src="assets/logo-primary.svg" alt="Secuence">' +
              '<img class="iso" src="assets/secuence_favicon.svg" alt="Secuence">' +
            '</a>' +
            '<button class="nh-nav-collapse-btn" id="nhNavCollapseBtn" type="button" aria-label="Contraer/expandir menú"><span class="material-symbols-outlined">left_panel_close</span></button>' +
          "</div>" +
          '<div class="nh-nav-context">Información del paciente</div>' +
          '<nav class="nh-nav-list" id="nhNavList">' +
            SECTIONS.map(function (s, i) {
              return '<button type="button" class="nh-nav-item' + (i === 0 ? " sel" : "") + '" data-target="' + s.id + '" data-tooltip="' + s.n + ". " + esc(s.label) + '"><span class="material-symbols-outlined nh-nav-ic">' + s.icon + '</span><span class="nh-nav-txt">' + s.n + ". " + esc(s.label) + "</span></button>";
            }).join("") +
          "</nav>" +
        "</aside>" +

        '<div class="nh-main">' +
          '<div class="nh-scroll" id="nhScroll">' +
            '<div class="nh-content">' +

              /* ── Header page ── */
              '<div class="nh-header">' +
                '<div class="nh-header-left">' +
                  '<button class="nh-back" id="nhBack" type="button" aria-label="Volver"><span class="material-symbols-outlined">arrow_back</span></button>' +
                  '<h1 class="nh-title">Nueva historia</h1>' +
                "</div>" +
                '<div class="nh-date"><span class="nh-date-lbl">Fecha</span><span class="nh-date-val">' + todayFmt() + "</span></div>" +
              "</div>" +

              /* ── Breadcrumb (origen → Nueva historia) ── */
              '<nav class="ip-crumbs" aria-label="Ruta de navegación">' +
                '<a class="ip-crumb" id="nhCrumbSrc" href="#">' + esc(originLabel()) + '</a>' +
                '<span class="ip-sep toward-current">/</span>' +
                '<span class="ip-crumb current" aria-current="page">Nueva historia</span>' +
              "</nav>" +

              /* ── 1. Datos del paciente ── */
              '<section class="nh-section" id="sec-1">' +
                '<div class="nh-section-head">' +
                  '<h2 class="nh-section-title">1. Datos del paciente</h2>' +
                  '<p class="nh-section-sub">A partir de esta información el sistema podrá generar reportes acerca de la evolución del paciente.</p>' +
                "</div>" +
                '<div class="nh-fields">' +
                  field("nhNombres", "Nombres y apellidos", "Escriba nombres y apellidos", { required: true }) +
                  field("nhEdad", "Edad", "Escriba edad del paciente", { required: true }) +
                  field("nhNacimiento", "Fecha de nacimiento", "Escriba fecha de nacimiento", { required: true, icon: "calendar_month" }) +
                  field("nhDocumento", "DNI/Documento", "Escriba documento", { required: true }) +
                  '<div class="nh-labeled"><span class="nh-label">Género</span>' + segToggle("genero", ["Masculino", "Femenino"], -1) + "</div>" +
                  selectField("nhGrupoSanguineo", "Grupo sanguíneo", ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], "") +
                  field("nhDireccion", "Dirección de residencia", "Escriba dirección", { required: true }) +
                  '<div class="nh-grid-tel">' +
                    selectField("nhCodigo", "Código", COD_OPTS, "+58 - Venezuela") +
                    field("nhTelefono", "Teléfono", "Escriba teléfono", { required: true }) +
                  "</div>" +
                  field("nhCorreo", "Correo", "Escriba correo", { required: true }) +
                "</div>" +
              "</section>" +

              /* ── 2. Motivo de consulta ── */
              '<section class="nh-section" id="sec-2">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">2. Motivo de consulta</h2></div>' +
                '<div class="nh-fields">' +
                  field("nhMotivo", "Motivo", "Describa motivo de consulta", { required: true }) +
                  textareaField("nhEnfermedad", "Enfermedad actual", "Describa enfermedad actual") +
                "</div>" +
              "</section>" +

              /* ── 3. Antecedentes ── */
              '<section class="nh-section" id="sec-3">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">3. Antecedentes personales patológicos - CIE</h2></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="nhTogPato" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes patológicos - CIE (desactive esta opción para indicar que paciente no refiere ningún antecedente patológico personal de la categoría CIE).</span>' +
                "</div>" +
                '<div class="nh-fields" id="nhPatoFields">' +
                  cieField("nhCieCronicas", "Enfermedades crónicas (CIE)", "Escriba enfermedades crónicas") +
                  cieField("nhCieHosp", "Hospitalizaciones previas (CIE)", "Escriba hospitalizaciones previas") +
                  cieField("nhCieAlergias", "Alergias (CIE)", "Escriba alergias") +
                  cieField("nhCieTraumas", "Traumatismos (CIE)", "Escriba traumatismos y hospitalizaciones previas") +
                  cieField("nhCieQuir", "Quirúrgicos (CIE)", "Escriba antecedentes quirúrgicos") +
                  cieField("nhCieOtros", "Otros (CIE)", "Escriba otros antecedentes") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">3.1 Antecedentes personales NO patológicos - Hábitos</h3></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="nhTogHabitos" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes patológicos (desactive esta opción para indicar que paciente no refiere ningún antecedente patológico personal).</span>' +
                "</div>" +
                '<div class="nh-fields" id="nhHabitosFields">' +
                  '<div class="nh-grid-2">' +
                    '<div class="nh-labeled"><span class="nh-label">Tabaquismo</span>' + segToggle("tabaquismo", ["Si", "No"], -1) + "</div>" +
                    '<div class="nh-labeled"><span class="nh-label">Alcohol</span>' + segToggle("alcohol", ["Si", "No"], -1) + "</div>" +
                  "</div>" +
                  field("nhIpa", "IPA", "Especifique IPA") +
                  field("nhAlcoholCant", "Cantidad de alcohol semanal", "Especifique cantidad") +
                  field("nhActividad", "Actividad física", "Especifique actividad física") +
                  field("nhAlimentacion", "Alimentación", "Especifique alimentación") +
                  field("nhInmunizacion", "Inmunización", "Especifique inmunización") +
                  field("nhHabitosOtros", "Otros", "Especifique otros") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">3.2 Antecedentes familiares - CIE</h3></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="nhTogFamiliares" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes familiares (desactive esta opción para indicar que paciente no refiere ningún antecedente familiar).</span>' +
                "</div>" +
                '<div class="nh-fields" id="nhFamiliaresFields">' +
                  selectField("nhFamPadres", "Padres", FAM_OPTS, "") +
                  selectField("nhFamAbuelos", "Abuelos", FAM_OPTS, "") +
                  selectField("nhFamHermanos", "Hermanos", FAM_OPTS, "") +
                  selectField("nhFamOtros", "Otros", FAM_OPTS, "") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">3.3 Antecedentes ginecobstétricos - CIE</h3></div>' +
                '<div class="nh-fields">' +
                  '<div class="nh-gineco-row">' +
                    field("nhMenarquia", "Menarquia", "Especifique menarquia") +
                    field("nhCicloMenstrual", "Ciclo menstrual", "Especifique ciclo menstrual") +
                    '<div class="nh-labeled"><span class="nh-label">&nbsp;</span>' + segToggle("ciclo-tipo", ["Dismenorrea", "Eumenorrea"], -1) + "</div>" +
                  "</div>" +
                  '<div class="nh-section-head"><h4 class="nh-section-title nh-sub" style="font-size:16px;">Obstetricia</h4></div>' +
                  '<div class="nh-grid-4">' +
                    field("nhGestas", "Gestas", "Especifique gestas") +
                    field("nhParas", "Paras", "Especifique paras") +
                    field("nhAbortos", "Abortos", "Especifique abortos") +
                    field("nhCesarea", "Cesárea", "Especifique cesárea") +
                  "</div>" +
                  '<div class="nh-grid-4">' +
                    field("nhFur", "FUR", "Especifique FUR", { icon: "calendar_month" }) +
                    field("nhAnticonceptivo", "Anticonceptivo", "Especifique anticonceptivo") +
                    field("nhIts", "ITS", "Especifique ITS", { icon: "info", iconTitle: "Infecciones de transmisión sexual" }) +
                    field("nhCitologia", "Citología", "Especifique citología") +
                  "</div>" +
                  field("nhMamografia", "Mamografía", "Especifique mamografía") +
                "</div>" +
              "</section>" +

              /* ── 4. Exámen funcional ── */
              '<section class="nh-section" id="sec-4">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">4. Exámen funcional</h2></div>' +
                '<div class="nh-fields">' + textareaField("nhExFuncional", "Examen por aparatos y sistemas", "Describa examen") + "</div>" +
              "</section>" +

              /* ── 5. Exámen físico ── */
              '<section class="nh-section" id="sec-5">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">5. Exámen físico</h2></div>' +
                '<div class="nh-fields">' +
                  '<div class="nh-grid-4">' +
                    vitalField("nhPas", "PAS", "Especifique PAS", "mmHg", "Presión arterial sistólica") +
                    vitalField("nhPad", "PAD", "Especifique PAD", "mmHg", "Presión arterial diastólica") +
                    vitalField("nhPam", "PAM", "Especifique PAM", "mmHg", "Presión arterial media") +
                    vitalField("nhFc", "FC", "Especifique FC", "LPM", "Frecuencia cardíaca") +
                  "</div>" +
                  '<div class="nh-grid-4">' +
                    vitalField("nhFr", "FR", "Especifique FR", "RPM", "Frecuencia respiratoria") +
                    vitalField("nhSpo2", "SpO2", "Especifique SpO2", "%", "Saturación de oxígeno") +
                    vitalField("nhPeso", "Peso", "Especifique Peso", "Kg", "Peso corporal") +
                    vitalField("nhTalla", "Talla", "Especifique talla", "cm", "Estatura") +
                  "</div>" +
                  field("nhImc", "IMC", "Especifique IMC", { suffix: "Peso/Talla²", icon: "info", iconTitle: "Índice de masa corporal" }) +
                  textareaField("nhExFisico", "Examen", "Describa examen físico") +
                "</div>" +
              "</section>" +

              /* ── 6. Diagnóstico ── */
              '<section class="nh-section" id="sec-6">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">6. Diagnóstico de consulta</h2></div>' +
                '<div class="nh-fields">' + selectField("nhDiagnostico", "Diagnóstico", DIAG_OPTS, "") + "</div>" +
              "</section>" +

              /* ── 7. Documentos ── */
              '<section class="nh-section" id="sec-7">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">7. Órdenes y/o estudios médicos previos</h2></div>' +
                '<div class="nh-uploader">' +
                  '<div class="nu-drop" id="nhDrop" role="button" tabindex="0">' +
                    '<span class="material-symbols-outlined">cloud_upload</span>' +
                    '<span class="nu-cta">Haga click para subir archivos <span class="nu-cta-plain">o arrastre archivos aquí</span></span>' +
                    '<span class="nu-support">Sólo archivos PDF, JPG o JPEG (máximo 10MB)</span>' +
                  "</div>" +
                  '<input id="nhFileInput" type="file" accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg" multiple hidden>' +
                  '<div class="nu-files" id="nhFiles"></div>' +
                "</div>" +
              "</section>" +

              /* ── 8. Plan ── */
              '<section class="nh-section" id="sec-8">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">8. Plan</h2></div>' +
                '<div class="nh-fields">' + textareaField("nhPlan", "Plan", "Describa plan médico") + "</div>" +
              "</section>" +

              /* ── 9. Seguimientos ── */
              '<section class="nh-section" id="sec-9">' +
                '<div class="nh-section--row">' +
                  '<div class="nh-section-head">' +
                    '<h2 class="nh-section-title">9. Seguimientos del paciente</h2>' +
                    '<p class="nh-section-sub">Define el horario de cada mensaje de seguimiento que recibirá el paciente.</p>' +
                  "</div>" +
                  '<button type="button" class="nh-track" id="nhTogSeg" role="switch" aria-checked="false" aria-label="Activar seguimientos"></button>' +
                "</div>" +
                '<div class="nh-avail">' +
                  '<span class="pg-label">Seguimientos disponibles: 50/100</span>' +
                  '<div class="pg-track"><div class="pg-fill" style="width:50%"></div></div>' +
                "</div>" +
              "</section>" +

            "</div>" +
          "</div>" +

          /* ── Footer ── */
          '<div class="nh-footer">' +
            '<button class="nu-link" type="button" id="nhReportar">Reportar problema</button>' +
            '<div class="nu-actions">' +
              '<button class="nu-link" type="button" id="nhCancelar">Cancelar</button>' +
              '<button class="btn btn-filled" type="button" id="nhCrear" disabled>Crear historia</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      segModalMarkup();

    wireBack();
    wireNav();
    wireNavCollapse();
    wireNavTooltips("nhNav");
    wireLogoLink();
    wireSegToggles();
    wireSectionToggles();
    wireSelects();
    wireCie();
    wireUploader();
    prefillFromPaciente();
    wireValidation();
    wireSegModal();
    wireFooter();
  }

  /* ───────────────────────── prefill desde "Información del paciente" ───────────────────────── */
  function prefillFromPaciente() {
    var d = window.__selectedPacienteData;
    if (!d) return;
    function setVal(id, v) {
      var el = document.getElementById(id);
      if (el && v != null) el.value = v;
    }
    setVal("nhNombres", d.name);
    setVal("nhEdad", String(d.edad || "").replace(/\s*años\s*$/i, ""));
    setVal("nhNacimiento", d.nacimiento);
    setVal("nhDocumento", d.documento);
    setVal("nhDireccion", d.direccion);
    setVal("nhTelefono", String(d.telefono || "").replace(/^\+\d+\s*/, ""));
    setVal("nhCorreo", d.correo);

    if (d.genero) {
      var seg = document.querySelector('.nh-seg[data-seg="genero"]');
      if (seg) {
        Array.prototype.forEach.call(seg.querySelectorAll(".nh-seg-btn"), function (b) {
          b.classList.toggle("sel", b.getAttribute("data-value") === d.genero);
        });
      }
    }
  }

  /* ───────────────────────── back / cancel — origen guardado en window.__nuevaHistoriaOrigin ───────────────────────── */
  function originTarget() {
    var origin = window.__nuevaHistoriaOrigin;
    if (origin === "historias") return "#/historias-y-evoluciones";
    if (origin === "indicadores") return "#/indicadores";
    if (origin === "seguimiento-detalle") return "#/seguimiento-detalle";
    return "#/informacion-paciente";
  }
  function originLabel() {
    var origin = window.__nuevaHistoriaOrigin;
    if (origin === "historias") return "Historias y evoluciones";
    if (origin === "indicadores") return "Indicadores";
    if (origin === "seguimiento-detalle") return "Detalle de seguimiento";
    return "Información del paciente";
  }
  function goBack() { location.hash = originTarget(); }
  function wireBack() {
    document.getElementById("nhBack").addEventListener("click", goBack);
    var crumb = document.getElementById("nhCrumbSrc");
    if (crumb) crumb.addEventListener("click", function (e) { e.preventDefault(); goBack(); });
  }

  /* ───────────────────────── tooltip fijo (escapa el overflow de .nh-nav) ───────────────────────── */
  function wireNavTooltips(navId) {
    var nav = document.getElementById(navId);
    if (!nav) return;
    var items = Array.prototype.slice.call(nav.querySelectorAll(".nh-nav-item[data-tooltip]"));
    if (!items.length) return;
    var tip = document.createElement("div");
    tip.className = "nav-tooltip";
    document.body.appendChild(tip);
    var current = null;
    function show(el) {
      current = el;
      tip.textContent = el.getAttribute("data-tooltip");
      var r = el.getBoundingClientRect();
      tip.style.top = (r.top + r.height / 2) + "px";
      tip.style.left = (r.right + 8) + "px";
      tip.classList.add("is-visible");
    }
    function hide() { current = null; tip.classList.remove("is-visible"); }
    items.forEach(function (el) {
      el.addEventListener("mouseenter", function () { show(el); });
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focus", function () { show(el); });
      el.addEventListener("blur", hide);
    });
    nav.addEventListener("scroll", function () { if (current) hide(); });
    window.addEventListener("resize", hide);
  }

  /* ───────────────────────── drawer comprimido / expandido ───────────────────────── */
  function wireNavCollapse() {
    var nav = document.getElementById("nhNav");
    var btn = document.getElementById("nhNavCollapseBtn");
    if (!nav || !btn) return;
    var KEY = "sc-nav-collapsed";
    function applyIcon() {
      btn.querySelector(".material-symbols-outlined").textContent = nav.classList.contains("is-collapsed") ? "left_panel_open" : "left_panel_close";
    }
    if (localStorage.getItem(KEY) === "1") nav.classList.add("is-collapsed");
    applyIcon();
    btn.addEventListener("click", function () {
      var collapsed = nav.classList.toggle("is-collapsed");
      nav.classList.toggle("is-force-expanded", !collapsed);
      localStorage.setItem(KEY, collapsed ? "1" : "0");
      applyIcon();
    });
  }

  /* ───────────────────────── logo → Indicadores (confirma si hay datos sin guardar) ───────────────────────── */
  function hasUnsavedChanges() {
    var inputs = page.querySelectorAll(".ff-input:not(:disabled)");
    for (var i = 0; i < inputs.length; i++) {
      if ((inputs[i].value || "").trim() !== "") return true;
    }
    var selects = page.querySelectorAll(".ff-select[data-value]");
    for (var j = 0; j < selects.length; j++) {
      if ((selects[j].getAttribute("data-value") || "").trim() !== "") return true;
    }
    if (page.querySelector(".nu-file")) return true;
    return false;
  }
  function wireLogoLink() {
    var link = document.getElementById("nhNavLogoLink");
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!hasUnsavedChanges()) { location.hash = "#/indicadores"; return; }
      if (!window.openStatusDialog) { location.hash = "#/indicadores"; return; }
      window.openStatusDialog({
        type: "warning", icon: "warning",
        title: "¿Salir sin guardar?",
        desc: "Tienes información sin guardar en esta historia. Si continúas, perderás los cambios realizados.",
        buttons: [
          { label: "Cancelar", variant: "text" },
          { label: "Salir sin guardar", variant: "tonal", onClick: function () { location.hash = "#/indicadores"; } }
        ]
      });
    });
  }

  /* ───────────────────────── contextual nav + scroll-spy ───────────────────────── */
  function wireNav() {
    var scroll = document.getElementById("nhScroll");
    var items = Array.prototype.slice.call(document.querySelectorAll(".nh-nav-item"));
    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (!target) return;
        var top = target.offsetTop - 16;
        scroll.scrollTo({ top: top, behavior: "smooth" });
      });
    });

    var sections = Array.prototype.slice.call(document.querySelectorAll(".nh-section"));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        items.forEach(function (b) { b.classList.toggle("sel", b.getAttribute("data-target") === id); });
      });
    }, { root: scroll, rootMargin: "-15% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ───────────────────────── button toggle (segmented) ───────────────────────── */
  function wireSegToggles() {
    Array.prototype.forEach.call(document.querySelectorAll(".nh-seg"), function (seg) {
      seg.addEventListener("click", function (e) {
        var btn = e.target.closest(".nh-seg-btn");
        if (!btn) return;
        Array.prototype.forEach.call(seg.querySelectorAll(".nh-seg-btn"), function (b) { b.classList.remove("sel"); });
        btn.classList.add("sel");
      });
    });
  }

  /* ───────────────────────── slide toggles (secciones 3 / 3.1 / 3.2) ───────────────────────── */
  function wireSectionToggles() {
    [["nhTogPato", "nhPatoFields"], ["nhTogHabitos", "nhHabitosFields"], ["nhTogFamiliares", "nhFamiliaresFields"]].forEach(function (pair) {
      var tog = document.getElementById(pair[0]);
      var fields = document.getElementById(pair[1]);
      tog.addEventListener("click", function () {
        var on = tog.getAttribute("aria-checked") !== "true";
        tog.setAttribute("aria-checked", on ? "true" : "false");
        tog.classList.toggle("on", on);
        fields.style.opacity = on ? "1" : "0.5";
        fields.style.pointerEvents = on ? "" : "none";
      });
    });
  }

  /* ───────────────────────── Input · Select genérico ───────────────────────── */
  var openSelect = null;
  function wireSelects() {
    Array.prototype.forEach.call(document.querySelectorAll(".ff-select"), initSelect);
    document.addEventListener("click", function () { if (openSelect && openSelect._close) openSelect._close(); });
  }
  function initSelect(sel) {
    var box = sel.querySelector(".ff-box");
    var val = sel.querySelector(".ff-value");
    var icon = sel.querySelector(".ff-icon");
    function close() { sel.classList.remove("is-open"); box.setAttribute("aria-expanded", "false"); if (icon) icon.textContent = "arrow_drop_down"; if (openSelect === sel) openSelect = null; }
    function open() {
      if (openSelect && openSelect !== sel) openSelect._close();
      sel.classList.add("is-open"); box.setAttribute("aria-expanded", "true"); if (icon) icon.textContent = "arrow_drop_up"; openSelect = sel;
    }
    box.addEventListener("click", function (e) { e.stopPropagation(); sel.classList.contains("is-open") ? close() : open(); });
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); } });
    Array.prototype.forEach.call(sel.querySelectorAll(".menu-item"), function (opt) {
      opt.addEventListener("click", function (e) {
        e.stopPropagation();
        Array.prototype.forEach.call(sel.querySelectorAll(".menu-item"), function (o) { o.classList.remove("is-selected"); });
        opt.classList.add("is-selected");
        if (val) val.textContent = opt.textContent;
        sel.setAttribute("data-value", opt.getAttribute("data-value"));
        close();
        checkRequired();
      });
    });
    sel._close = close;
  }

  /* ───────────────────────── CIE autocomplete ───────────────────────── */
  function wireCie() {
    Array.prototype.forEach.call(document.querySelectorAll(".nh-ac"), function (wrap) {
      var input = wrap.querySelector("input");
      var menu = wrap.querySelector(".nh-ac-menu");
      function renderMenu() {
        var q = input.value.trim().toLowerCase();
        var matches = q ? CIE_OPTS.filter(function (o) { return o.toLowerCase().indexOf(q) !== -1; }) : CIE_OPTS.slice(0, 6);
        if (!matches.length) {
          menu.innerHTML = '<div class="nh-ac-empty">Sin resultados para «' + esc(input.value) + '»</div>';
        } else {
          menu.innerHTML = matches.map(function (m) { return '<div class="menu-item" role="option">' + esc(m) + "</div>"; }).join("");
          Array.prototype.forEach.call(menu.querySelectorAll(".menu-item"), function (mi) {
            mi.addEventListener("mousedown", function (e) {
              e.preventDefault();
              input.value = mi.textContent;
              wrap.classList.remove("is-open");
            });
          });
        }
      }
      input.addEventListener("focus", function () { renderMenu(); wrap.classList.add("is-open"); });
      input.addEventListener("input", function () { renderMenu(); wrap.classList.add("is-open"); });
      input.addEventListener("blur", function () { setTimeout(function () { wrap.classList.remove("is-open"); }, 120); });
    });
  }

  /* ───────────────────────── File uploader ───────────────────────── */
  function wireUploader() {
    var drop = document.getElementById("nhDrop");
    var fileI = document.getElementById("nhFileInput");
    var list = document.getElementById("nhFiles");
    var files = [];

    function fmtSize(b) { return b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB"; }
    function addMock() {
      files.push({ name: "examen_sangre.pdf", size: 234567 });
      files.push({ name: "radiografia_torax.jpg", size: 1240000 });
      renderList();
    }
    function renderList() {
      list.innerHTML = files.map(function (f, i) {
        var ext = (f.name.split(".").pop() || "").toLowerCase();
        var cls = ext === "pdf" ? "pdf" : "jpg";
        var ic = ext === "pdf" ? "picture_as_pdf" : "image";
        return '<div class="nu-file"><div class="thumb ' + cls + '"><span class="material-symbols-outlined">' + ic + '</span></div>' +
          '<div class="meta"><div class="name">' + esc(f.name) + '</div><div class="size">' + fmtSize(f.size) + '</div></div>' +
          '<button class="rm" type="button" data-i="' + i + '" aria-label="Quitar archivo"><span class="material-symbols-outlined">close</span></button></div>';
      }).join("");
      Array.prototype.forEach.call(list.querySelectorAll(".rm"), function (b) {
        b.addEventListener("click", function () { files.splice(+b.getAttribute("data-i"), 1); renderList(); });
      });
    }
    function addReal(fl) {
      Array.prototype.forEach.call(fl, function (f) {
        var ext = (f.name.split(".").pop() || "").toLowerCase();
        if (["pdf", "jpg", "jpeg"].indexOf(ext) !== -1) files.push(f);
      });
      renderList();
    }
    drop.addEventListener("click", function () { addMock(); });
    drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addMock(); } });
    fileI.addEventListener("change", function () { addReal(fileI.files); fileI.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-dragover"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-dragover"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) addReal(e.dataTransfer.files); });
  }

  /* ───────────────────────── validación básica de requeridos ───────────────────────── */
  var REQUIRED_IDS = ["nhNombres", "nhEdad", "nhNacimiento", "nhDocumento", "nhDireccion", "nhTelefono", "nhCorreo", "nhMotivo"];
  function checkRequired() {
    var ok = REQUIRED_IDS.every(function (id) {
      var el = document.getElementById(id);
      return el && el.value.trim() !== "";
    });
    var btn = document.getElementById("nhCrear");
    if (btn) btn.disabled = !ok;
  }
  function wireValidation() {
    REQUIRED_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", checkRequired);
    });
    checkRequired();
  }
  // note: checkRequired() re-run after prefill in wireValidation() above.

  /* ───────────────────────── modal · Nuevo seguimiento ───────────────────────── */
  function wireSegModal() {
    var scrim = document.getElementById("nhSegScrim");
    var toggle = document.getElementById("nhTogSeg");
    var closeBtn = document.getElementById("nhSegClose");
    var cancelBtn = document.getElementById("nhSegCancelar");
    var guardarBtn = document.getElementById("nhSegGuardar");
    var reportarBtn = document.getElementById("nhSegReportar");
    var addFuBtn = document.getElementById("nhAddFu");
    var sched = document.getElementById("nhSched");

    function openModal() {
      scrim.classList.add("is-open");
      scrim.setAttribute("aria-hidden", "false");
    }
    function closeModal(revert) {
      scrim.classList.remove("is-open");
      scrim.setAttribute("aria-hidden", "true");
      if (revert) {
        toggle.setAttribute("aria-checked", "false");
        toggle.classList.remove("on");
      }
    }

    toggle.addEventListener("click", function () {
      var turningOn = toggle.getAttribute("aria-checked") !== "true";
      toggle.setAttribute("aria-checked", turningOn ? "true" : "false");
      toggle.classList.toggle("on", turningOn);
      if (turningOn) openModal();
    });
    closeBtn.addEventListener("click", function () { closeModal(true); });
    cancelBtn.addEventListener("click", function () { closeModal(true); });
    guardarBtn.addEventListener("click", function () { closeModal(false); });
    scrim.addEventListener("click", function (e) { if (e.target === scrim) closeModal(true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && scrim.classList.contains("is-open") && !openSelect) closeModal(true);
    });
    reportarBtn.addEventListener("click", function () {
      if (window.openStatusDialog) window.openStatusDialog({
        type: "info", icon: "flag", title: "Reportar un problema",
        desc: "Cuéntenos qué ocurrió al configurar el seguimiento y nuestro equipo lo revisará.",
        buttons: [{ label: "Entendido", variant: "tonal" }]
      });
    });

    /* agregar / quitar preguntas + agregar seguimiento (delegación) */
    scrim.addEventListener("click", function (e) {
      var addQ = e.target.closest(".ns-q-add");
      if (addQ) {
        var row = addQ.closest(".ns-q");
        row.insertAdjacentHTML("afterend", questionRow("", false));
        var next = row.nextElementSibling.querySelector(".ns-q-input");
        if (next) next.focus();
        return;
      }
      var rmQ = e.target.closest(".ns-q-rm");
      if (rmQ) {
        var qrow = rmQ.closest(".ns-q");
        var siblingNewRows = qrow.parentNode.querySelectorAll(".ns-q--new").length;
        if (siblingNewRows > 1) qrow.remove();
        else { var inp = qrow.querySelector(".ns-q-input"); if (inp) inp.value = ""; }
        return;
      }
      if (e.target.closest("#nhAddFu")) { addFollowup(); return; }
      var delFu = e.target.closest(".ns-fu-del");
      if (delFu) { askDeleteFu(delFu.closest(".ns-fu")); return; }
      var cancelFu = e.target.closest(".ns-fu-cancel");
      if (cancelFu) { closeDeleteConfirm(cancelFu.closest(".ns-fu")); return; }
      var confirmFu = e.target.closest(".ns-fu-confirm-del");
      if (confirmFu) {
        var fu = confirmFu.closest(".ns-fu");
        if (fu) { fu.remove(); renumber(); }
        return;
      }
    });

    function addFollowup() {
      fuCounter++;
      var html = followupBlock({ uid: fuCounter, n: 0, freq: "Días", num: 7, questions: [], deletable: true });
      addFuBtn.insertAdjacentHTML("beforebegin", html);
      var node = addFuBtn.previousElementSibling;
      Array.prototype.forEach.call(node.querySelectorAll(".ff-select"), initSelect);
      renumber();
      var inp = node.querySelector(".ns-q-input");
      if (inp) inp.focus();
    }
    function renumber() {
      var blocks = sched.querySelectorAll(".ns-fu");
      var n = 0;
      Array.prototype.forEach.call(blocks, function (b) {
        n++;
        var cierre = b.getAttribute("data-cierre") === "1";
        var title = b.querySelector(".ns-fu-title");
        title.textContent = cierre ? "Seguimiento #" + n + " (seguimiento de cierre)" : "Seguimiento #" + n;
      });
    }
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
  }

  /* ───────────────────────── footer actions ───────────────────────── */
  function wireFooter() {
    document.getElementById("nhCancelar").addEventListener("click", goBack);
    document.getElementById("nhReportar").addEventListener("click", function () {
      if (window.openStatusDialog) window.openStatusDialog({
        type: "info", icon: "flag", title: "Reportar un problema",
        desc: "Cuéntenos qué ocurrió al crear la historia y nuestro equipo lo revisará.",
        buttons: [{ label: "Entendido", variant: "tonal" }]
      });
    });
    document.getElementById("nhCrear").addEventListener("click", function () {
      if (this.disabled) return;
      if (!window.openStatusDialog) return;
      window.openStatusDialog({
        type: "success", icon: "check_circle",
        title: "¡Historia médica creada con éxito!",
        desc: "La historia del paciente fue registrada correctamente en el sistema.",
        buttons: [{
          label: "Aceptar", variant: "tonal",
          onClick: function () { location.hash = "#/informacion-paciente"; }
        }]
      });
    });
  }

  window.__renderNuevaHistoria = render;
})();
