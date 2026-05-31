/* ============================================================
   navigation.js — Header behavior, mobile drawer, smooth scroll
   Single Responsibility: everything about moving around the page.
   ============================================================ */

(function (global) {
  "use strict";

  var Navigation = {
    init: function () {
      this._header();
      this._drawer();
      this._smoothScroll();
    },

    /* Add .is-scrolled to header past a threshold */
    _header: function () {
      var header = document.querySelector(".header");
      if (!header) { return; }
      var ticking = false;

      function update() {
        var y = global.pageYOffset || document.documentElement.scrollTop;
        header.classList.toggle("is-scrolled", y > 40);
        ticking = false;
      }
      global.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; global.requestAnimationFrame(update); }
      }, { passive: true });
      update();
    },

    /* Mobile slide-in drawer with backdrop + focus management */
    _drawer: function () {
      var toggle = document.querySelector(".nav-toggle");
      var nav = document.querySelector(".nav");
      var backdrop = document.querySelector(".nav-backdrop");
      if (!toggle || !nav) { return; }

      function isOpen() { return nav.className.indexOf("is-open") !== -1; }

      function setOpen(open) {
        nav.classList.toggle("is-open", open);
        if (backdrop) { backdrop.classList.toggle("is-open", open); }
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      }

      toggle.addEventListener("click", function () { setOpen(!isOpen()); });

      if (backdrop) {
        backdrop.addEventListener("click", function () { setOpen(false); });
      }

      /* close when a nav link / CTA is chosen */
      nav.addEventListener("click", function (e) {
        if (e.target.closest(".nav__link") || e.target.closest(".nav__cta")) {
          setOpen(false);
        }
      });

      /* Escape closes drawer */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.keyCode === 27) { setOpen(false); }
      });
    },

    /* Smooth anchor scrolling with header offset (graceful fallback) */
    _smoothScroll: function () {
      var support = (global.LTH && global.LTH.support) || {};
      var header = document.querySelector(".header");

      document.addEventListener("click", function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) { return; }
        var id = link.getAttribute("href");
        if (id === "#" || id.length < 2) { return; }
        var target = document.querySelector(id);
        if (!target) { return; }

        e.preventDefault();
        var offset = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top +
          (global.pageYOffset || document.documentElement.scrollTop) - offset + 1;

        if (support.smoothScroll && !support.reducedMotion) {
          global.scrollTo({ top: top, behavior: "smooth" });
        } else {
          global.scrollTo(0, top);
        }

        /* move focus for accessibility */
        target.setAttribute("tabindex", "-1");
        try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
      });
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Navigation = Navigation;
})(window);
