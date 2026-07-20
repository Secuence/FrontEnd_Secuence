/* =====================================================================
   Evolución clínica (#/evolucion-clinica)
   ---------------------------------------------------------------------
   Formulario de evolución para un paciente YA existente (viene de
   "Información del paciente" vía "Crear evolución"): reutiliza la Card
   info patient de esa pantalla (misma buildData) en vez de pedir de
   nuevo los datos personales. Secciones sin numerar, drawer contextual +
   scroll-spy. Componentes DS: Header page · Navigation drawer (variante
   contextual) · Card info patient · Form inputs · Input select ·
   Button toggle · Slide toggle · File uploader · Progress bar.
   ===================================================================== */
(function () {
  "use strict";

  var page = document.getElementById("ecPage");
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
  function shiftDate(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.getDate() + " " + MESES[d.getMonth()] + " " + d.getFullYear();
  }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    var a = p[0] ? p[0][0] : "", b = p.length > 1 ? p[p.length - 1][0] : "";
    return (a + b).toUpperCase();
  }

  /* ───────────────────────── mock reference data (mismas listas que Nueva historia) ───────────────────────── */
  var CIE_OPTS = [
    "I10 · Hipertensión esencial (primaria)", "E11 · Diabetes mellitus tipo 2",
    "E78 · Trastornos del metabolismo de lipoproteínas", "J45 · Asma",
    "J44 · Enfermedad pulmonar obstructiva crónica", "N18 · Enfermedad renal crónica",
    "M06 · Artritis reumatoide", "K29 · Gastritis y duodenitis", "G43 · Migraña",
    "D50 · Anemia por deficiencia de hierro", "E03 · Hipotiroidismo", "Sin antecedentes registrados"
  ];
  var FAM_OPTS = ["Sin antecedentes", "Diabetes mellitus", "Hipertensión arterial", "Cáncer", "Enfermedad cardiovascular", "Enfermedad renal", "Otro"];
  var DIAG_OPTS = [
    "I10 - Hipertensión esencial", "E11 - Diabetes mellitus tipo 2", "J45 - Asma",
    "J44 - EPOC", "N18 - Enfermedad renal crónica", "M06 - Artritis reumatoide",
    "K29 - Gastritis crónica", "G43 - Migraña crónica"
  ];
  var COD_OPTS = [
    { v: "+58", t: "Venezuela (+58)" }, { v: "+57", t: "Colombia (+57)" },
    { v: "+52", t: "México (+52)" }, { v: "+51", t: "Perú (+51)" },
    { v: "+56", t: "Chile (+56)" }, { v: "+593", t: "Ecuador (+593)" }
  ];
  var FREQ_OPTS = ["Horas", "Días"];
  var DEFAULT_QS = {
    1: ["¿Pudo iniciar el tratamiento indicado?", "¿Ha sentido alguna reacción adversa o molestia nueva tras haber iniciado el tratamiento indicado?", "¿Qué intensidad tiene su molestia o síntoma principal el día de hoy?", "¿Tienes alguna duda sobre las indicaciones?"],
    2: ["¿Ha continuado con su tratamiento exactamente como se indicó?", "Comparado con el primer día, ¿cómo describiría la evolución de su síntoma principal hoy?", "¿Ha aparecido algún síntoma NUEVO que no tenía el día de la consulta?"],
    cierre: ["¿Logró terminar todo el esquema de tratamiento por los días indicados?", "En términos generales, ¿considera que el problema por el que consultó ya se resolvió?", "Según cómo se siente, ¿necesita agendar una nueva consulta de control con su médico?"]
  };

  var SECTIONS = [
    { id: "ec-sec-datos", label: "Datos del paciente", icon: "person" },
    { id: "ec-sec-diagnostico", label: "Diagnóstico", icon: "medical_information" },
    { id: "ec-sec-antecedentes", label: "Antecedentes", icon: "history" },
    { id: "ec-sec-signos", label: "Signos y síntomas (subjetivo)", icon: "chat" },
    { id: "ec-sec-examen", label: "Exámen físico (objetivo)", icon: "monitor_heart" },
    { id: "ec-sec-documentos", label: "Documentos", icon: "description" },
    { id: "ec-sec-plan", label: "Plan", icon: "checklist" },
    { id: "ec-sec-seguimiento", label: "Seguimiento", icon: "event_repeat" }
  ];

  /* ───────────────────────── field builders (idénticos a Nueva historia) ───────────────────────── */
  function field(id, label, placeholder, opts) {
    opts = opts || {};
    var req = opts.required ? ' <span class="req">*</span>' : "";
    var type = opts.type || "text";
    var suffix = opts.suffix ? '<span class="ff-suffix">' + esc(opts.suffix) + "</span>" : "";
    var icon = opts.icon ? '<span class="ff-icon material-symbols-outlined"' + (opts.iconTitle ? ' title="' + esc(opts.iconTitle) + '"' : "") + ">" + opts.icon + "</span>" : "";
    return (
      '<div class="ff" data-field="' + id + '">' +
        '<div class="ff-box">' +
          '<input class="ff-input" id="' + id + '" type="' + type + '" placeholder="' + esc(placeholder) + '" autocomplete="off"' + (opts.value ? ' value="' + esc(opts.value) + '"' : "") + '>' +
          '<label class="ff-label" for="' + id + '">' + label + req + "</label>" +
          suffix + icon +
        "</div>" +
        '<div class="ff-support" hidden></div>' +
      "</div>"
    );
  }
  function textareaField(id, label, placeholder) {
    return (
      '<div class="ff" data-field="' + id + '">' +
        '<div class="ff-box" style="height:auto; min-height:88px; align-items:flex-start; padding-top:20px; padding-bottom:12px;">' +
          '<textarea class="ff-input" id="' + id + '" rows="3" placeholder="' + esc(placeholder) + '" style="resize:vertical; min-height:56px;"></textarea>' +
          '<label class="ff-label" for="' + id + '">' + label + "</label>" +
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

  /* ───────────────────────── main render ───────────────────────── */
  function render() {
    var p = window.__selectedPaciente || { name: "Paciente", date: "—", base: "Hipertensión arterial" };
    var d = window.__selectedPacienteData ||
      (typeof window.__buildPacienteData === "function" ? window.__buildPacienteData(p) : {});
    var codigoDefault = "Venezuela (+57)"; // valor por defecto tal como en la referencia visual

    /* seguimientos existentes del paciente (mock determinista; vacío → empty state) */
    var seguimientos = [
      ["30 días", shiftDate(-30)],
      ["45 días", shiftDate(-45)],
      ["60 días", shiftDate(-60)]
    ];

    page.innerHTML =
      '<div class="nh-page">' +
        /* ── Navigation drawer (contextual) ── */
        '<aside class="nh-nav" id="ecNav">' +
          '<div class="nh-nav-logo">' +
            '<a class="nh-nav-logo-link" id="ecNavLogoLink" href="#/indicadores" aria-label="Ir a Indicadores">' +
              '<img class="full" src="assets/logo-primary.svg" alt="Secuence">' +
              '<img class="iso" src="assets/secuence_favicon.svg" alt="Secuence">' +
            '</a>' +
            '<button class="nh-nav-collapse-btn" id="ecNavCollapseBtn" type="button" aria-label="Contraer/expandir menú"><span class="material-symbols-outlined">left_panel_close</span></button>' +
          "</div>" +
          '<div class="nh-nav-context">Información del paciente</div>' +
          '<nav class="nh-nav-list" id="ecNavList">' +
            SECTIONS.map(function (s, i) {
              return '<button type="button" class="nh-nav-item' + (i === 0 ? " sel" : "") + '" data-target="' + s.id + '" data-tooltip="' + esc(s.label) + '"><span class="material-symbols-outlined nh-nav-ic">' + s.icon + '</span><span class="nh-nav-txt">' + esc(s.label) + "</span></button>";
            }).join("") +
          "</nav>" +
        "</aside>" +

        '<div class="nh-main">' +
          '<div class="nh-scroll" id="ecScroll">' +
            '<div class="nh-content">' +

              /* ── Header page ── */
              '<div class="nh-header">' +
                '<div class="nh-header-left">' +
                  '<button class="nh-back" id="ecBack" type="button" aria-label="Volver"><span class="material-symbols-outlined">arrow_back</span></button>' +
                  '<h1 class="nh-title">Evolución clínica</h1>' +
                "</div>" +
                '<div class="nh-date"><span class="nh-date-lbl">Fecha</span><span class="nh-date-val">' + todayFmt() + "</span></div>" +
              "</div>" +

              /* ── Breadcrumb (origen → Evolución clínica) ── */
              '<nav class="ip-crumbs" aria-label="Ruta de navegación">' +
                '<a class="ip-crumb" id="ecCrumbSrc" href="#">' + esc(originLabel()) + '</a>' +
                '<span class="ip-sep toward-current">/</span>' +
                '<span class="ip-crumb current" aria-current="page">Evolución clínica</span>' +
              "</nav>" +

              /* ── Datos del paciente ── */
              '<section class="nh-section" id="ec-sec-datos">' +
                '<div class="nh-section-head">' +
                  '<h2 class="nh-section-title">Datos del paciente</h2>' +
                  '<p class="nh-section-sub">A partir de esta información el sistema podrá generar reportes acerca de la evolución del paciente.</p>' +
                "</div>" +

                /* Card info patient (reutiliza .ip-card, sólo lectura) */
                '<div class="ip-card ec-card">' +
                  '<div class="ip-pc-head">' +
                    '<div class="ip-who"><div class="ip-av">' + esc(initials(p.name)) + '</div>' +
                      '<span class="ip-pname">' + esc(p.name) + '</span></div>' +
                    '<span class="ip-chip ' + (d.alerta ? d.alerta.cls : "") + '"><span class="material-symbols-outlined">open_in_new</span>Última alerta: ' + esc(d.alerta ? d.alerta.txt : "Media") + '</span>' +
                  "</div>" +
                  '<div class="ip-panel">' +
                    '<div class="ip-col">' +
                      ipRow("Documento/DNI:", d.documento) + ipRow("Edad:", d.edad) +
                      ipRow("Grupo sanguíneo:", d.sangre) + ipRow("Teléfono:", d.telefono) +
                      ipSrow("NPS:", d.nps) +
                    "</div>" +
                    '<div class="ip-col">' +
                      ipRow("Fecha de nacimiento:", d.nacimiento) + ipRow("Género:", d.genero) +
                      ipRow("Última consulta:", d.ultimaConsulta) + ipRow("Correo:", d.correo) +
                      ipSrow("Alergias:", d.alergias) +
                    "</div>" +
                  "</div>" +
                  '<div class="ip-extra">' +
                    '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">Contactos de emergencia:</span>' +
                      '<button class="ip-ed" type="button" aria-label="Editar contactos de emergencia"><span class="material-symbols-outlined">edit</span></button></div>' +
                      '<span class="ip-sval bullet">' + esc(d.contactoNombre) + ": " + esc(d.contactoTel) + "</span>" +
                    "</div>" +
                    '<div class="ip-row" style="min-height:auto; align-items:flex-start;">' +
                      '<div class="ip-rl" style="align-items:flex-start;"><span class="ip-lbl">Dirección:</span>' +
                      '<span class="ip-val" style="white-space:normal;">' + esc(d.direccion) + "</span></div>" +
                      '<button class="ip-ed" type="button" aria-label="Editar dirección"><span class="material-symbols-outlined">edit</span></button>' +
                    "</div>" +
                  "</div>" +
                  '<div class="ip-alta">' +
                    '<div class="ip-rl"><span class="ip-lbl">Última alta médica:</span>' +
                    '<span class="ip-val">' + esc(d.altaFecha) + " – " + esc(d.altaEsp) + "</span></div>" +
                    '<button class="ip-ed plain" type="button" aria-label="Abrir alta médica"><span class="material-symbols-outlined">open_in_new</span></button>' +
                  "</div>" +
                "</div>" +

                /* Canales de seguimiento */
                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">Canales de seguimiento</h3>' +
                  '<p class="nh-section-sub">Esta información de contacto es obligatoria ya que a través de estos canales el paciente recibirá el seguimiento pautado.</p>' +
                "</div>" +
                '<div class="ec-grid-canales">' +
                  field("ecCorreo", "Correo", "correo@correo.com", { required: true, value: d.correo }) +
                  '<div class="ec-grid-tel">' +
                    selectField("ecCodigo", "Código", COD_OPTS, codigoDefault) +
                    field("ecTelefono", "Teléfono", "Escriba teléfono", { required: true, value: (d.telefono || "").replace(/^\+\d+\s*/, "") }) +
                  "</div>" +
                "</div>" +
              "</section>" +

              /* ── Diagnóstico ── */
              '<section class="nh-section" id="ec-sec-diagnostico">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Diagnóstico</h2></div>' +
                '<div class="nh-fields">' + selectField("ecDiagnostico", "Diagnóstico", DIAG_OPTS, "Nombre de diagnóstico, Nombre de diagnóstico, Nombre de diagnóstico, Nombre de diagnóstico,") + "</div>" +
              "</section>" +

              /* ── Antecedentes ── */
              '<section class="nh-section" id="ec-sec-antecedentes">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Antecedentes personales patológicos - CIE</h2></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="ecTogPato" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes patológicos - CIE (desactive esta opción para indicar que paciente no refiere ningún antecedente patológico personal de la categoría CIE).</span>' +
                "</div>" +
                '<div class="nh-fields" id="ecPatoFields">' +
                  cieField("ecCieCronicas", "Enfermedades crónicas (CIE)", "Escriba enfermedades crónicas") +
                  cieField("ecCieHosp", "Hospitalizaciones previas (CIE)", "Escriba hospitalizaciones previas") +
                  cieField("ecCieAlergias", "Alergias (CIE)", "Escriba alergias") +
                  cieField("ecCieTraumas", "Traumatismos (CIE)", "EscribEscriba traumatismosa hospitalizaciones previas") +
                  cieField("ecCieQuir", "Quirúrgicos (CIE)", "Escriba antecedentes quirúrgicos") +
                  cieField("ecCieOtros", "Otros (CIE)", "Escriba otros antecedentes") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">Antecedentes personales NO patológicos - Hábitos</h3></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="ecTogHabitos" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes patológicos (desactive esta opción para indicar que paciente no refiere ningún antecedente patológico personal).</span>' +
                "</div>" +
                '<div class="nh-fields" id="ecHabitosFields">' +
                  '<div class="nh-grid-2">' +
                    '<div class="nh-labeled"><span class="nh-label">Tabaquismo</span>' + segToggle("ec-tabaquismo", ["Si", "No"], -1) + "</div>" +
                    '<div class="nh-labeled"><span class="nh-label">Alcohol</span>' + segToggle("ec-alcohol", ["Si", "No"], -1) + "</div>" +
                  "</div>" +
                  field("ecIpa", "IPA", "Especifique IPA") +
                  field("ecAlcoholCant", "Cantidad de alcohol semanal", "Especifique cantidad") +
                  field("ecActividad", "Actividad física", "Especifique actividad física") +
                  field("ecAlimentacion", "Alimentación", "Especifique alimentación") +
                  field("ecInmunizacion", "Inmunización", "Especifique inmunización") +
                  field("ecHabitosOtros", "Otros", "Especifique otros") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">Antecedentes familiares - CIE</h3></div>' +
                '<div class="nh-toggle-row">' +
                  '<button type="button" class="nh-track on" id="ecTogFamiliares" role="switch" aria-checked="true"></button>' +
                  '<span class="nh-toggle-tx">Paciente refiere antecedentes familiares (desactive esta opción para indicar que paciente no refiere ningún antecedente familiar).</span>' +
                "</div>" +
                '<div class="nh-fields" id="ecFamiliaresFields">' +
                  selectField("ecFamPadres", "Padres", FAM_OPTS, "") +
                  selectField("ecFamAbuelos", "Abuelos", FAM_OPTS, "") +
                  selectField("ecFamHermanos", "Hermanos", FAM_OPTS, "") +
                  selectField("ecFamOtros", "Otros", FAM_OPTS, "") +
                "</div>" +

                '<div class="nh-section-head"><h3 class="nh-section-title nh-sub">Antecedentes ginecobstretricos</h3></div>' +
                '<div class="nh-fields">' +
                  '<div class="nh-gineco-row">' +
                    field("ecMenarquia", "Menarquia", "Especifique menarquia") +
                    field("ecCicloMenstrual", "Ciclo menstrual", "Especifique ciclo menstrual") +
                    '<div class="nh-labeled"><span class="nh-label">&nbsp;</span>' + segToggle("ec-ciclo-tipo", ["Dismenorrea", "Eumenorrea"], -1) + "</div>" +
                  "</div>" +
                  '<div class="nh-section-head"><h4 class="nh-section-title nh-sub" style="font-size:16px;">Obstetricia</h4></div>' +
                  '<div class="nh-grid-4">' +
                    field("ecGestas", "Gestas", "Especifique gestas") + field("ecParas", "Paras", "Especifique paras") +
                    field("ecAbortos", "Abortos", "Especifique abortos") + field("ecCesarea", "Cesárea", "Especifique cesárea") +
                  "</div>" +
                  '<div class="nh-grid-4">' +
                    field("ecFur", "FUR", "Especifique FUR", { icon: "calendar_month" }) +
                    field("ecAnticonceptivo", "Anticonceptivo", "Especifique anticonceptivo") +
                    field("ecIts", "ITS", "Especifique ITS", { icon: "info", iconTitle: "Infecciones de transmisión sexual" }) +
                    field("ecCitologia", "Citología", "Especifique citología") +
                  "</div>" +
                  field("ecMamografia", "Mamografía", "Especifique mamografía") +
                "</div>" +
              "</section>" +

              /* ── Signos y síntomas (subjetivo) ── */
              '<section class="nh-section" id="ec-sec-signos">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Signos y síntomas (subjetivo)</h2></div>' +
                '<div class="nh-fields">' + selectField("ecSignos", "Diagnóstico", DIAG_OPTS, "Nombre de diagnóstico, Nombre de diagnóstico, Nombre de diagnóstico, Nombre de diagnóstico,") + "</div>" +
              "</section>" +

              /* ── Exámen físico (objetivo) ── */
              '<section class="nh-section" id="ec-sec-examen">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Exámen físico (objetivo)</h2></div>' +
                '<div class="nh-fields">' +
                  '<div class="nh-grid-4">' +
                    vitalField("ecPas", "PAS", "Especifique PAS", "mmHg", "Presión arterial sistólica") +
                    vitalField("ecPad", "PAD", "Especifique PAD", "mmHg", "Presión arterial diastólica") +
                    vitalField("ecPam", "PAM", "Especifique PAM", "mmHg", "Presión arterial media") +
                    vitalField("ecFc", "FC", "Especifique FC", "LPM", "Frecuencia cardíaca") +
                  "</div>" +
                  '<div class="nh-grid-4">' +
                    vitalField("ecFr", "FR", "Especifique FR", "RPM", "Frecuencia respiratoria") +
                    vitalField("ecSpo2", "SpO2", "Especifique SpO2", "%", "Saturación de oxígeno") +
                    vitalField("ecPeso", "Peso", "Especifique Peso", "Kg", "Peso corporal") +
                    vitalField("ecTalla", "Talla", "Especifique talla", "cm", "Estatura") +
                  "</div>" +
                  field("ecImc", "IMC", "Especifique IMC", { suffix: "Peso/Talla²", icon: "info", iconTitle: "Índice de masa corporal" }) +
                  textareaField("ecExFisico", "Examen", "Describa examen físico") +
                "</div>" +
              "</section>" +

              /* ── Documentos ── */
              '<section class="nh-section" id="ec-sec-documentos">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Órdenes y/o estudios médicos previos</h2></div>' +
                '<div class="nh-uploader">' +
                  '<div class="nu-drop" id="ecDrop" role="button" tabindex="0">' +
                    '<span class="material-symbols-outlined">cloud_upload</span>' +
                    '<span class="nu-cta">Haga click para subir archivos <span class="nu-cta-plain">o arrastre archivos aquí</span></span>' +
                    '<span class="nu-support">Sólo archivos PDF, JPG o JPEG (máximo 10MB)</span>' +
                  "</div>" +
                  '<input id="ecFileInput" type="file" accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg" multiple hidden>' +
                  '<div class="nu-files" id="ecFiles"></div>' +
                "</div>" +
              "</section>" +

              /* ── Plan ── */
              '<section class="nh-section" id="ec-sec-plan">' +
                '<div class="nh-section-head"><h2 class="nh-section-title">Plan</h2></div>' +
                '<div class="nh-fields">' + textareaField("ecPlan", "Plan", "Describa plan médico") + "</div>" +
              "</section>" +

              /* ── Seguimiento ── */
              '<section class="nh-section" id="ec-sec-seguimiento">' +
                '<div class="nh-section-head">' +
                  '<h2 class="nh-section-title">Seguimientos del paciente</h2>' +
                  '<p class="nh-section-sub">Define el horario de cada mensaje de seguimiento que recibirá el paciente.</p>' +
                "</div>" +
                (seguimientos.length
                  ? (
                    '<div class="sd-proximos-row">' +
                      '<div class="sd-fu-cards">' +
                        seguimientos.map(function (s) {
                          return '<div class="sd-fu-card" data-fu-card role="button" tabindex="0">' +
                            '<span class="sd-fu-lead"><span class="material-symbols-outlined">open_in_new</span></span>' +
                            '<div class="sd-fu-body"><span class="title">Seguimiento</span>' +
                            '<span class="value">' + esc(s[0]) + " – " + esc(s[1]) + "</span></div></div>";
                        }).join("") +
                      "</div>" +
                      '<button class="sd-tonal" type="button" id="ecEditarSeguimientos"><span class="material-symbols-outlined">edit</span>Editar seguimientos</button>' +
                    "</div>" +
                    '<div class="nh-avail">' +
                      '<span class="pg-label">Seguimientos disponibles: 50/100</span>' +
                      '<div class="pg-track"><div class="pg-fill" style="width:50%"></div></div>' +
                    "</div>"
                  ) : (
                    '<div class="ec-seg-empty">' +
                      '<div class="em-ic"><span class="material-symbols-outlined">event_repeat</span></div>' +
                      '<span class="em-title">Aún no hay seguimientos</span>' +
                      '<span class="em-sub">Cuando programes un seguimiento para este paciente, aparecerá aquí con su estado y próxima fecha de envío.</span>' +
                      '<button class="sd-tonal" type="button" id="ecEditarSeguimientos"><span class="material-symbols-outlined">add</span>Crear seguimiento</button>' +
                    "</div>"
                  )
                ) +
              "</section>" +

            "</div>" +
          "</div>" +

          /* ── Footer ── */
          '<div class="nh-footer">' +
            '<button class="nu-link" type="button" id="ecReportar">Reportar problema</button>' +
            '<div class="nu-actions">' +
              '<button class="nu-link" type="button" id="ecCancelar">Cancelar</button>' +
              '<button class="btn btn-filled" type="button" id="ecCrear" disabled>Crear evolución</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";

    wireBack();
    wireNav();
    wireNavCollapse();
    wireNavTooltips("ecNav");
    wireLogoLink();
    wireSegToggles();
    wireSectionToggles();
    wireSelects();
    wireCie();
    wireUploader();
    wireValidation();
    wireSeguimientoModal(p);
    wireFooter();
  }

  function ipRow(label, value) {
    return '<div class="ip-row"><div class="ip-rl"><span class="ip-lbl">' + label + '</span><span class="ip-val">' + esc(value) + "</span></div>" +
      '<button class="ip-ed" type="button" aria-label="Editar ' + esc(label.replace(":", "")) + '"><span class="material-symbols-outlined">edit</span></button></div>';
  }
  function ipSrow(label, value) {
    return '<div class="ip-srow"><div class="ip-stitle"><span class="ip-lbl">' + label + '</span>' +
      '<button class="ip-ed" type="button" aria-label="Editar ' + esc(label.replace(":", "")) + '"><span class="material-symbols-outlined">' + (label === "NPS:" ? "info" : "edit") + '</span></button></div>' +
      '<span class="ip-sval">' + esc(value) + "</span></div>";
  }

  /* ───────────────────────── back / cancel — siempre a Información del paciente ───────────────────────── */
  function originTarget() {
    var origin = window.__evolucionClinicaOrigin;
    if (origin === "seguimiento-detalle") return "#/seguimiento-detalle";
    return "#/informacion-paciente";
  }
  function originLabel() {
    var origin = window.__evolucionClinicaOrigin;
    if (origin === "seguimiento-detalle") return "Detalle de seguimiento";
    return "Información del paciente";
  }
  function goBack() { location.hash = originTarget(); }
  function wireBack() {
    document.getElementById("ecBack").addEventListener("click", goBack);
    var crumb = document.getElementById("ecCrumbSrc");
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
    var nav = document.getElementById("ecNav");
    var btn = document.getElementById("ecNavCollapseBtn");
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
    if (page.querySelector(".nu-file")) return true;
    return false;
  }
  function wireLogoLink() {
    var link = document.getElementById("ecNavLogoLink");
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!hasUnsavedChanges()) { location.hash = "#/indicadores"; return; }
      if (!window.openStatusDialog) { location.hash = "#/indicadores"; return; }
      window.openStatusDialog({
        type: "warning", icon: "warning",
        title: "¿Salir sin guardar?",
        desc: "Tienes información sin guardar en esta evolución. Si continúas, perderás los cambios realizados.",
        buttons: [
          { label: "Cancelar", variant: "text" },
          { label: "Salir sin guardar", variant: "tonal", onClick: function () { location.hash = "#/indicadores"; } }
        ]
      });
    });
  }

  /* ───────────────────────── contextual nav + scroll-spy ───────────────────────── */
  function wireNav() {
    var scroll = document.getElementById("ecScroll");
    var items = Array.prototype.slice.call(document.querySelectorAll("#ecNavList .nh-nav-item"));
    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (!target) return;
        scroll.scrollTo({ top: target.offsetTop - 16, behavior: "smooth" });
      });
    });
    var sections = Array.prototype.slice.call(page.querySelectorAll(".nh-section"));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        items.forEach(function (b) { b.classList.toggle("sel", b.getAttribute("data-target") === id); });
      });
    }, { root: scroll, rootMargin: "-15% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  function wireSegToggles() {
    Array.prototype.forEach.call(page.querySelectorAll(".nh-seg"), function (seg) {
      seg.addEventListener("click", function (e) {
        var btn = e.target.closest(".nh-seg-btn");
        if (!btn) return;
        Array.prototype.forEach.call(seg.querySelectorAll(".nh-seg-btn"), function (b) { b.classList.remove("sel"); });
        btn.classList.add("sel");
      });
    });
  }

  function wireSectionToggles() {
    [["ecTogPato", "ecPatoFields"], ["ecTogHabitos", "ecHabitosFields"], ["ecTogFamiliares", "ecFamiliaresFields"]].forEach(function (pair) {
      var tog = document.getElementById(pair[0]), fields = document.getElementById(pair[1]);
      tog.addEventListener("click", function () {
        var on = tog.getAttribute("aria-checked") !== "true";
        tog.setAttribute("aria-checked", on ? "true" : "false");
        tog.classList.toggle("on", on);
        fields.style.opacity = on ? "1" : "0.5";
        fields.style.pointerEvents = on ? "" : "none";
      });
    });
  }

  var openSelect = null;
  function wireSelects() {
    Array.prototype.forEach.call(page.querySelectorAll(".ff-select"), initSelect);
    document.addEventListener("click", function () { if (openSelect && openSelect._close) openSelect._close(); });
  }
  function initSelect(sel) {
    var box = sel.querySelector(".ff-box"), val = sel.querySelector(".ff-value"), icon = sel.querySelector(".ff-icon");
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
      });
    });
    sel._close = close;
  }

  function wireCie() {
    Array.prototype.forEach.call(page.querySelectorAll(".nh-ac"), function (wrap) {
      var input = wrap.querySelector("input"), menu = wrap.querySelector(".nh-ac-menu");
      function renderMenu() {
        var q = input.value.trim().toLowerCase();
        var matches = q ? CIE_OPTS.filter(function (o) { return o.toLowerCase().indexOf(q) !== -1; }) : CIE_OPTS.slice(0, 6);
        if (!matches.length) {
          menu.innerHTML = '<div class="nh-ac-empty">Sin resultados para «' + esc(input.value) + '»</div>';
        } else {
          menu.innerHTML = matches.map(function (m) { return '<div class="menu-item" role="option">' + esc(m) + "</div>"; }).join("");
          Array.prototype.forEach.call(menu.querySelectorAll(".menu-item"), function (mi) {
            mi.addEventListener("mousedown", function (e) { e.preventDefault(); input.value = mi.textContent; wrap.classList.remove("is-open"); });
          });
        }
      }
      input.addEventListener("focus", function () { renderMenu(); wrap.classList.add("is-open"); });
      input.addEventListener("input", function () { renderMenu(); wrap.classList.add("is-open"); });
      input.addEventListener("blur", function () { setTimeout(function () { wrap.classList.remove("is-open"); }, 120); });
    });
  }

  function wireUploader() {
    var drop = document.getElementById("ecDrop"), fileI = document.getElementById("ecFileInput"), list = document.getElementById("ecFiles");
    var files = [];
    function fmtSize(b) { return b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB"; }
    function addMock() { files.push({ name: "examen_sangre.pdf", size: 234567 }); files.push({ name: "radiografia_torax.jpg", size: 1240000 }); renderList(); }
    function renderList() {
      list.innerHTML = files.map(function (f, i) {
        var ext = (f.name.split(".").pop() || "").toLowerCase();
        var cls = ext === "pdf" ? "pdf" : "jpg", ic = ext === "pdf" ? "picture_as_pdf" : "image";
        return '<div class="nu-file"><div class="thumb ' + cls + '"><span class="material-symbols-outlined">' + ic + '</span></div>' +
          '<div class="meta"><div class="name">' + esc(f.name) + '</div><div class="size">' + fmtSize(f.size) + '</div></div>' +
          '<button class="rm" type="button" data-i="' + i + '" aria-label="Quitar archivo"><span class="material-symbols-outlined">close</span></button></div>';
      }).join("");
      Array.prototype.forEach.call(list.querySelectorAll(".rm"), function (b) { b.addEventListener("click", function () { files.splice(+b.getAttribute("data-i"), 1); renderList(); }); });
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

  /* ───────────────────────── validación: sólo Correo y Teléfono ───────────────────────── */
  var REQUIRED_IDS = ["ecCorreo", "ecTelefono"];
  function checkRequired() {
    var ok = REQUIRED_IDS.every(function (id) { var el = document.getElementById(id); return el && el.value.trim() !== ""; });
    var btn = document.getElementById("ecCrear");
    if (btn) btn.disabled = !ok;
  }
  function wireValidation() {
    REQUIRED_IDS.forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("input", checkRequired); });
    checkRequired();
  }

  /* ───────────────────────── modal compartido · Próximos seguimientos ─────────────────────────
     Mismo modal que "Detalle de seguimiento" (proximos-seguimiento.js /
     window.openProximosDialog). Se abre al pulsar una card de la sección
     "Seguimientos del paciente" o el botón "Editar seguimientos" / "Crear
     seguimiento". ───────────────────────────────────────────────────── */
  function wireSeguimientoModal(p) {
    function open() {
      if (window.openProximosDialog) window.openProximosDialog({ name: p.name });
    }
    Array.prototype.forEach.call(page.querySelectorAll("[data-fu-card]"), function (card) {
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    var editBtn = document.getElementById("ecEditarSeguimientos");
    if (editBtn) editBtn.addEventListener("click", open);
  }

  /* ───────────────────────── footer actions ───────────────────────── */
  function wireFooter() {
    document.getElementById("ecCancelar").addEventListener("click", goBack);
    document.getElementById("ecReportar").addEventListener("click", function () {
      if (window.openStatusDialog) window.openStatusDialog({
        type: "info", icon: "flag", title: "Reportar un problema",
        desc: "Cuéntenos qué ocurrió al crear la evolución y nuestro equipo lo revisará.",
        buttons: [{ label: "Entendido", variant: "tonal" }]
      });
    });
    document.getElementById("ecCrear").addEventListener("click", function () {
      if (this.disabled) return;
      if (!window.openStatusDialog) return;
      window.openStatusDialog({
        type: "success", icon: "check_circle",
        title: "¡Evolución clínica creada con éxito!",
        desc: "La evolución del paciente fue registrada correctamente en el sistema.",
        buttons: [{ label: "Aceptar", variant: "tonal", onClick: function () { location.hash = "#/informacion-paciente"; } }]
      });
    });
  }

  window.__renderEvolucionClinica = render;
})();
