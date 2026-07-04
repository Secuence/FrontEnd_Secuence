/* =====================================================================
   VIEW · Alertas  (#/alertas)
   Lista de alertas prioritarias generadas a partir del seguimiento de los
   pacientes. Métricas calculadas en vivo a partir de los datos (distribución
   por severidad, tratamientos iniciados, estudios realizados). Búsqueda por
   nombre + paginación. Al pulsar una alerta se abre "Detalle de seguimiento"
   con el origen "alertas" (breadcrumb: Alertas / Detalle de seguimiento).
   Componentes DS: stat cards · Progress bar · Alert (info) · List patient
   alert (4 severidades) · Chips · footer de paginación.
   ===================================================================== */
import { AlertaService } from '/src/services/external/AlertaService.ts';

(function alertas() {
  "use strict";

  var SEV = {
    high:   { cls: "al-sev-high",   leg: "al-leg-high",   icon: "notification_important", chip: "Alta",  route: "alta" },
    medium: { cls: "al-sev-medium", leg: "al-leg-medium", icon: "notifications",          chip: "Media", route: "media" },
    low:    { cls: "al-sev-low",    leg: "al-leg-low",     icon: "notifications",          chip: "Baja",  route: "baja" },
    info:   { cls: "al-sev-info",   leg: "al-leg-info",   icon: "info",                    chip: "Info",  route: "baja" }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }

  /* Alertas: vienen de la plataforma externa (ver
     src/services/external/AlertaService.ts). Todavía no existe el contrato
     real, así que por ahora llega como datos de ejemplo. */
  var DATA = [];

  async function init() {
    var view = document.querySelector('.view[data-view="alertas"]');
    if (!view || view.__wired) return;
    view.__wired = true;

    DATA = (await AlertaService.getAlertas()).map(function (d) {
      return { name: d.paciente, sev: d.severidad, msg: d.mensaje, fecha: d.fecha, tratIniciado: d.tratamientoIniciado, estudioRealizado: d.estudioRealizado };
    });

    var listHost = document.getElementById("alList");
    var emptyEl  = document.getElementById("alEmpty");
    var rangeEl  = document.getElementById("alRange");

    var pageSize = 10;
    var page = 1;
    var filtered = DATA.slice();

    /* ── Métricas (calculadas en vivo) ── */
    (function metrics() {
      var total = DATA.length;
      var dist = { high: 0, medium: 0, low: 0 };
      var trat = { iniciados: 0, sin: 0 };
      var est  = { realizados: 0, sin: 0 };
      DATA.forEach(function (d) {
        if (dist[d.sev] != null) dist[d.sev]++;
        if (d.tratIniciado) trat.iniciados++; else trat.sin++;
        if (d.estudioRealizado) est.realizados++; else est.sin++;
      });
      var adher = Math.round(trat.iniciados / total * 100);
      var estPct = Math.round(est.realizados / total * 100);

      function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
      function bar(id, v, max) { var el = document.getElementById(id); if (el) el.style.width = (max ? Math.round(v / max * 100) : 0) + "%"; }

      set("alStatPac", total);
      set("alStatAdher", adher + "%");
      set("alStatEst", estPct + "%");

      var distMax = Math.max(dist.high, dist.medium, dist.low, 1);
      set("alDistAlta", dist.high);  bar("alBarAlta", dist.high, distMax);
      set("alDistMedia", dist.medium); bar("alBarMedia", dist.medium, distMax);
      set("alDistBaja", dist.low);    bar("alBarBaja", dist.low, distMax);

      var tratMax = Math.max(trat.sin, trat.iniciados, 1);
      set("alTratSin", trat.sin);        bar("alBarTratSin", trat.sin, tratMax);
      set("alTratIni", trat.iniciados);  bar("alBarTratIni", trat.iniciados, tratMax);

      var estMax = Math.max(est.sin, est.realizados, 1);
      set("alEstSin", est.sin);          bar("alBarEstSin", est.sin, estMax);
      set("alEstHecho", est.realizados); bar("alBarEstHecho", est.realizados, estMax);
    })();

    /* ── Lista ── */
    function rowMarkup(d) {
      var sv = SEV[d.sev];
      return '' +
        '<div class="al-row ' + sv.cls + '" role="button" tabindex="0" data-name="' + esc(d.name) + '">' +
          '<div class="al-ic"><span class="material-symbols-outlined">' + sv.icon + '</span></div>' +
          '<div class="al-content">' +
            '<span class="al-name">' + esc(d.name) + '</span>' +
            '<span class="al-meta"><span class="al-date">Fecha de alerta: ' + esc(d.fecha) + '</span> · <span class="al-msg">' + esc(d.msg) + '</span></span>' +
          '</div>' +
          '<span class="al-chip"><span class="material-symbols-outlined">info</span>' + sv.chip + '</span>' +
        '</div>';
    }

    function pageSlice() {
      var start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }
    function renderRows() {
      var list = pageSlice();
      listHost.innerHTML = list.map(rowMarkup).join("");
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
      document.getElementById("alFirst").disabled = atFirst;
      document.getElementById("alPrev").disabled  = atFirst;
      document.getElementById("alNext").disabled  = atLast;
      document.getElementById("alLast").disabled  = atLast;
    }
    function render() { renderRows(); renderFooter(); }
    function goTo(p) {
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(Math.max(1, p), totalPages);
      render();
    }

    /* alerta → Detalle de seguimiento (origen: alertas) */
    function openDetail(name) {
      var d = DATA.filter(function (x) { return x.name === name; })[0];
      if (d) window.__selectedSeguimiento = {
        name: d.name, ult: d.fecha, prox: d.fecha, cons: d.fecha,
        alert: SEV[d.sev].route, nps: 60 + (seed(d.name) % 35), source: "alertas"
      };
      location.hash = "#/seguimiento-detalle";
    }
    listHost.addEventListener("click", function (e) {
      var row = e.target.closest(".al-row");
      if (row) openDetail(row.getAttribute("data-name"));
    });
    listHost.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target.closest(".al-row");
      if (row) { e.preventDefault(); openDetail(row.getAttribute("data-name")); }
    });

    /* paginación */
    document.getElementById("alFirst").addEventListener("click", function () { goTo(1); });
    document.getElementById("alPrev").addEventListener("click",  function () { goTo(page - 1); });
    document.getElementById("alNext").addEventListener("click",  function () { goTo(page + 1); });
    document.getElementById("alLast").addEventListener("click",  function () { goTo(Math.ceil(filtered.length / pageSize)); });

    /* page-size select */
    var ps = document.getElementById("alPageSize");
    if (ps) {
      var psBtn = ps.querySelector(".ps-select");
      var psValue = document.getElementById("alPageSizeValue");
      var psMenu = document.getElementById("alPageSizeMenu");
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
    var sWrap  = document.getElementById("alSearch");
    var sInput = document.getElementById("alSearchInput");
    var sTrail = document.getElementById("alSearchTrail");
    function applyFilter() {
      var q = sInput.value.trim().toLowerCase();
      sTrail.querySelector(".material-symbols-outlined").textContent = q ? "close" : "search";
      filtered = !q ? DATA.slice() : DATA.filter(function (d) {
        return d.name.toLowerCase().indexOf(q) !== -1 || d.msg.toLowerCase().indexOf(q) !== -1;
      });
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
