/* =====================================================================
   VIEW · Seguimientos  (#/seguimientos)
   Tabla de seguimientos (una fila por paciente) + tarjetas resumen +
   búsqueda + paginación. Misma lógica que la tabla de Roles y permisos.
   "Ver más" → detalle de seguimiento (aún en construcción).
   ===================================================================== */
import { SeguimientoService } from '/src/services/external/SeguimientoService.ts';

(function seguimientos() {
  "use strict";

  var AVATAR_COLORS = ["#82439B", "#C9006F", "#0A7553", "#0054D2", "#935A0B", "#4A1F60"];

  /* Datos de seguimientos: vienen de la plataforma externa (ver
     src/services/external/SeguimientoService.ts). Todavía no existe el
     contrato real, así que por ahora llega como datos de ejemplo. */
  var DATA = [];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function initials(n) { return n.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }
  function colorFor(n) { var s = 0; for (var i = 0; i < n.length; i++) s += n.charCodeAt(i); return AVATAR_COLORS[s % AVATAR_COLORS.length]; }
  var ALERT_LABEL = { alta: "Alta", media: "Media", baja: "Baja" };

  async function init() {
    var view = document.querySelector('.view[data-view="seguimientos"]');
    if (!view || view.__wired) return;
    view.__wired = true;

    DATA = (await SeguimientoService.getResumen()).map(function (d) {
      return { name: d.paciente, ult: d.ultimoSeguimiento, prox: d.proximoSeguimiento, cons: d.ultimaConsulta, alert: d.alerta, nps: d.nps };
    });

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
