import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Floating 3-D food-particle background
   - Tori  (doughnut shapes)
   - Spheres
   - Icosahedra
   All drift in amber / orange / warm-cream tones.
───────────────────────────────────────────── */

const PALETTE = [
  0xf59e0b, // amber-400
  0xf97316, // orange-500
  0xfbbf24, // amber-300
  0xfde68a, // amber-200
  0xd97706, // amber-600
  0xea580c, // orange-600
  0xfef3c7, // amber-50  (very light cream)
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildParticles(count) {
  const meshes = [];

  for (let i = 0; i < count; i++) {
    /* pick geometry */
    const r = Math.random();
    let geometry;
    if (r < 0.35) {
      // torus — doughnut
      geometry = new THREE.TorusGeometry(
        0.45 + Math.random() * 0.35,
        0.12 + Math.random() * 0.1,
        16,
        60
      );
    } else if (r < 0.65) {
      // icosahedron — spiky gem
      geometry = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.25, 0);
    } else {
      // sphere
      geometry = new THREE.SphereGeometry(0.25 + Math.random() * 0.2, 32, 32);
    }

    const material = new THREE.MeshStandardMaterial({
      color: randomFrom(PALETTE),
      roughness: 0.35,
      metalness: 0.25,
      transparent: true,
      opacity: 0.55 + Math.random() * 0.35,
    });

    const mesh = new THREE.Mesh(geometry, material);

    /* random start position spread across the full viewport */
    mesh.position.set(
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12 - 4
    );

    /* random rotation & drift speed */
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.012,
      rotY: (Math.random() - 0.5) * 0.015,
      rotZ: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.0003 + Math.random() * 0.0006,
      floatOffset: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.002,
      driftY: (Math.random() - 0.5) * 0.0015,
      baseY: mesh.position.y,
      baseX: mesh.position.x,
    };

    meshes.push(mesh);
  }

  return meshes;
}

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f0f0f, 0.04);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 10;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    /* ── Lights ── */
    const ambient = new THREE.AmbientLight(0xfff8e7, 0.7);
    scene.add(ambient);

    const point1 = new THREE.PointLight(0xf59e0b, 3, 40);
    point1.position.set(-8, 6, 5);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xea580c, 2, 30);
    point2.position.set(8, -5, 3);
    scene.add(point2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 10, 8);
    scene.add(dirLight);

    /* ── Particles ── */
    const particles = buildParticles(55);
    particles.forEach((m) => scene.add(m));

    /* ── Tiny star-dust points ── */
    const starGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 60;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* ── Mouse parallax ── */
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Animation loop ── */
    let frameId;
    let t = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      t += 1;

      /* gentle camera parallax */
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      /* animate each shape */
      particles.forEach((mesh) => {
        const d = mesh.userData;

        mesh.rotation.x += d.rotX;
        mesh.rotation.y += d.rotY;
        mesh.rotation.z += d.rotZ;

        /* sinusoidal float */
        mesh.position.y =
          d.baseY + Math.sin(t * d.floatSpeed * 60 + d.floatOffset) * 1.1;
        mesh.position.x =
          d.baseX + Math.cos(t * d.floatSpeed * 40 + d.floatOffset) * 0.5;
      });

      /* slowly orbit point lights */
      const lt = t * 0.008;
      point1.position.x = Math.cos(lt) * 10;
      point1.position.z = Math.sin(lt) * 8;
      point2.position.x = -Math.cos(lt * 0.7) * 9;
      point2.position.z = -Math.sin(lt * 0.7) * 7;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Resize ── */
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
      particles.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
