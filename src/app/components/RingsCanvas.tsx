"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RingsCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Torus rings
    interface Ring {
      mesh: THREE.Mesh;
      speed: number;
      tiltPhase: number;
    }
    const rings: Ring[] = [];
    const ringColors = ["#f5c842", "#e87820", "#fad47a", "#f0a030", "#ffe0a0"];

    for (let i = 0; i < 6; i++) {
      const r = 3 + i * 2.8;
      const geo = new THREE.TorusGeometry(r, 0.04 + Math.random() * 0.06, 6, 80);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(ringColors[i % ringColors.length]),
        transparent: true,
        opacity: 0.13 + Math.random() * 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      mesh.rotation.y = (Math.random() - 0.5) * 0.5;
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 5
      );
      scene.add(mesh);
      rings.push({ mesh, speed: 0.0012 + Math.random() * 0.001, tiltPhase: Math.random() * Math.PI * 2 });
    }

    const handleResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    let rafId: number;
    let t = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.01;
      for (const ring of rings) {
        ring.mesh.rotation.z += ring.speed;
        ring.mesh.rotation.x += Math.sin(t + ring.tiltPhase) * 0.0004;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
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
