/* =====================================================================
   VIEW · Seguimientos  (#/seguimientos)
   Tabla de seguimientos (una fila por paciente) + tarjetas resumen +
   búsqueda + paginación. Misma lógica que la tabla de Roles y permisos.
   "Ver más" → detalle de seguimiento (aún en construcción).
   ===================================================================== */
(function seguimientos() {
  "use strict";

  var AVATAR_COLORS = ["#82439B", "#C9006F", "#0A7553", "#0054D2", "#935A0B", "#4A1F60"];

  /* Datos de ejemplo (es-CO). La secuencia de alertas de las 10 primeras
     filas reproduce la del documento de referencia. */
  var DATA = [
    { name: "María Fernanda Gómez",   ult: "12 may. 2026", prox: "19 may. 2026", cons: "05 may. 2026", alert: "alta",  nps: 72 },
    { name: "Carlos Andrés Beltrán",  ult: "11 may. 2026", prox: "18 may. 2026", cons: "04 may. 2026", alert: "media", nps: 64 },
    { name: "Valentina Ríos Mejía",   ult: "10 may. 2026", prox: "17 may. 2026", cons: "03 may. 2026", alert: "media", nps: 80 },
    { name: "Jorge Esteban Niño",     ult: "09 may. 2026", prox: "16 may. 2026", cons: "02 may. 2026", alert: "baja",  nps: 91 },
    { name: "Lucía Naranjo Soto",     ult: "08 may. 2026", prox: "15 may. 2026", cons: "01 may. 2026", alert: "baja",  nps: 88 },
    { name: "Tomás Quiroga Páez",     ult: "07 may. 2026", prox: "14 may. 2026", cons: "30 abr. 2026", alert: "baja",  nps: 85 },
    { name: "Daniela Ospina Vargas",  ult: "06 may. 2026", prox: "13 may. 2026", cons: "29 abr. 2026", alert: "media", nps: 69 },
    { name: "Mateo Salazar Cano",     ult: "05 may. 2026", prox: "12 may. 2026", cons: "28 abr. 2026", alert: "baja",  nps: 90 },
    { name: "Camila Rojas Duarte",    ult: "04 may. 2026", prox: "11 may. 2026", cons: "27 abr. 2026", alert: "alta",  nps: 58 },
    { name: "Andrés Felipe Mora",     ult: "03 may. 2026", prox: "10 may. 2026", cons: "26 abr. 2026", alert: "baja",  nps: 93 },
    { name: "Paula Restrepo Lara",    ult: "02 may. 2026", prox: "09 may. 2026", cons: "25 abr. 2026", alert: "media", nps: 66 },
    { name: "Santiago Cárdenas Ruiz", ult: "01 may. 2026", prox: "08 may. 2026", cons: "24 abr. 2026", alert: "baja",  nps: 87 },
    { name: "Isabella Torres León",   ult: "30 abr. 2026", prox: "07 may. 2026", cons: "23 abr. 2026", alert: "alta",  nps: 61 },
    { name: "Sebastián Pérez Díaz",   ult: "29 abr. 2026", prox: "06 may. 2026", cons: "22 abr. 2026", alert: "baja",  nps: 89 },
    { name: "Mariana Castro Gil",     ult: "28 abr. 2026", prox: "05 may. 2026", cons: "21 abr. 2026", alert: "media", nps: 74 },
    { name: "Nicolás Herrera Pino",   ult: "27 abr. 2026", prox: "04 may. 2026", cons: "20 abr. 2026", alert: "baja",  nps: 92 },
    { name: "Sara Gutiérrez Vélez",   ult: "26 abr. 2026", prox: "03 may. 2026", cons: "19 abr. 2026", alert: "baja",  nps: 86 },
    { name: "Emilio Vargas Acosta",   ult: "25 abr. 2026", prox: "02 may. 2026", cons: "18 abr. 2026", alert: "alta",  nps: 60 },
    { name: "Antonia Mejía Cuervo",   ult: "24 abr. 2026", prox: "01 may. 2026", cons: "17 abr. 2026", alert: "media", nps: 70 },
    { name: "Felipe Arango Suárez",   ult: "23 abr. 2026", prox: "30 abr. 2026", cons: "16 abr. 2026", alert: "baja",  nps: 94 },
    { name: "Gabriela Pardo Nieto",   ult: "22 abr. 2026", prox: "29 abr. 2026", cons: "15 abr. 2026", alert: "baja",  nps: 84 },
    { name: "Juan David Lozano",      ult: "21 abr. 2026", prox: "28 abr. 2026", cons: "14 abr. 2026", alert: "media", nps: 67 },
    { name: "Valeria Ramírez Cano",   ult: "20 abr. 2026", prox: "27 abr. 2026", cons: "13 abr. 2026", alert: "baja",  nps: 90 },
    { name: "Esteban Molina Rey",     ult: "19 abr. 2026", prox: "26 abr. 2026", cons: "12 abr. 2026", alert: "alta",  nps: 59 }
  ];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function initials(n) { return n.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }
  function colorFor(n) { var s = 0; for (var i = 0; i < n.length; i++) s += n.charCodeAt(i); return AVATAR_COLORS[s % AVATAR_COLORS.length]; }
  var ALERT_LABEL = { alta: "Alta", media: "Media", baja: "Baja" };

  function init() {
    var view = document.querySelector('.view[data-view="seguimientos"]');
    if (!view || view.__wired) return;
    view.__wired = true;

    var rowsHost = document.getElementById("segRows");
    var emptyEl  = document.getElementById("segEmpty");
    var rangeEl  = document.getElementById("segRange");

    var pageSize = 10;
    var page = 1;
    var filtered = DATA.slice();

    /* ── Tarjetas resumen ── */
    (function stats() {
      var counts = { alta: 0, media: 0, baja: 0 };
      DATA.forEach(function (d) { counts[d.alert]++; });
      var total = DATA.length;
      document.getElementById("segDistAlta").textContent  = counts.alta;
      document.getElementById("segDistMedia").textContent = counts.media;
      document.getElementById("segDistBaja").textContent  = counts.baja;
      document.getElementById("segBarAlta").style.flex  = counts.alta;
      document.getElementById("segBarMedia").style.flex = counts.media;
      document.getElementById("segBarBaja").style.flex  = counts.baja;
    })();

    /* ── Tabla ── */
    function rowMarkup(d) {
      return '' +
        '<div class="seg-grid seg-row t-row" role="row" tabindex="0" data-name="' + esc(d.name) + '">' +
          '<div class="seg-cell-name">' +
            '<span class="seg-avatar" style="background:' + colorFor(d.name) + '" aria-hidden="true">' + esc(initials(d.name)) + '</span>' +
            '<span class="nm">' + esc(d.name) + '</span>' +
          '</div>' +
          '<div class="seg-cell-num">' + esc(d.ult) + '</div>' +
          '<div class="seg-cell-num">' + esc(d.prox) + '</div>' +
          '<div class="seg-cell-num">' + esc(d.cons) + '</div>' +
          '<div class="seg-cell-alert"><span class="seg-chip ' + d.alert + '">' + ALERT_LABEL[d.alert] + '</span></div>' +
          '<div class="seg-cell-num">' + d.nps + '</div>' +
          '<div class="seg-cell-act"><button class="seg-vermas" type="button">Ver más</button></div>' +
        '</div>';
    }

    function pageSlice() {
      var start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }

    function renderRows() {
      var list = pageSlice();
      rowsHost.innerHTML = list.map(rowMarkup).join("");
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
      document.getElementById("segFirst").disabled = atFirst;
      document.getElementById("segPrev").disabled  = atFirst;
      document.getElementById("segNext").disabled  = atLast;
      document.getElementById("segLast").disabled  = atLast;
    }

    function render() { renderRows(); renderFooter(); }

    function goTo(p) {
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(Math.max(1, p), totalPages);
      render();
    }

    /* "Ver más" / fila → detalle de seguimiento (pasa el paciente seleccionado) */
    function openDetail(name) {
      var d = DATA.filter(function (x) { return x.name === name; })[0];
      if (d) window.__selectedSeguimiento = {
        name: d.name, ult: d.ult, prox: d.prox, cons: d.cons,
        alert: d.alert, nps: d.nps, source: "seguimientos"
      };
      location.hash = "#/seguimiento-detalle";
    }
    rowsHost.addEventListener("click", function (e) {
      var row = e.target.closest(".seg-row");
      if (row) openDetail(row.getAttribute("data-name"));
    });
    rowsHost.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target.closest(".seg-row");
      if (row) { e.preventDefault(); openDetail(row.getAttribute("data-name")); }
    });

    /* paginación */
    document.getElementById("segFirst").addEventListener("click", function () { goTo(1); });
    document.getElementById("segPrev").addEventListener("click",  function () { goTo(page - 1); });
    document.getElementById("segNext").addEventListener("click",  function () { goTo(page + 1); });
    document.getElementById("segLast").addEventListener("click",  function () { goTo(Math.ceil(filtered.length / pageSize)); });

    /* page-size select */
    var ps = document.getElementById("segPageSize");
    if (ps) {
      var psBtn = ps.querySelector(".ps-select");
      var psValue = document.getElementById("segPageSizeValue");
      var psMenu = document.getElementById("segPageSizeMenu");
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
          ps.classList.remove("is-open");
          psBtn.setAttribute("aria-expanded", "false");
          page = 1; render();
        });
      });
      document.addEventListener("click", function () { ps.classList.remove("is-open"); psBtn.setAttribute("aria-expanded", "false"); });
    }

    /* búsqueda (nombre del paciente) */
    var sWrap  = document.getElementById("segSearch");
    var sInput = document.getElementById("segSearchInput");
    var sTrail = document.getElementById("segSearchTrail");
    function applyFilter() {
      var q = sInput.value.trim().toLowerCase();
      sTrail.querySelector(".material-symbols-outlined").textContent = q ? "close" : "search";
      filtered = !q ? DATA.slice() : DATA.filter(function (d) { return d.name.toLowerCase().indexOf(q) !== -1; });
      page = 1; render();
    }
    sInput.addEventListener("input", applyFilter);
    sInput.addEventListener("focus", function () { sWrap.classList.add("is-focused"); });
    sInput.addEventListener("blur",  function () { sWrap.classList.remove("is-focused"); });
    sTrail.addEventListener("click", function () { if (sInput.value) { sInput.value = ""; applyFilter(); } sInput.focus(); });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
