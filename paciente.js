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
        '<span class="ip-crumb current" aria-current="page">Pacientes</span>' +
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
          '<button class="bt-text" type="button"><span class="material-symbols-outlined">add</span><span>Crear evolución</span></button>' +
          '<button class="bt-tonal" type="button"><span class="material-symbols-outlined">add</span><span>Crear historia</span></button>' +
        '</div>' +
      '</div>' +

      /* ── Paneles ── */
      '<div class="ip-panelarea">' +
        '<div class="ip-tabpanel" role="tabpanel" id="ipPanelSeg" aria-labelledby="ipTabSeg" hidden>' +
          '<div class="ip-empty">' +
            '<div class="em-ic"><span class="material-symbols-outlined">event_repeat</span></div>' +
            '<span class="em-title">Aún no hay seguimientos</span>' +
            '<span class="em-sub">Cuando programes un seguimiento para este paciente, aparecerá aquí con su estado y próxima fecha de envío.</span>' +
          '</div>' +
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

    /* back → historial del navegador */
    document.getElementById("ipBack").addEventListener("click", function () {
      if (history.length > 1) history.back();
      else location.hash = "#/historias-y-evoluciones";
    });

    /* alta médica → confirmación */
    var chk = document.getElementById("ipDischargeCheck");
    if (chk) chk.addEventListener("click", function () { openDischargeFlow(d); });

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
})();
