import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function makeBrushed() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1800; i++) {
    const v = (100 + Math.random() * 80) | 0;
    g.fillStyle = `rgba(${v},${v},${v},${0.15 + Math.random() * 0.25})`;
    g.fillRect(0, Math.random() * 512, 512 * (0.3 + Math.random() * 0.7), 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.anisotropy = 4;
  return tex;
}

export default function DoorScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // нет WebGL — остаётся фото-фон
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.style.cssText = "display:block;width:100%;height:100%";
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.2, 9.5);
    camera.lookAt(0, 0, 0);

    // Свет + тени
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    key.shadow.camera.left = -4; key.shadow.camera.right = 4;
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.PointLight(0xffd9d0, 25, 0, 2);
    rim.position.set(-3.5, 1.5, -2.5);
    scene.add(rim);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // PBR-материалы
    const brushed = makeBrushed();
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xb9bec4, metalness: 1, roughness: 0.7, roughnessMap: brushed, bumpMap: brushed, bumpScale: 0.5 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b2d31, metalness: 0.9, roughness: 0.4 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0xa3a8ae, metalness: 1, roughness: 0.55, roughnessMap: brushed });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, metalness: 0.5, roughness: 0.35 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1, roughness: 0.12 });

    const door = new THREE.Group();
    scene.add(door);
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      door.add(m);
      return m;
    };

    // Коробка (4 бруса) + полотно
    add(new THREE.BoxGeometry(0.2, 3.8, 0.32), frameMat, -1.1, 0, 0);
    add(new THREE.BoxGeometry(0.2, 3.8, 0.32), frameMat, 1.1, 0, 0);
    add(new THREE.BoxGeometry(2.4, 0.2, 0.32), frameMat, 0, 1.8, 0);
    add(new THREE.BoxGeometry(2.4, 0.2, 0.32), frameMat, 0, -1.8, 0);
    add(new THREE.BoxGeometry(1.94, 3.36, 0.12), leafMat, 0, 0, 0);

    // Штампованные панели с двух сторон
    for (const z of [0.075, -0.075]) {
      add(new THREE.BoxGeometry(1.5, 1.15, 0.03), panelMat, 0, 0.8, z);
      add(new THREE.BoxGeometry(1.5, 1.15, 0.03), panelMat, 0, -0.75, z);
    }
    // Красная табличка
    add(new THREE.BoxGeometry(0.62, 0.2, 0.02), redMat, 0, 1.42, 0.085);

    // Заклёпки (InstancedMesh)
    const rivets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 12, 8), chrome, 30);
    const m4 = new THREE.Matrix4();
    let ri = 0;
    for (const x of [-0.84, 0.84]) {
      for (let k = 0; k < 15; k++) {
        m4.setPosition(x, -1.5 + k * (3 / 14), 0.07);
        rivets.setMatrixAt(ri++, m4);
      }
    }
    rivets.castShadow = true;
    door.add(rivets);

    // Ручка «антипаника»
    const bar = add(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 20), chrome, 0, -0.05, 0.2);
    bar.rotation.z = Math.PI / 2;
    add(new THREE.BoxGeometry(0.08, 0.1, 0.12), chrome, -0.6, -0.05, 0.13);
    add(new THREE.BoxGeometry(0.08, 0.1, 0.12), chrome, 0.6, -0.05, 0.13);
    add(new THREE.BoxGeometry(0.3, 0.5, 0.03), chrome, 0.7, -0.6, 0.085);

    // Петли
    for (const y of [1.2, 0, -1.2]) {
      add(new THREE.CylinderGeometry(0.07, 0.07, 0.3, 20), chrome, -0.98, y, 0.17);
    }

    // Размер / видимость / рендер-цикл
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    };

    const tgt = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let t = 0, last = 0, raf = 0, running = false, inView = false;

    const update = (dt: number) => {
      const k = 1 - Math.exp(-dt * 4);
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      door.rotation.y = Math.sin(t * 0.35) * 0.75 + cur.x * 0.45;
      door.rotation.x = cur.y * 0.16;
      door.position.y = Math.sin(t * 0.9) * 0.05;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      update(dt);
      renderer.render(scene, camera);
    };
    const start = () => {
      if (running || !inView || document.hidden || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.01 });
    io.observe(el);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    if (reduce) { door.rotation.y = -0.4; renderer.render(scene, camera); }

    // Мышь
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tgt.x = (e.clientX / window.innerWidth - 0.5) * 2;
      tgt.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Наклон телефона (iOS требует разрешение по жесту)
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tgt.x = Math.max(-1, Math.min(1, e.gamma / 30));
      tgt.y = Math.max(-1, Math.min(1, (e.beta - 60) / 30));
    };
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    const askTilt = () => {
      if (typeof DOE.requestPermission === "function") {
        DOE.requestPermission().then((s) => { if (s === "granted") window.addEventListener("deviceorientation", onTilt); }).catch(() => undefined);
      }
    };
    if (mobile) {
      if (typeof DOE.requestPermission === "function") window.addEventListener("pointerdown", askTilt, { once: true });
      else window.addEventListener("deviceorientation", onTilt);
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", askTilt);
      window.removeEventListener("deviceorientation", onTilt);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      [leafMat, frameMat, panelMat, redMat, chrome].forEach((m) => m.dispose());
      brushed.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return <div ref={host} role="img" aria-label="Трёхмерная модель противопожарной двери" className="pointer-events-none absolute inset-0" />;
}
