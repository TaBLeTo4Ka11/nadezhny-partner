import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function makeBrushedTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  ctx.fillStyle = "#85898d";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i += 1) {
    const shade = 105 + Math.random() * 75;
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${0.08 + Math.random() * 0.18})`;
    ctx.fillRect(0, Math.random() * 512, 512, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.anisotropy = 8;
  return texture;
}

function roundedPanel(width: number, height: number, depth: number, radius = 0.045) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 8,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function makeLabel(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "rgba(18, 22, 27, .88)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 34px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 24, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.9, 0.48, 1);
  sprite.renderOrder = 20;
  return { sprite, texture, material };
}

export default function DoorScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const canvas = renderer.domElement;
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;outline:none";
    canvas.setAttribute("aria-label", "Интерактивная трёхмерная модель металлической противопожарной двери. Коснитесь, чтобы показать устройство.");
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = environment;
    scene.environmentIntensity = 1.15;

    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 60);
    camera.position.set(0.15, 0.1, 8.4);

    const keyLight = new THREE.DirectionalLight(0xfff4e8, 3.1);
    keyLight.position.set(-3.5, 5.5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(coarsePointer ? 1536 : 2048, coarsePointer ? 1536 : 2048);
    keyLight.shadow.camera.left = -3.8;
    keyLight.shadow.camera.right = 3.8;
    keyLight.shadow.camera.top = 4.8;
    keyLight.shadow.camera.bottom = -4.8;
    keyLight.shadow.bias = -0.00025;
    keyLight.shadow.normalBias = 0.025;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcbdcff, 1.65);
    fillLight.position.set(4, 1.5, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffd0bd, 42, 12, 2);
    rimLight.position.set(-3.2, 1.2, -2.8);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.05;
    floor.receiveShadow = true;
    scene.add(floor);

    const brushed = makeBrushedTexture();
    const steel = new THREE.MeshStandardMaterial({
      color: 0xb9bec4,
      metalness: 0.92,
      roughness: 0.34,
      roughnessMap: brushed,
      bumpMap: brushed,
      bumpScale: 0.018,
      envMapIntensity: 1.35,
    });
    const frameSteel = new THREE.MeshStandardMaterial({
      color: 0x34383d,
      metalness: 0.88,
      roughness: 0.39,
      envMapIntensity: 1.2,
    });
    const insulation = new THREE.MeshStandardMaterial({
      color: 0xc6bca7,
      metalness: 0,
      roughness: 0.94,
    });
    const edgeSteel = new THREE.MeshStandardMaterial({
      color: 0x858b92,
      metalness: 0.94,
      roughness: 0.27,
      envMapIntensity: 1.4,
    });
    const darkHardware = new THREE.MeshStandardMaterial({
      color: 0x24282c,
      metalness: 0.78,
      roughness: 0.3,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: 0xd8dde1,
      metalness: 1,
      roughness: 0.19,
      envMapIntensity: 1.65,
    });
    const sealMaterial = new THREE.MeshStandardMaterial({
      color: 0x202326,
      metalness: 0,
      roughness: 0.86,
    });

    const assembly = new THREE.Group();
    scene.add(assembly);
    const frameGroup = new THREE.Group();
    const leafGroup = new THREE.Group();
    const coreGroup = new THREE.Group();
    const hardwareGroup = new THREE.Group();
    assembly.add(frameGroup, leafGroup, coreGroup, hardwareGroup);

    const addBox = (
      parent: THREE.Group,
      width: number,
      height: number,
      depth: number,
      material: THREE.Material,
      position: [number, number, number],
      bevel = false,
    ) => {
      const geometry = bevel
        ? roundedPanel(width, height, depth)
        : new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Глубокая стальная коробка: лицевая полка, возвратный профиль и притвор.
    const frameDepth = 0.48;
    addBox(frameGroup, 0.16, 3.82, frameDepth, frameSteel, [-1.08, 0, -0.02], true);
    addBox(frameGroup, 0.16, 3.82, frameDepth, frameSteel, [1.08, 0, -0.02], true);
    addBox(frameGroup, 2.32, 0.16, frameDepth, frameSteel, [0, 1.83, -0.02], true);
    addBox(frameGroup, 2.32, 0.12, frameDepth, frameSteel, [0, -1.85, -0.02], true);
    addBox(frameGroup, 0.07, 3.52, 0.18, edgeSteel, [-0.94, 0, -0.28]);
    addBox(frameGroup, 0.07, 3.52, 0.18, edgeSteel, [0.94, 0, -0.28]);
    addBox(frameGroup, 1.88, 0.07, 0.18, edgeSteel, [0, 1.72, -0.28]);

    // Уплотнение по внутреннему периметру коробки.
    addBox(frameGroup, 0.025, 3.38, 0.035, sealMaterial, [-0.965, 0, 0.19]);
    addBox(frameGroup, 0.025, 3.38, 0.035, sealMaterial, [0.965, 0, 0.19]);
    addBox(frameGroup, 1.92, 0.025, 0.035, sealMaterial, [0, 1.68, 0.19]);

    // Полотно и отдельные наружные стальные обкладки.
    addBox(leafGroup, 1.91, 3.48, 0.115, edgeSteel, [0, -0.02, 0], true);
    addBox(leafGroup, 1.86, 3.43, 0.022, steel, [0, -0.02, 0.073], true);
    addBox(leafGroup, 1.86, 3.43, 0.022, steel, [0, -0.02, -0.073], true);

    // Минеральная вата показана отдельным внутренним слоем для режима разборки.
    addBox(coreGroup, 1.76, 3.30, 0.11, insulation, [0, -0.02, -0.02], true);
    for (const y of [1.53, -1.56]) {
      addBox(coreGroup, 1.72, 0.035, 0.13, edgeSteel, [0, y, -0.02]);
    }
    for (const x of [-0.84, 0.84]) {
      addBox(coreGroup, 0.035, 3.15, 0.13, edgeSteel, [x, -0.02, -0.02]);
    }

    // Профилированные рёбра на полотне дают читаемую глубину металла.
    for (const x of [-0.72, 0.72]) {
      addBox(leafGroup, 0.025, 3.12, 0.018, edgeSteel, [x, -0.02, 0.09]);
    }
    addBox(leafGroup, 1.42, 0.025, 0.018, edgeSteel, [0, 1.43, 0.09]);
    addBox(leafGroup, 1.42, 0.025, 0.018, edgeSteel, [0, -1.47, 0.09]);

    // Петли с картами, цилиндрическими бочонками и крепёжными элементами.
    for (const y of [1.18, 0, -1.18]) {
      addBox(hardwareGroup, 0.105, 0.36, 0.025, darkHardware, [-0.99, y, 0.13], true);
      addBox(hardwareGroup, 0.105, 0.36, 0.025, chrome, [-0.91, y, 0.16], true);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 32), chrome);
      barrel.position.set(-0.95, y, 0.2);
      barrel.castShadow = true;
      hardwareGroup.add(barrel);
      for (const offset of [-0.12, 0.12]) {
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.012, 16), chrome);
        screw.rotation.x = Math.PI / 2;
        screw.position.set(-0.99, y + offset, 0.151);
        hardwareGroup.add(screw);
      }
    }

    // Корпус замка, цилиндр, накладки и ручка.
    addBox(hardwareGroup, 0.28, 0.46, 0.11, darkHardware, [0.72, -0.04, 0.17], true);
    addBox(hardwareGroup, 0.11, 0.32, 0.025, chrome, [0.72, -0.04, 0.24], true);
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.045, 32), chrome);
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.set(0.72, -0.18, 0.27);
    hardwareGroup.add(cylinder);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.022, 12, 32, Math.PI), chrome);
    handle.rotation.z = Math.PI;
    handle.position.set(0.72, 0.08, 0.29);
    hardwareGroup.add(handle);
    addBox(hardwareGroup, 0.08, 0.32, 0.12, darkHardware, [0.72, -0.04, -0.12], true);

    // Аккуратные крепёжные головки вдоль кромок.
    const rivetGeometry = new THREE.SphereGeometry(0.018, 16, 12);
    for (const x of [-0.86, 0.86]) {
      for (let i = 0; i < 13; i += 1) {
        const rivet = new THREE.Mesh(rivetGeometry, chrome);
        rivet.position.set(x, -1.48 + i * 0.243, 0.09);
        rivet.scale.set(1, 1, 0.38);
        leafGroup.add(rivet);
      }
    }

    // Выносимые подписи проявляются только после расхождения деталей.
    const labels = [
      { text: "Стальной лист", position: [-1.55, 1.35, 0.72] as [number, number, number] },
      { text: "Минеральная вата", position: [1.42, 0.72, 0.72] as [number, number, number] },
      { text: "Противопожарный замок", position: [1.55, -0.65, 0.72] as [number, number, number] },
      { text: "Стальная коробка", position: [-1.5, -1.35, -0.55] as [number, number, number] },
    ].map(({ text, position }) => {
      const label = makeLabel(text);
      if (!label) return null;
      label.sprite.position.set(...position);
      assembly.add(label.sprite);
      return label;
    }).filter((label): label is NonNullable<typeof label> => label !== null);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 6.2;
    controls.maxDistance = 11;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, -0.02, 0);
    controls.enabled = !coarsePointer;
    controls.update();

    let gyroEnabled = false;
    let permissionRequested = false;
    let exploded = false;
    let explodeProgress = 0;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let inView = false;
    let running = false;
    const targetRotation = new THREE.Vector2(0, 0);
    const currentRotation = new THREE.Vector2(0, 0);
    const defaultRotation = new THREE.Euler(0, 0, 0);

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (!gyroEnabled || event.gamma == null || event.beta == null) return;
      targetRotation.x = THREE.MathUtils.clamp((event.beta - 45) / 38, -0.48, 0.48);
      targetRotation.y = THREE.MathUtils.clamp(event.gamma / 34, -0.62, 0.62);
    };

    const enableMouseControls = () => {
      gyroEnabled = false;
      controls.enabled = true;
      controls.update();
      invalidate();
    };

    const requestGyroscope = () => {
      if (!coarsePointer || permissionRequested) return;
      permissionRequested = true;
      const orientationApi = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof orientationApi.requestPermission === "function") {
        orientationApi.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              gyroEnabled = true;
              controls.enabled = false;
              window.addEventListener("deviceorientation", onOrientation, { passive: true });
            } else {
              enableMouseControls();
            }
            invalidate();
          })
          .catch(enableMouseControls);
      } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", onOrientation, { passive: true });
        gyroEnabled = true;
        controls.enabled = false;
        invalidate();
      } else {
        enableMouseControls();
      }
    };

    const onFirstGesture = () => {
      requestGyroscope();
      if (!exploded) {
        exploded = true;
        invalidate();
      }
    };
    canvas.addEventListener("pointerdown", onFirstGesture, { once: true });
    controls.addEventListener("change", invalidate);

    const resize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      invalidate();
    };

    const updateExploded = (dt: number) => {
      const target = exploded ? 1 : 0;
      const stiffness = 8.5;
      const damping = 5.8;
      const velocity = (target - explodeProgress) * stiffness;
      explodeProgress = THREE.MathUtils.clamp(explodeProgress + velocity * dt * (1 - Math.min(damping * dt, 0.75)), 0, 1);
      const p = THREE.MathUtils.smoothstep(explodeProgress, 0.02, 0.98);
      frameGroup.position.z = -0.48 * p;
      leafGroup.position.z = 0.72 * p;
      coreGroup.position.z = 0.18 + 0.42 * p;
      hardwareGroup.position.x = 0.58 * p;
      hardwareGroup.position.z = 0.28 * p;
      labels.forEach(({ material }) => {
        material.opacity = THREE.MathUtils.smoothstep(explodeProgress, 0.58, 0.9);
      });
      return Math.abs(target - explodeProgress) > 0.002;
    };

    function invalidate() {
      if (!running && inView && !document.hidden) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      elapsed += dt;

      if (!gyroEnabled && !controls.enabled && !reducedMotion) controls.enabled = true;
      if (gyroEnabled) {
        currentRotation.x += (targetRotation.x - currentRotation.x) * (1 - Math.exp(-dt * 3.2));
        currentRotation.y += (targetRotation.y - currentRotation.y) * (1 - Math.exp(-dt * 3.2));
        assembly.rotation.x = currentRotation.x;
        assembly.rotation.y = currentRotation.y;
      } else if (!controls.enabled) {
        assembly.rotation.copy(defaultRotation);
      }

      if (!reducedMotion && !gyroEnabled && !controls.enabled) {
        assembly.rotation.y = Math.sin(elapsed * 0.28) * 0.035;
      }
      const animating = updateExploded(dt);
      controls.update();
      renderer.render(scene, camera);

      if (!inView || document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!animating && !controls.enableDamping && !gyroEnabled) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const start = () => {
      if (running || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    }, { threshold: 0.02 });
    observer.observe(el);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    // После разрешения гироскоп остаётся главным источником управления;
    // до первого жеста на сенсорном экране доступно вращение через OrbitControls.
    if (!coarsePointer) controls.enabled = true;
    if (reducedMotion) {
      assembly.rotation.y = -0.12;
      renderer.render(scene, camera);
    } else {
      invalidate();
    }

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("deviceorientation", onOrientation);
      controls.removeEventListener("change", invalidate);
      controls.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      labels.forEach(({ texture, material }) => {
        texture.dispose();
        material.dispose();
      });
      [steel, frameSteel, insulation, edgeSteel, darkHardware, chrome, sealMaterial].forEach((material) => material.dispose());
      brushed.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      role="img"
      aria-label="Интерактивная 3D-модель металлической противопожарной двери"
      className="pointer-events-auto absolute inset-0 cursor-grab active:cursor-grabbing"
    />
  );
}
