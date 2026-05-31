/* ============================================================
   parallax.js — Hero / CTA depth parallax
   Single Responsibility: translate layers on scroll using a
   throttled rAF loop. Native (no library) so it always works;
   honors reduced-motion and disables on touch for performance.
   ============================================================ */

(function (global) {
  "use strict";

  var Parallax = {
    init: function () {
      var support = (global.LTH && global.LTH.support) || {};
      if (support.reducedMotion || support.touch) { return; }

      var layers = document.querySelectorAll("[data-parallax]");
      if (!layers.length) { return; }

      var ticking = false;

      function update() {
        var scrolled = global.pageYOffset || document.documentElement.scrollTop;
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];
          var speed = parseFloat(layer.getAttribute("data-parallax")) || 0.2;
          /* offset relative to the element's section for CTA-style layers */
          var rectTop = layer.parentElement
            ? layer.parentElement.offsetTop : 0;
          var y = (scrolled - rectTop) * speed;
          layer.style.transform = "translate3d(0," + y + "px, 0)";
        }
        ticking = false;
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          global.requestAnimationFrame(update);
        }
      }

      global.addEventListener("scroll", onScroll, { passive: true });
      global.addEventListener("resize", onScroll, { passive: true });
      update();
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Parallax = Parallax;
})(window);
