/* ============================================================
   cursor.js — Soft luminous glow that trails the cursor (delay)
   Single Responsibility: animate a blurred light following the
   pointer with easing. Skips touch / reduced-motion devices.
   ============================================================ */

(function (global) {
  "use strict";

  var Cursor = {
    init: function () {
      var support = (global.LTH && global.LTH.support) || {};
      if (support.touch || support.reducedMotion) { return; }

      var glow = document.querySelector(".cursor-glow");
      if (!glow) { return; }

      var target = { x: global.innerWidth / 2, y: global.innerHeight / 2 };
      var pos = { x: target.x, y: target.y };
      var ease = 0.12;          // lower = longer, dreamier delay
      var running = false;
      var visible = false;

      function render() {
        pos.x += (target.x - pos.x) * ease;
        pos.y += (target.y - pos.y) * ease;
        glow.style.transform =
          "translate3d(" + (pos.x - glow.offsetWidth / 2) + "px," +
          (pos.y - glow.offsetHeight / 2) + "px, 0)";

        var dx = target.x - pos.x;
        var dy = target.y - pos.y;
        if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
          global.requestAnimationFrame(render);
        } else {
          running = false;
        }
      }

      function onMove(e) {
        target.x = e.clientX;
        target.y = e.clientY;
        if (!visible) {
          visible = true;
          glow.classList.add("is-visible");
        }
        if (!running) {
          running = true;
          global.requestAnimationFrame(render);
        }
      }

      function onLeave() {
        visible = false;
        glow.classList.remove("is-visible");
      }

      document.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      global.addEventListener("blur", onLeave);

      /* Subtle grow when hovering interactive elements */
      var interactive = "a, button, .service-card, input, select";
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest && e.target.closest(interactive)) {
          glow.style.width = "300px";
          glow.style.height = "300px";
        }
      });
      document.addEventListener("mouseout", function (e) {
        if (e.target.closest && e.target.closest(interactive)) {
          glow.style.width = "420px";
          glow.style.height = "420px";
        }
      });
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Cursor = Cursor;
})(window);
