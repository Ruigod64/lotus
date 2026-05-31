/* ============================================================
   main.js — Application bootstrap / orchestration
   Depends on the feature modules registered on window.LTH.
   Each module is independent (Single Responsibility); main only
   wires them together (Dependency Inversion at the app edge).
   ============================================================ */

(function (global) {
  "use strict";

  function boot() {
    var LTH = global.LTH || {};

    /* Order: language first (content), then behavior & motion. */
    safe(LTH.Lang && LTH.Lang.init, LTH.Lang);
    safe(LTH.Navigation && LTH.Navigation.init, LTH.Navigation);
    safe(LTH.Cursor && LTH.Cursor.init, LTH.Cursor);
    safe(LTH.Parallax && LTH.Parallax.init, LTH.Parallax);
    safe(LTH.Booking && LTH.Booking.init, LTH.Booking);
    safe(LTH.Animations && LTH.Animations.init, LTH.Animations);

    /* Footer year */
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
  }

  /** Run a module init defensively so one failure can't break the page. */
  function safe(fn, ctx) {
    if (typeof fn !== "function") { return; }
    try { fn.call(ctx); }
    catch (err) {
      if (global.console && console.warn) {
        console.warn("[LTH] module init failed:", err);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
