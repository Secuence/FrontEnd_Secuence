/* =====================================================================
   Date range picker — popover compartido
   ---------------------------------------------------------------------
   Se engancha a TODOS los botones [data-cal-btn] del topbar (Indicadores,
   Alertas, Seguimientos, Roles y permisos, Historias, Mi perfil). Al
   aplicar un rango: resalta el botón, inyecta un chip "Periodo: … – …"
   con opción de quitar, y dispara un breve pulso de opacidad sobre el
   contenido de la vista activa para simular el refiltrado de datos.
   ===================================================================== */
(function () {
  "use strict";

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var MESES_ABBR = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
  var DOW = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

  var pop = null, cursorMonth = null, cursorYear = null;
  var rangeStart = null, rangeEnd = null; /* Date | null */
  var activeBtn = null;

  function fmt(d) { return d.getDate() + " " + MESES_ABBR[d.getMonth()]; }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function isBetween(d, a, b) { return d > a && d < b; }

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "drp-pop";
    pop.innerHTML =
      '<div class="drp-head">' +
        '<button type="button" class="drp-nav-btn" data-drp-prev aria-label="Mes anterior"><span class="material-symbols-outlined">chevron_left</span></button>' +
        '<span class="drp-month" data-drp-month></span>' +
        '<button type="button" class="drp-nav-btn" data-drp-next aria-label="Mes siguiente"><span class="material-symbols-outlined">chevron_right</span></button>' +
      "</div>" +
      '<div class="drp-dow">' + DOW.map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
      '<div class="drp-grid" data-drp-grid></div>' +
      '<div class="drp-hint" data-drp-hint>Selecciona la fecha de inicio</div>' +
      '<div class="drp-foot">' +
        '<button type="button" class="drp-cancel" data-drp-cancel>Cancelar</button>' +
        '<button type="button" class="drp-apply" data-drp-apply disabled>Aplicar</button>' +
      "</div>";
    document.body.appendChild(pop);

    pop.querySelector("[data-drp-prev]").addEventListener("click", function () { shiftMonth(-1); });
    pop.querySelector("[data-drp-next]").addEventListener("click", function () { shiftMonth(1); });
    pop.querySelector("[data-drp-cancel]").addEventListener("click", closePop);
    pop.querySelector("[data-drp-apply]").addEventListener("click", applyRange);
    pop.addEventListener("click", function (e) { e.stopPropagation(); });
    return pop;
  }

  function shiftMonth(delta) {
    cursorMonth += delta;
    if (cursorMonth < 0) { cursorMonth = 11; cursorYear--; }
    if (cursorMonth > 11) { cursorMonth = 0; cursorYear++; }
    renderGrid();
  }

  function renderGrid() {
    var monthEl = pop.querySelector("[data-drp-month]");
    monthEl.textContent = MESES[cursorMonth] + " " + cursorYear;

    var first = new Date(cursorYear, cursorMonth, 1);
    var startOffset = (first.getDay() + 6) % 7; /* lunes=0 */
    var daysInMonth = new Date(cursorYear, cursorMonth + 1, 0).getDate();
    var today = new Date();

    var cells = [];
    for (var i = 0; i < startOffset; i++) cells.push('<button class="drp-day" disabled></button>');
    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(cursorYear, cursorMonth, day);
      var cls = ["drp-day"];
      if (sameDay(d, today)) cls.push("is-today");
      if (rangeStart && sameDay(d, rangeStart)) { cls.push("is-selected", "is-range-start"); if (rangeEnd) cls.push("is-in-range"); }
      if (rangeEnd && sameDay(d, rangeEnd)) cls.push("is-selected", "is-range-end", "is-in-range");
      if (rangeStart && rangeEnd && isBetween(d, rangeStart, rangeEnd)) cls.push("is-in-range");
      cells.push('<button type="button" class="' + cls.join(" ") + '" data-drp-date="' + d.getTime() + '">' + day + "</button>");
    }
    pop.querySelector("[data-drp-grid]").innerHTML = cells.join("");
    Array.prototype.forEach.call(pop.querySelectorAll("[data-drp-date]"), function (btn) {
      btn.addEventListener("click", function () { pickDate(new Date(+btn.getAttribute("data-drp-date"))); });
    });

    var hint = pop.querySelector("[data-drp-hint]");
    var applyBtn = pop.querySelector("[data-drp-apply]");
    if (rangeStart && rangeEnd) { hint.textContent = fmt(rangeStart) + " – " + fmt(rangeEnd); applyBtn.disabled = false; }
    else if (rangeStart) { hint.textContent = "Selecciona la fecha final"; applyBtn.disabled = true; }
    else { hint.textContent = "Selecciona la fecha de inicio"; applyBtn.disabled = true; }
  }

  function pickDate(d) {
    if (!rangeStart || (rangeStart && rangeEnd)) { rangeStart = d; rangeEnd = null; }
    else if (d < rangeStart) { rangeEnd = rangeStart; rangeStart = d; }
    else { rangeEnd = d; }
    renderGrid();
  }

  function openPop(btn) {
    ensurePop();
    if (activeBtn === btn && pop.classList.contains("is-open")) { closePop(); return; }
    activeBtn = btn;
    var today = new Date();
    cursorMonth = today.getMonth(); cursorYear = today.getFullYear();
    rangeStart = null; rangeEnd = null;
    renderGrid();
    var r = btn.getBoundingClientRect();
    pop.style.top = (r.bottom + 8) + "px";
    var left = r.right - 328;
    pop.style.left = Math.max(8, left) + "px";
    pop.classList.add("is-open");
  }
  function closePop() { if (pop) pop.classList.remove("is-open"); activeBtn = null; }

  function currentView(btn) { return btn.closest(".view"); }

  function applyRange() {
    if (!rangeStart || !rangeEnd || !activeBtn) return;
    var btn = activeBtn;
    var view = currentView(btn);
    var tools = btn.closest(".topbar-tools");
    closePop();

    btn.classList.add("has-filter");
    var existingChip = tools ? tools.querySelector(".drp-chip") : null;
    if (existingChip) existingChip.remove();

    var chip = document.createElement("span");
    chip.className = "drp-chip";
    chip.innerHTML = '<span>' + fmt(rangeStart) + " – " + fmt(rangeEnd) + '</span>' +
      '<button type="button" class="drp-chip-rm" aria-label="Quitar filtro de fecha"><span class="material-symbols-outlined">close</span></button>';
    chip.querySelector(".drp-chip-rm").addEventListener("click", function () {
      chip.remove();
      btn.classList.remove("has-filter");
    });
    if (tools) tools.insertBefore(chip, btn.nextSibling);

    /* simular refiltrado de datos: breve pulso de opacidad en el contenido de la vista activa */
    if (view) {
      view.classList.add("is-drp-filtering");
      setTimeout(function () { view.classList.remove("is-drp-filtering"); }, 420);
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cal-btn]");
    if (btn) { e.stopPropagation(); openPop(btn); return; }
    if (pop && pop.classList.contains("is-open") && !e.target.closest(".drp-pop")) closePop();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
})();
