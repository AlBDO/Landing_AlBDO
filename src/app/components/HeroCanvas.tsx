"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Particles ─────────────────────────────────────
    const PARTICLE_COUNT = 280;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    // warm palette: soft gold, amber, peach
    const palette = [
      new THREE.Color("#f5c842"),
      new THREE.Color("#f0a030"),
      new THREE.Color("#fad47a"),
      new THREE.Color("#e87820"),
      new THREE.Color("#ffe0a0"),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.2 + 0.5;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // soft disc texture
    const canvas2d = document.createElement("canvas");
    canvas2d.width = 64;
    canvas2d.height = 64;
    const ctx = canvas2d.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas2d);

    const pMat = new THREE.PointsMaterial({
      size: 1.4,
      map: tex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.75,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Floating wire orbs ────────────────────────────
    interface Orb {
      mesh: THREE.Mesh;
      speed: THREE.Vector3;
      rotSpeed: THREE.Vector3;
    }

    const orbs: Orb[] = [];
    const orbColors = ["#f5c842", "#e87820", "#f0a030", "#fad47a"];

    for (let i = 0; i < 5; i++) {
      const geo =
        i % 2 === 0
          ? new THREE.IcosahedronGeometry(Math.random() * 2.5 + 1.5, 0)
          : new THREE.OctahedronGeometry(Math.random() * 2.0 + 1.2, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(orbColors[i % orbColors.length]),
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 20 - 5
      );
      scene.add(mesh);
      orbs.push({
        mesh,
        speed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.003,
          0
        ),
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.004,
          Math.random() * 0.005,
          Math.random() * 0.003
        ),
      });
    }

    // ── Mouse parallax ───────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    // ── Resize ────────────────────────────────────────
    const handleResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // ── Animate ───────────────────────────────────────
    let rafId: number;
    let t = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.008;

      // drift particles
      points.rotation.y = t * 0.018 + mouse.x * 0.06;
      points.rotation.x = mouse.y * 0.04;

      // drift + wrap orbs
      for (const orb of orbs) {
        orb.mesh.position.x += orb.speed.x;
        orb.mesh.position.y += orb.speed.y;
        orb.mesh.rotation.x += orb.rotSpeed.x;
        orb.mesh.rotation.y += orb.rotSpeed.y;
        orb.mesh.rotation.z += orb.rotSpeed.z;

        // parallax
        orb.mesh.position.x += mouse.x * 0.012;
        orb.mesh.position.y += mouse.y * 0.008;

        // soft boundary bounce
        if (Math.abs(orb.mesh.position.x) > 36) orb.speed.x *= -1;
        if (Math.abs(orb.mesh.position.y) > 22) orb.speed.y *= -1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      tex.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    />
  );
}
