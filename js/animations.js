/* ============================================================
   animations.js — Scroll-reveal orchestration
   Single Responsibility: reveal elements as they enter view.
   Strategy: use GSAP + ScrollTrigger when available (fluid,
   staggered); gracefully fall back to IntersectionObserver;
   final fallback simply shows everything. Reduced-motion safe.
   ============================================================ */

(function (global) {
  "use strict";

  var Animations = {
    init: function () {
      var support = (global.LTH && global.LTH.support) || {};

      if (support.reducedMotion) { this._showAll(); return; }

      if (global.gsap && global.ScrollTrigger) {
        this._withGSAP();
      } else if (support.intersection) {
        this._withObserver();
      } else {
        this._showAll();
      }
    },

    _showAll: function () {
      var all = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
      for (var i = 0; i < all.length; i++) { all[i].classList.add("is-visible"); }
    },

    _withGSAP: function () {
      var gsap = global.gsap;
      gsap.registerPlugin(global.ScrollTrigger);

      /* Single reveals */
      gsap.utils.toArray("[data-reveal]").forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 38 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true }
          });
      });

      /* Staggered groups */
      gsap.utils.toArray("[data-reveal-stagger]").forEach(function (group) {
        gsap.fromTo(group.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 84%", once: true }
          });
      });

      /* Subtle drift on decorative lotus accents */
      gsap.utils.toArray(".deco-lotus").forEach(function (el) {
        gsap.to(el, {
          y: -40, rotation: 8, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 }
        });
      });
    },

    _withObserver: function () {
      var els = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

      for (var i = 0; i < els.length; i++) { io.observe(els[i]); }
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Animations = Animations;
})(window);
