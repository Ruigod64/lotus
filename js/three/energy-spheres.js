/* ============================================================
   energy-spheres.js — Esferas 3D de energía (Hero)
   Orbes translúcidos (champagne / salvia / marfil) que derivan
   muy lentamente; un halo aditivo les da un brillo etéreo.
   Reactivos al scroll: el grupo se eleva y gira sutilmente.
   ============================================================ */

import * as THREE from "three";
import { PALETTE, radialTexture, pixelRatio } from "./webgl.js";

export function createEnergyScene(canvas, opts = {}) {
  const lowPower = !!opts.lowPower;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: true,
    powerPreference: "low-power"
  });
  renderer.setPixelRatio(pixelRatio(lowPower ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* Luz suave y cálida — sin contrastes duros */
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const key = new THREE.DirectionalLight(0xfff2dd, 0.55);
  key.position.set(2, 3, 4);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  const haloTex = radialTexture("rgba(198,167,125,0.5)", "rgba(198,167,125,0)");
  const tints = [PALETTE.goldSoft, PALETTE.sageSoft, PALETTE.cream, PALETTE.gold, PALETTE.sage];

  const sphereGeo = new THREE.IcosahedronGeometry(1, lowPower ? 2 : 3);
  const orbs = [];
  const count = lowPower ? 5 : 9;

  for (let i = 0; i < count; i++) {
    const tint = tints[i % tints.length];
    const orb = new THREE.Group();
    const r = 0.4 + Math.random() * 0.9;

    const core = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshStandardMaterial({
        color: tint,
        transparent: true,
        opacity: 0.3,
        roughness: 0.25,
        metalness: 0.0
      })
    );
    core.scale.setScalar(r);
    orb.add(core);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTex,
        color: tint,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.55
      })
    );
    halo.scale.setScalar(r * 4.2);
    orb.add(halo);

    /* Posición sesgada a la derecha para no estorbar al texto */
    orb.position.set(
      (Math.random() - 0.25) * 11,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 4 - 1
    );
    orb.userData = {
      base: orb.position.clone(),
      speed: 0.18 + Math.random() * 0.32,
      amp: 0.25 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2
    };

    group.add(orb);
    orbs.push(orb);
  }

  let scrollProgress = 0;

  /** Progreso 0..1 del hero al hacer scroll (lo alimenta ScrollTrigger). */
  function setScroll(v) {
    scrollProgress = v;
  }

  function update(t) {
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const d = orb.userData;
      orb.position.x = d.base.x + Math.sin(t * d.speed + d.phase) * d.amp;
      orb.position.y = d.base.y + Math.cos(t * d.speed * 0.8 + d.phase) * d.amp;
      orb.rotation.z += d.spin * 0.01;
      orb.children[0].rotation.y += 0.002;
    }
    /* Deriva + leve giro con el scroll; se desvanece al subir */
    group.position.y = scrollProgress * 2.4;
    group.rotation.z = scrollProgress * 0.06;
    const fade = 1 - scrollProgress * 0.85;
    for (let i = 0; i < orbs.length; i++) {
      orbs[i].children[0].material.opacity = 0.3 * fade;
      orbs[i].children[1].material.opacity = 0.55 * fade;
    }
    renderer.render(scene, camera);
  }

  function resize(w, h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    sphereGeo.dispose();
    haloTex.dispose();
    orbs.forEach(function (orb) {
      orb.children.forEach(function (c) {
        if (c.material) { c.material.dispose(); }
      });
    });
    renderer.dispose();
  }

  return { update, resize, dispose, setScroll, renderer };
}
