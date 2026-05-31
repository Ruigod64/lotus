/* ============================================================
   webgl.js — Utilidades compartidas para las escenas 3D
   Responsabilidad única: detección de capacidades, paleta y
   fábricas de texturas suaves (glow / brasas).
   ============================================================ */

import * as THREE from "three";

/** Paleta de marca, lista para THREE.Color (hex numérico). */
export const PALETTE = {
  beige:     0xf6f1eb,
  sand:      0xefe7de,
  cream:     0xfffdf9,
  gold:      0xc6a77d,
  goldSoft:  0xd8c2a0,
  sage:      0xa7b3a2,
  sageSoft:  0xc9d1c4,
  coffee:    0x4e443d,
  flame:     0xffb066, // naranja cálido
  flameCore: 0xffe6b8  // núcleo dorado claro
};

/** ¿El navegador soporta WebGL? */
export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

/** ¿El usuario prefiere menos movimiento? */
export function prefersReducedMotion() {
  return !!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Puntero grueso (táctil) → modo de bajo consumo. */
export function isCoarsePointer() {
  return !!(
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches
  );
}

/** DPR acotado para no penalizar el rendimiento en pantallas densas. */
export function pixelRatio(max = 2) {
  return Math.min(window.devicePixelRatio || 1, max);
}

/**
 * Textura radial suave (sprite de brillo / brasa).
 * Devuelve un CanvasTexture con degradado del centro al borde.
 */
export function radialTexture(inner, outer, size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  g.addColorStop(0, inner);
  g.addColorStop(0.45, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  if ("colorSpace" in tex) { tex.colorSpace = THREE.SRGBColorSpace; }
  tex.needsUpdate = true;
  return tex;
}
