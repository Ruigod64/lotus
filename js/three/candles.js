/* ============================================================
   candles.js — Velas 3D (sección Experiencia)
   Tres velas de cera con llama que parpadea (escala + opacidad
   + luz puntual), brillo aditivo y brasas que ascienden.
   La intensidad entra suavemente con el scroll (setIntro).
   ============================================================ */

import * as THREE from "three";
import { PALETTE, radialTexture, pixelRatio } from "./webgl.js";

export function createCandleScene(canvas, opts = {}) {
  const lowPower = !!opts.lowPower;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: true
  });
  renderer.setPixelRatio(pixelRatio(lowPower ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.5, 7);
  camera.lookAt(0, 1.1, 0);

  /* Luz cálida ambiental para que la cera no se vea plana */
  scene.add(new THREE.AmbientLight(0xfff0dd, 0.55));
  const fill = new THREE.DirectionalLight(0xffe9cf, 0.3);
  fill.position.set(-3, 5, 4);
  scene.add(fill);

  const glowTex = radialTexture("rgba(255,190,110,0.7)", "rgba(255,160,70,0)");
  const emberTex = radialTexture("rgba(255,214,160,0.95)", "rgba(255,180,110,0)", 64);

  const candleMat = new THREE.MeshStandardMaterial({
    color: PALETTE.cream,
    roughness: 0.65,
    metalness: 0.0
  });

  const candles = [];
  const specs = [
    { x: -2.1, h: 2.2, r: 0.42 },
    { x: 0.0, h: 3.0, r: 0.5 },
    { x: 2.1, h: 1.6, r: 0.4 }
  ];

  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    const candle = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(s.r, s.r * 1.03, s.h, 40),
      candleMat
    );
    body.position.y = s.h / 2;
    candle.add(body);

    /* Disco superior de cera, un punto más cálido */
    const top = new THREE.Mesh(
      new THREE.CircleGeometry(s.r, 40),
      new THREE.MeshStandardMaterial({ color: PALETTE.goldSoft, roughness: 0.8 })
    );
    top.rotation.x = -Math.PI / 2;
    top.position.y = s.h + 0.001;
    candle.add(top);

    const flameY = s.h + 0.32;

    /* Llama: cono exterior (naranja) + núcleo (dorado) aditivos */
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.55, 18),
      new THREE.MeshBasicMaterial({
        color: PALETTE.flame,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    flame.position.set(0, flameY, 0);
    candle.add(flame);

    const core = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.3, 14),
      new THREE.MeshBasicMaterial({
        color: PALETTE.flameCore,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    core.position.set(0, flameY - 0.05, 0);
    candle.add(core);

    /* Halo de brillo */
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xffb060,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.65
      })
    );
    glow.scale.setScalar(2.3);
    glow.position.set(0, flameY, 0);
    candle.add(glow);

    /* Luz puntual cálida que parpadea */
    const light = new THREE.PointLight(0xffb060, 1.2, 9, 2);
    light.position.set(0, flameY + 0.1, 0.25);
    candle.add(light);

    candle.position.x = s.x;
    candle.userData = {
      flame: flame,
      core: core,
      glow: glow,
      light: light,
      baseIntensity: 1.2,
      phase: Math.random() * Math.PI * 2
    };

    scene.add(candle);
    candles.push(candle);
  }

  /* ---- Brasas: puntos cálidos que ascienden ---- */
  const emberCount = lowPower ? 28 : 70;
  const positions = new Float32Array(emberCount * 3);
  const emberData = [];
  for (let i = 0; i < emberCount; i++) {
    const x = (Math.random() - 0.5) * 6;
    const y = Math.random() * 4.2;
    const z = (Math.random() - 0.5) * 2;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    emberData.push({
      x: x,
      speed: 0.2 + Math.random() * 0.45,
      sway: Math.random() * Math.PI * 2
    });
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({
      map: emberTex,
      color: 0xffcaa0,
      size: 0.16,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
      sizeAttenuation: true
    })
  );
  scene.add(embers);

  let intro = 0; // 0..1 (lo alimenta ScrollTrigger)

  /** Intensidad de entrada de la escena al hacer scroll. */
  function setIntro(v) {
    intro = v;
  }

  function update(t) {
    for (let i = 0; i < candles.length; i++) {
      const d = candles[i].userData;
      /* Parpadeo orgánico: suma de senos a distintas frecuencias */
      const flick = 0.85 +
        Math.sin(t * 9 + d.phase) * 0.06 +
        Math.sin(t * 23 + d.phase) * 0.03;
      d.flame.scale.set(1 + Math.sin(t * 13 + d.phase) * 0.08, flick, 1);
      d.flame.position.x = Math.sin(t * 7 + d.phase) * 0.02;
      d.core.scale.y = flick;
      d.glow.material.opacity = (0.5 + Math.sin(t * 11 + d.phase) * 0.12) * (0.4 + 0.6 * intro);
      d.light.intensity = d.baseIntensity *
        (0.85 + Math.sin(t * 17 + d.phase) * 0.15) *
        (0.35 + 0.65 * intro);
    }

    const arr = emberGeo.attributes.position.array;
    for (let i = 0; i < emberData.length; i++) {
      const e = emberData[i];
      let y = arr[i * 3 + 1] + e.speed * 0.01;
      if (y > 4.4) { y = 0; }
      arr[i * 3 + 1] = y;
      arr[i * 3] = e.x + Math.sin(t * 0.6 + e.sway) * 0.3;
    }
    emberGeo.attributes.position.needsUpdate = true;
    embers.material.opacity = (0.2 + 0.6 * intro);

    /* Cámara con leve vaivén para sensación de presencia */
    camera.position.x = Math.sin(t * 0.15) * 0.25;
    camera.lookAt(0, 1.1, 0);

    renderer.render(scene, camera);
  }

  function resize(w, h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    glowTex.dispose();
    emberTex.dispose();
    emberGeo.dispose();
    renderer.dispose();
  }

  return { update, resize, dispose, setIntro, renderer };
}
