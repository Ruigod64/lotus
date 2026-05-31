/* ============================================================
   index.js — Orquestador de las escenas 3D (módulo ES6)
   - Detecta WebGL / reduced-motion / táctil y degrada con gracia.
   - Un único bucle requestAnimationFrame para todas las escenas.
   - Pausa el render cuando la pestaña está oculta o el lienzo
     está fuera de viewport (IntersectionObserver) → rendimiento.
   - Conecta el scroll con GSAP ScrollTrigger (si está disponible).
   ============================================================ */

import { createEnergyScene } from "./energy-spheres.js";
import { createCandleScene } from "./candles.js";
import { hasWebGL, prefersReducedMotion, isCoarsePointer } from "./webgl.js";

(function () {
  "use strict";

  if (!hasWebGL()) {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const reduced = prefersReducedMotion();
  const lowPower = isCoarsePointer();
  const scenes = [];

  /** Registra una escena: medición, observador de visibilidad, fade-in. */
  function register(canvas, scene, anchor) {
    const entry = { canvas: canvas, scene: scene, visible: true, w: 0, h: 0 };
    const target = anchor || canvas;

    entry.fit = function () {
      const rect = target.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w !== entry.w || h !== entry.h) {
        entry.w = w;
        entry.h = h;
        scene.resize(w, h);
      }
    };
    entry.fit();

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entry.visible = entries[0].isIntersecting;
      }, { rootMargin: "140px" });
      io.observe(target);
    }

    canvas.classList.add("is-ready");
    scenes.push(entry);
    return entry;
  }

  /* ---- Instanciar escenas según los lienzos presentes ---- */
  let heroEntry = null;
  let candleEntry = null;

  const heroCanvas = document.querySelector('[data-three="spheres"]');
  if (heroCanvas) {
    const heroScene = createEnergyScene(heroCanvas, { lowPower: lowPower });
    heroEntry = register(heroCanvas, heroScene, document.getElementById("hero"));
  }

  const candleCanvas = document.querySelector('[data-three="candles"]');
  if (candleCanvas) {
    const candleScene = createCandleScene(candleCanvas, { lowPower: lowPower });
    candleEntry = register(candleCanvas, candleScene, candleCanvas.closest(".scene-candles"));
  }

  if (!scenes.length) { return; }

  /* ---- Reescalado con debounce ---- */
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      for (let i = 0; i < scenes.length; i++) { scenes[i].fit(); }
    }, 150);
  }, { passive: true });

  /* ---- Scroll con GSAP ScrollTrigger (mejora progresiva) ---- */
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    if (heroEntry) {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: function (self) { heroEntry.scene.setScroll(self.progress); }
      });
    }

    if (candleEntry) {
      ScrollTrigger.create({
        trigger: ".scene-candles",
        start: "top 85%",
        end: "center center",
        scrub: true,
        onUpdate: function (self) { candleEntry.scene.setIntro(self.progress); }
      });
    }
  } else {
    /* Sin GSAP o con reduced-motion: estado pleno y estático */
    if (heroEntry) { heroEntry.scene.setScroll(0); }
    if (candleEntry) { candleEntry.scene.setIntro(1); }
  }

  /* ---- Render ---- */
  if (reduced) {
    /* Un único fotograma estático: presencia sin movimiento */
    for (let i = 0; i < scenes.length; i++) { scenes[i].scene.update(0.6); }
    return;
  }

  let last = (window.performance && performance.now) ? performance.now() : Date.now();
  let elapsed = 0;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += dt;

    if (!document.hidden) {
      for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].visible) { scenes[i].scene.update(elapsed); }
      }
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
