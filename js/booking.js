/* ============================================================
   booking.js — Reservation via phone / WhatsApp
   Single Responsibility: build tel: and wa.me links from the
   chosen therapy + active language. No backend, no form POST.
   ============================================================ */

(function (global) {
  "use strict";

  var PHONE_E164 = "14242004019";   // wa.me / tel digits only

  var Booking = {
    init: function () {
      var select = document.querySelector(".booking__select");
      var waBtn = document.querySelector("[data-action='whatsapp']");
      var callBtn = document.querySelector("[data-action='call']");

      /* tel link is static */
      if (callBtn) { callBtn.setAttribute("href", "tel:+" + PHONE_E164); }

      var Lang = global.LTH && global.LTH.Lang;

      function selectedTherapy() {
        if (!select || !select.value) { return ""; }
        var opt = select.options[select.selectedIndex];
        return opt ? opt.textContent.trim() : "";
      }

      function buildWhatsApp() {
        if (!waBtn) { return; }
        var prefix = Lang ? Lang.waPrefix() : "Hola Rose, me gustaría agendar una sesión de ";
        var fallback = (Lang && Lang.current === "en") ? "a session" : "una sesión";
        var therapy = selectedTherapy() || fallback;
        var msg = prefix + therapy + ".";
        waBtn.setAttribute("href",
          "https://wa.me/" + PHONE_E164 + "?text=" + encodeURIComponent(msg));
      }

      if (select) { select.addEventListener("change", buildWhatsApp); }
      document.addEventListener("languagechange", buildWhatsApp);
      buildWhatsApp();

      /* Pre-select therapy when a service card's "Book" link is used */
      document.addEventListener("click", function (e) {
        var link = e.target.closest("[data-book-service]");
        if (!link || !select) { return; }
        var val = link.getAttribute("data-book-service");
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === val) {
            select.selectedIndex = i;
            break;
          }
        }
        buildWhatsApp();
      });
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Booking = Booking;
})(window);
