"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 60;
const MAX_DIST = 14;

export default function CTACanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Nodes ─────────────────────────────────────────
    interface Node3D {
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      mesh: THREE.Mesh;
    }

    const nodeGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#e87820"),
      transparent: true,
      opacity: 0.7,
    });

    const nodes: Node3D[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 18
      );
      mesh.position.copy(pos);
      scene.add(mesh);
      nodes.push({
        pos,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        mesh,
      });
    }

    // ── Edge lines ────────────────────────────────────
    // We'll update them each frame via a LineSegments object
    const maxEdges = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
    const edgePositions = new Float32Array(maxEdges * 6); // 2 verts * xyz
    const edgeColors = new Float32Array(maxEdges * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3).setUsage(THREE.DynamicDrawUsage));
    edgeGeo.setAttribute("color",    new THREE.BufferAttribute(edgeColors,    3).setUsage(THREE.DynamicDrawUsage));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(lines);

    const warmA = new THREE.Color("#f5c842");
    const warmB = new THREE.Color("#e87820");

    // ── Mouse ────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize ───────────────────────────────────────
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ──────────────────────────────────────
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // move nodes
      for (const n of nodes) {
        n.pos.addScaledVector(n.vel, 1);
        if (Math.abs(n.pos.x) > 28) n.vel.x *= -1;
        if (Math.abs(n.pos.y) > 16) n.vel.y *= -1;
        if (Math.abs(n.pos.z) > 10) n.vel.z *= -1;
        n.mesh.position.copy(n.pos);
      }

      // slow parallax camera drift
      camera.position.x += (mouse.x * 4 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // rebuild edges
      let idx = 0;
      const posArr = edgePositions;
      const colArr = edgeColors;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = nodes[i].pos.distanceTo(nodes[j].pos);
          if (d < MAX_DIST) {
            const t = 1 - d / MAX_DIST;
            const col = warmA.clone().lerp(warmB, t);

            posArr[idx * 6 + 0] = nodes[i].pos.x;
            posArr[idx * 6 + 1] = nodes[i].pos.y;
            posArr[idx * 6 + 2] = nodes[i].pos.z;
            posArr[idx * 6 + 3] = nodes[j].pos.x;
            posArr[idx * 6 + 4] = nodes[j].pos.y;
            posArr[idx * 6 + 5] = nodes[j].pos.z;

            const alpha = t * 0.55;
            colArr[idx * 6 + 0] = col.r * alpha;
            colArr[idx * 6 + 1] = col.g * alpha;
            colArr[idx * 6 + 2] = col.b * alpha;
            colArr[idx * 6 + 3] = col.r * alpha;
            colArr[idx * 6 + 4] = col.g * alpha;
            colArr[idx * 6 + 5] = col.b * alpha;
            idx++;
          } else if (idx < maxEdges) {
            // zero out unused slots
            posArr[idx * 6]     = 0; posArr[idx * 6 + 1] = 0; posArr[idx * 6 + 2] = 0;
            posArr[idx * 6 + 3] = 0; posArr[idx * 6 + 4] = 0; posArr[idx * 6 + 5] = 0;
          }
        }
      }

      edgeGeo.attributes.position.needsUpdate = true;
      edgeGeo.attributes.color.needsUpdate = true;
      edgeGeo.setDrawRange(0, idx * 2);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      edgeGeo.dispose();
      nodeGeo.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    />
  );
}
