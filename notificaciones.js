/* =====================================================================
   Dialog · Notificaciones — popover compartido
   ---------------------------------------------------------------------
   Se ancla a TODOS los botones [data-notif-btn] del topbar. Mezcla 3
   tipos de notificación:
     - Alertas: reutiliza el dataset real de alertas.js (window.__alertasData)
     - Cambios de rol/permisos del usuario autenticado (mock)
     - Nuevos usuarios agregados (mock, usando SecuenceUserStore si existe)
   Click en una notificación → navega a la pantalla relacionada y la marca
   leída. Contador de no leídas se refleja en la campana ([data-notif-dot]).
   ===================================================================== */
(function () {
  "use strict";

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var SEV_LABEL = { high: "Alta", medium: "Media", low: "Baja", info: "Info" };
  var SEV_ICON  = { high: "notification_important", medium: "notifications", low: "notifications", info: "info" };

  var TABS = [
    { id: "alertas", label: "Alertas" },
    { id: "todas", label: "Todas" },
    { id: "no-leidas", label: "No leídas" }
  ];

  /* ───────────────────────── dataset ───────────────────────── */
  /* id -> bool, persistido entre reconstrucciones: como buildNotifs() se
     ejecuta cada vez que se abre el modal (para no cachear una lista vacía
     de alertas si alertas.js aún no había cargado), el estado leído/no
     leído se guarda aparte y no en el objeto en sí. */
  var READ_STATE = {};

  function buildNotifs() {
    var out = [];

    /* Alertas: reutiliza el dataset real de la pantalla Alertas si está cargado */
    var alertData = (window.SecuenceAlertsData || []).slice(0, 8);
    alertData.forEach(function (d, i) {
      var id = "al-" + i;
      out.push({
        id: id, type: "alertas", sev: d.sev,
        title: d.name, chip: SEV_LABEL[d.sev], fecha: d.fecha,
        headline: d.msg, read: READ_STATE.hasOwnProperty(id) ? READ_STATE[id] : i >= 4, /* primeras 4 sin leer */
        go: function () {
          window.__selectedPaciente = { name: d.name, date: d.fecha, base: "—" };
          window.__selectedPacienteData = null;
          location.hash = "#/seguimiento-detalle";
        }
      });
    });

    /* Roles y permisos del perfil autenticado (mock) */
    var roleEvents = [
      { fecha: "13 may. 2026", txt: "Tu rol cambió de Médico a Médico administrador." },
      { fecha: "05 may. 2026", txt: "Se te otorgó permiso para gestionar usuarios del equipo." },
      { fecha: "27 abr. 2026", txt: "Se actualizaron los permisos de tu perfil en Roles y permisos." }
    ];
    roleEvents.forEach(function (e, i) {
      var id = "rol-" + i;
      out.push({
        id: id, type: "roles", sev: null,
        title: "Tu perfil", chip: "Rol y permisos", fecha: e.fecha,
        headline: e.txt, read: READ_STATE.hasOwnProperty(id) ? READ_STATE[id] : i >= 1,
        go: function () { location.hash = "#/mi-perfil"; }
      });
    });

    /* Nuevos usuarios agregados (mock, ligado al store de usuarios si existe) */
    var users = (window.SecuenceUserStore && window.SecuenceUserStore.all) ? window.SecuenceUserStore.all() : [];
    var addedEvents = [
      { fecha: "12 may. 2026", by: "Jesús Delgado" },
      { fecha: "02 may. 2026", by: "Tú" },
      { fecha: "21 abr. 2026", by: "Carlos Méndez" }
    ];
    addedEvents.forEach(function (e, i) {
      var u = users[i] || { name: "Nuevo usuario", role: "—" };
      var id = "usr-" + i;
      out.push({
        id: id, type: "usuarios", sev: null,
        title: u.name, chip: u.role, fecha: e.fecha,
        headline: (e.by === "Tú" ? "Agregaste a " : e.by + " agregó a ") + u.name + " (" + u.role + ") al equipo.",
        read: READ_STATE.hasOwnProperty(id) ? READ_STATE[id] : i >= 1,
        go: function () { window.__detailUser = u; location.hash = "#/usuario"; }
      });
    });

    /* orden cronológico aproximado (más reciente primero) por fecha ya asignada arriba */
    return out;
  }

  /* siempre reconstruye: así una alerta que aún no había cargado (orden de
     scripts / hidratación asíncrona) aparece en cuanto window.SecuenceAlertsData
     esté disponible, en vez de quedar cacheada vacía para siempre. */
  function ensureData() { return buildNotifs(); }
  function markRead(id) { READ_STATE[id] = true; }
  function markAllRead() { ensureData().forEach(function (n) { markRead(n.id); }); }

  /* ───────────────────────── modal shell ───────────────────────── */
  var scrim = null, activeTab = "alertas", activeBtn = null;

  function ensureScrim() {
    if (scrim) return scrim;
    scrim = document.createElement("div");
    scrim.className = "notif-pop";
    scrim.id = "notifScrim";
    scrim.innerHTML =
      '<div class="notif-head">' +
        '<span class="notif-title" id="notifTitle">Notificaciones</span>' +
        '<button type="button" class="notif-markall" data-notif-markall>Marcar todas como leídas</button>' +
      "</div>" +
      '<div class="notif-tabs" data-notif-tabs>' +
        TABS.map(function (t) { return '<button type="button" class="notif-tab" data-tab="' + t.id + '">' + t.label + "</button>"; }).join("") +
      "</div>" +
      '<div class="notif-list" data-notif-list></div>';
    document.body.appendChild(scrim);

    scrim.addEventListener("click", function (e) { e.stopPropagation(); });
    scrim.querySelector("[data-notif-tabs]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (!b) return;
      activeTab = b.getAttribute("data-tab");
      renderList();
    });
    scrim.querySelector("[data-notif-markall]").addEventListener("click", function () {
      markAllRead();
      renderList();
      updateDots();
    });
    scrim.querySelector("[data-notif-list]").addEventListener("click", function (e) {
      var item = e.target.closest("[data-notif-id]");
      if (!item) return;
      var id = item.getAttribute("data-notif-id");
      var n = ensureData().filter(function (x) { return x.id === id; })[0];
      if (!n) return;
      markRead(id);
      closeModal();
      updateDots();
      if (n.go) n.go();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    return scrim;
  }

  function iconFor(n) {
    if (n.type === "alertas") return { cls: "sev-" + n.sev, icon: SEV_ICON[n.sev] };
    if (n.type === "roles") return { cls: "type-role", icon: "admin_panel_settings" };
    return { cls: "type-user", icon: "person_add" };
  }

  function renderList() {
    var host = scrim.querySelector("[data-notif-list]");
    Array.prototype.forEach.call(scrim.querySelectorAll("[data-tab]"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-tab") === activeTab);
    });
    var data = ensureData();
    var list = data.filter(function (n) {
      if (activeTab === "todas") return true;
      if (activeTab === "no-leidas") return !n.read;
      if (activeTab === "alertas") return n.type === "alertas";
      if (activeTab === "roles") return n.type === "roles";
      if (activeTab === "usuarios") return n.type === "usuarios";
      return true;
    });
    var markBtn = scrim.querySelector("[data-notif-markall]");
    markBtn.disabled = !data.some(function (n) { return !n.read; });

    if (!list.length) {
      host.innerHTML = '<div class="notif-empty"><span class="material-symbols-outlined">notifications_none</span><span>No hay notificaciones en esta categoría.</span></div>';
      return;
    }
    host.innerHTML = list.map(function (n) {
      var ic = iconFor(n);
      var chipCls = n.type === "alertas" ? " sev-" + n.sev : "";
      return (
        '<button type="button" class="notif-item' + (n.read ? "" : " is-unread") + '" data-notif-id="' + n.id + '">' +
          '<span class="notif-ic ' + ic.cls + '"><span class="material-symbols-outlined">' + ic.icon + "</span></span>" +
          '<span class="notif-body">' +
            '<span class="notif-top"><span class="notif-name">' + esc(n.title) + '</span><span class="notif-time">' + esc(n.fecha) + "</span></span>" +
            '<span class="notif-meta"><span class="notif-chip' + chipCls + '">' + esc(n.chip) + "</span></span>" +
            '<span class="notif-headline">' + esc(n.headline) + "</span>" +
          "</span>" +
        "</button>"
      );
    }).join("");
  }

  function updateDots() {
    var unread = ensureData().filter(function (n) { return !n.read; }).length;
    Array.prototype.forEach.call(document.querySelectorAll("[data-notif-dot]"), function (dot) {
      if (unread > 0) { dot.hidden = false; dot.textContent = unread > 9 ? "9+" : String(unread); }
      else { dot.hidden = true; }
    });
  }

  function openModal(btn) {
    ensureScrim();
    if (activeBtn === btn && scrim.classList.contains("is-open")) { closeModal(); return; }
    activeBtn = btn;
    ensureData();
    renderList();
    updateDots();
    var r = btn.getBoundingClientRect();
    scrim.style.top = (r.bottom + 8) + "px";
    var left = r.right - 420;
    scrim.style.left = Math.max(8, left) + "px";
    scrim.classList.add("is-open");
  }
  function closeModal() { if (scrim) scrim.classList.remove("is-open"); activeBtn = null; }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-notif-btn]");
    if (btn) { e.stopPropagation(); openModal(btn); return; }
    if (scrim && scrim.classList.contains("is-open") && !e.target.closest(".notif-pop")) closeModal();
  });
  window.addEventListener("resize", closeModal);

  document.addEventListener("DOMContentLoaded", updateDots);
  if (document.readyState !== "loading") updateDots();
  /* re-check shortly after boot too, in case alertas.js (or any other data
     source) finishes loading after this script's initial tick */
  setTimeout(updateDots, 0);
  window.addEventListener("load", updateDots);
})();
