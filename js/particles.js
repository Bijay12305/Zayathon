/**
 * ZAYATHON 2026 - Premium 3D Cinematic Background Engine
 * Features:
 * - 3D Holographic "Z" Central Geometric Sculpture
 * - 3D Digital Neural Network with Live Dynamic Connecting Edges
 * - Floating Sci-Fi Polyhedra & Tech Rings at Periphery (Framing Hero Text)
 * - Infinite 3D Perspective Digital Grid Floor
 * - Atmospheric Multi-Depth Space Dust Field
 * - Dynamic Lighting (Cyber Cyan + Electric Violet + Soft Specular)
 * - Real-Time Theme & Mode Reactivity (Cyan, Violet, Emerald, Dark/Light)
 * - Smooth Mouse Parallax (Lerp Damped) & Scroll-Driven Depth
 * - Viewport Visibility Observer (0% GPU/CPU when scrolled away)
 * - Accessibility (prefers-reduced-motion) & Mobile Optimization
 * - Graceful 3D Perspective Projection Canvas Fallback if Three.js CDN is offline
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  // Theme & Color Management
  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-mode') === 'light';
    const theme = document.documentElement.getAttribute('data-theme') || 'cyan';

    if (theme === 'violet') {
      return {
        primary: isLight ? 0x9333ea : 0xa855f7,
        secondary: 0xec4899,
        accent: 0x6366f1,
        grid: isLight ? 0xc084fc : 0x7e22ce,
        fog: isLight ? 0xf3e8ff : 0x07050f,
        particles: 0xc084fc,
        zGlow: 0xa855f7
      };
    }

    if (theme === 'emerald') {
      return {
        primary: isLight ? 0x059669 : 0x00ff88,
        secondary: 0x06b6d4,
        accent: 0x10b981,
        grid: isLight ? 0x34d399 : 0x065f46,
        fog: isLight ? 0xecfdf5 : 0x040d0a,
        particles: 0x34d399,
        zGlow: 0x00ff88
      };
    }

    // Default Cyber Cyan
    return {
      primary: isLight ? 0x0284c7 : 0x00f0ff,
      secondary: 0x8a2be2,
      accent: 0x38bdf8,
      grid: isLight ? 0x38bdf8 : 0x0f2b48,
      fog: isLight ? 0xf0f9ff : 0x050811,
      particles: 0x00f0ff,
      zGlow: 0x00f0ff
    };
  }

  // ---------------------------------------------------------------------------
  // 1. THREE.JS 3D ENVIRONMENT (Primary Engine)
  // ---------------------------------------------------------------------------
  if (typeof THREE !== 'undefined') {
    initThreeScene();
  } else {
    // Wait slightly for CDN or fall back to high-fidelity 3D projection canvas
    window.addEventListener('load', () => {
      if (typeof THREE !== 'undefined') {
        initThreeScene();
      } else {
        initCanvas3DFallback();
      }
    });
  }

  function initThreeScene() {
    let width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    let height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    // 1. Scene & Fog
    const colors = getThemeColors();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.fog, 0.014);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);

    // 3. WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL init failed, using 3D canvas fallback:', e);
      initCanvas3DFallback();
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2035, 1.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(colors.primary, 2.8, 120);
    cyanLight.position.set(-30, 25, 20);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(colors.secondary, 2.4, 120);
    violetLight.position.set(30, -20, 15);
    scene.add(violetLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 40, 40);
    scene.add(dirLight);

    // Root Group for interactive mouse parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // -------------------------------------------------------------------------
    // A. Futuristic 3D "Z" Holographic Structure
    // -------------------------------------------------------------------------
    const zGroup = new THREE.Group();
    zGroup.position.set(0, 1.5, -28); // Positioned in background behind text
    worldGroup.add(zGroup);

    // Create 3D Polygonal Z Path Shape
    const zShape = new THREE.Shape();
    zShape.moveTo(-10, 12);
    zShape.lineTo(10, 12);
    zShape.lineTo(10, 8.5);
    zShape.lineTo(-3.5, -7.5);
    zShape.lineTo(10, -7.5);
    zShape.lineTo(10, -12);
    zShape.lineTo(-10, -12);
    zShape.lineTo(-10, -8.5);
    zShape.lineTo(3.5, 7.5);
    zShape.lineTo(-10, 7.5);
    zShape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 2.5,
      bevelEnabled: true,
      bevelThickness: 0.8,
      bevelSize: 0.6,
      bevelOffset: 0,
      bevelSegments: 3
    };

    const zGeo = new THREE.ExtrudeGeometry(zShape, extrudeSettings);
    zGeo.center();

    // Semi-translucent faceted core
    const zMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x071124,
      emissive: colors.primary,
      emissiveIntensity: 0.22,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.65,
      clearcoat: 0.6,
      wireframe: false
    });
    const zMesh = new THREE.Mesh(zGeo, zMaterial);
    zGroup.add(zMesh);

    // Glowing futuristic wireframe cage on the Z
    const zEdges = new THREE.EdgesGeometry(zGeo, 24);
    const zLineMaterial = new THREE.LineBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5
    });
    const zWireframe = new THREE.LineSegments(zEdges, zLineMaterial);
    zGroup.add(zWireframe);

    // Orbiting cyber ring around Z
    const zRingGeo = new THREE.TorusGeometry(18, 0.12, 16, 64);
    const zRingMat = new THREE.MeshBasicMaterial({
      color: colors.secondary,
      transparent: true,
      opacity: 0.45,
      wireframe: true
    });
    const zRing = new THREE.Mesh(zRingGeo, zRingMat);
    zRing.rotation.x = Math.PI / 3;
    zGroup.add(zRing);

    // -------------------------------------------------------------------------
    // B. 3D Digital Neural Network (Connected Nodes & Dynamic Lines)
    // -------------------------------------------------------------------------
    const networkGroup = new THREE.Group();
    worldGroup.add(networkGroup);

    const nodeCount = isMobile ? 35 : 65;
    const nodePositions = [];
    const nodeVelocities = [];
    const maxDistance = isMobile ? 14 : 17;
    const boundary = { x: 38, y: 22, z: 20 };

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * boundary.x * 2;
      const y = (Math.random() - 0.5) * boundary.y * 2;
      const z = (Math.random() - 0.5) * boundary.z * 2 - 5;
      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.02
        )
      );
    }

    // Node Points Material & Geometry
    const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
    
    // Create glowing point canvas texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.85)');
    grad.addColorStop(0.7, 'rgba(138, 43, 226, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);
    const pointTexture = new THREE.CanvasTexture(pCanvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colors.primary
    });
    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    networkGroup.add(nodePoints);

    // Dynamic Connection Lines
    const maxLineCount = nodeCount * 8;
    const linePositions = new Float32Array(maxLineCount * 6);
    const lineColors = new Float32Array(maxLineCount * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    networkGroup.add(lineSegments);

    // -------------------------------------------------------------------------
    // C. Floating 3D Geometric Sculptures (Outer Margins)
    // -------------------------------------------------------------------------
    const polyGroup = new THREE.Group();
    worldGroup.add(polyGroup);

    const geometricObjects = [];

    // Helper for geometric elements
    function addFloatingPoly(geo, x, y, z, color, scale = 1, speedRot = { x: 0.005, y: 0.007 }) {
      const meshMat = new THREE.MeshStandardMaterial({
        color: 0x0a1226,
        emissive: color,
        emissiveIntensity: 0.25,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.55
      });
      const mesh = new THREE.Mesh(geo, meshMat);
      
      const wireMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.65 });
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 15), wireMat);
      mesh.add(wire);

      mesh.position.set(x, y, z);
      mesh.scale.setScalar(scale);
      polyGroup.add(mesh);

      geometricObjects.push({
        mesh: mesh,
        baseY: y,
        speedRot: speedRot,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.015 + Math.random() * 0.01
      });
    }

    // 1. Top-Left Icosahedron
    addFloatingPoly(new THREE.IcosahedronGeometry(3.6, 0), -29, 14, -6, colors.primary, 1, { x: 0.004, y: 0.006 });

    // 2. Top-Right Tech Concentric Rings
    const ringParent = new THREE.Group();
    ringParent.position.set(29, 13, -8);
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.08, 16, 48), new THREE.MeshBasicMaterial({ color: colors.secondary, wireframe: true, transparent: true, opacity: 0.7 }));
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.06, 16, 36), new THREE.MeshBasicMaterial({ color: colors.primary, wireframe: true, transparent: true, opacity: 0.8 }));
    r1.rotation.x = Math.PI / 4;
    r2.rotation.y = Math.PI / 3;
    ringParent.add(r1);
    ringParent.add(r2);
    polyGroup.add(ringParent);
    geometricObjects.push({
      mesh: ringParent,
      baseY: 13,
      speedRot: { x: 0.006, y: 0.009 },
      floatPhase: 1.2,
      floatSpeed: 0.018
    });

    // 3. Bottom-Left Hexagonal Cylinder Panel
    addFloatingPoly(new THREE.CylinderGeometry(3.2, 3.2, 0.8, 6), -30, -13, -10, colors.accent, 1, { x: 0.005, y: 0.004 });

    // 4. Bottom-Right Crystal Octahedron
    addFloatingPoly(new THREE.OctahedronGeometry(3.4, 0), 28, -12, -7, colors.secondary, 1, { x: 0.007, y: 0.005 });

    // 5. Additional small floating tech cubes
    if (!isMobile) {
      addFloatingPoly(new THREE.BoxGeometry(2.2, 2.2, 2.2), -22, 19, -15, colors.primary, 0.9, { x: 0.008, y: 0.006 });
      addFloatingPoly(new THREE.DodecahedronGeometry(2.4, 0), 24, -18, -14, colors.primary, 0.85, { x: 0.006, y: 0.008 });
    }

    // -------------------------------------------------------------------------
    // D. 3D Infinite Perspective Digital Grid Floor
    // -------------------------------------------------------------------------
    const gridGroup = new THREE.Group();
    worldGroup.add(gridGroup);

    const gridHelper = new THREE.GridHelper(160, 48, colors.primary, colors.grid);
    gridHelper.position.set(0, -20, -10);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.38;
    gridHelper.material.depthWrite = false;
    gridGroup.add(gridHelper);

    // -------------------------------------------------------------------------
    // E. Atmospheric 3D Data Dust Cloud (Multi-Depth)
    // -------------------------------------------------------------------------
    const dustCount = isMobile ? 90 : 220;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 110;
      dustPos[i + 1] = (Math.random() - 0.5) * 70;
      dustPos[i + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 1.4,
      map: pointTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colors.particles
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    worldGroup.add(dustField);

    // -------------------------------------------------------------------------
    // F. Interactive Mouse Parallax & Smooth Damping
    // -------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let isHeroVisible = true;

    function onMouseMove(e) {
      if (isMobile || prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = nx * 0.45;
      mouse.targetY = ny * 0.35;
    }

    function onScroll() {
      scrollY = window.scrollY || window.pageYOffset;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Intersection Observer to pause when hero is scrolled out of view
    const heroEl = document.getElementById('hero') || canvas.parentElement;
    if (heroEl && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(heroEl);
    }

    // Resize Handler
    function onResize() {
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // Dynamic Theme Color Observer
    const themeObserver = new MutationObserver(() => {
      const c = getThemeColors();
      scene.fog.color.setHex(c.fog);
      cyanLight.color.setHex(c.primary);
      violetLight.color.setHex(c.secondary);
      zMaterial.emissive.setHex(c.primary);
      zLineMaterial.color.setHex(c.primary);
      zRingMat.color.setHex(c.secondary);
      nodeMaterial.color.setHex(c.primary);
      dustMat.color.setHex(c.particles);
      gridHelper.material.color.setHex(c.grid);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });

    // -------------------------------------------------------------------------
    // G. Animation Render Loop
    // -------------------------------------------------------------------------
    let clock = new THREE.Clock();
    let animId;

    function renderLoop() {
      animId = requestAnimationFrame(renderLoop);

      if (!isHeroVisible) return; // 0% GPU when hero is offscreen

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Mouse Lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!prefersReducedMotion) {
        // Camera smooth cinematic drift + parallax
        camera.position.x = mouse.x * 6 + Math.sin(elapsedTime * 0.3) * 0.6;
        camera.position.y = mouse.y * 4 + Math.cos(elapsedTime * 0.25) * 0.4 - scrollY * 0.02;
        camera.lookAt(0, 0, -12);

        // Rotate central 3D Z
        zGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.22 + mouse.x * 0.35;
        zGroup.rotation.x = Math.cos(elapsedTime * 0.35) * 0.12 - mouse.y * 0.25;
        zGroup.position.y = 1.5 + Math.sin(elapsedTime * 0.8) * 0.8;
        zRing.rotation.z += 0.008;

        // Animate Floating Polyhedra
        for (let i = 0; i < geometricObjects.length; i++) {
          const obj = geometricObjects[i];
          obj.mesh.rotation.x += obj.speedRot.x;
          obj.mesh.rotation.y += obj.speedRot.y;
          obj.mesh.position.y = obj.baseY + Math.sin(elapsedTime * 1.2 + obj.floatPhase) * 1.1;
        }

        // Move Digital Grid forward smoothly (warp speed perspective)
        gridHelper.position.z = ((elapsedTime * 4) % 3.33) - 10;

        // Animate 3D Neural Nodes & Dynamic Edge Lines
        let lineIdx = 0;
        const posAttr = nodeGeometry.attributes.position;

        for (let i = 0; i < nodeCount; i++) {
          const p = nodePositions[i];
          const v = nodeVelocities[i];

          p.add(v);

          if (Math.abs(p.x) > boundary.x) v.x *= -1;
          if (Math.abs(p.y) > boundary.y) v.y *= -1;
          if (p.z > boundary.z || p.z < -boundary.z - 10) v.z *= -1;

          // Connect nearby 3D nodes
          for (let j = i + 1; j < nodeCount; j++) {
            const p2 = nodePositions[j];
            const dist = p.distanceTo(p2);

            if (dist < maxDistance && lineIdx < maxLineCount * 6) {
              const alpha = 1 - dist / maxDistance;
              
              // Node 1
              linePositions[lineIdx] = p.x;
              linePositions[lineIdx + 1] = p.y;
              linePositions[lineIdx + 2] = p.z;
              lineColors[lineIdx] = 0.0;
              lineColors[lineIdx + 1] = 0.94 * alpha;
              lineColors[lineIdx + 2] = 1.0 * alpha;

              // Node 2
              linePositions[lineIdx + 3] = p2.x;
              linePositions[lineIdx + 4] = p2.y;
              linePositions[lineIdx + 5] = p2.z;
              lineColors[lineIdx + 3] = 0.54 * alpha;
              lineColors[lineIdx + 4] = 0.27 * alpha;
              lineColors[lineIdx + 5] = 0.9 * alpha;

              lineIdx += 6;
            }
          }
        }

        posAttr.copyVector3sArray(nodePositions);
        posAttr.needsUpdate = true;

        lineGeometry.setDrawRange(0, lineIdx / 3);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        // Rotate space dust field slowly
        dustField.rotation.y = elapsedTime * 0.015;
        dustField.rotation.x = elapsedTime * 0.008;
      }

      renderer.render(scene, camera);
    }

    renderLoop();
  }

  // ---------------------------------------------------------------------------
  // 2. HIGH-FIDELITY 3D PERSPECTIVE CANVAS FALLBACK (If Three.js is Offline)
  // ---------------------------------------------------------------------------
  function initCanvas3DFallback() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init3DPoints();
    }

    class Point3D {
      constructor() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * 800 + 100;
        this.baseZ = this.z;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.z < 80) this.z = 800;
        if (this.z > 800) this.z = 80;
      }

      project() {
        const fov = 400;
        const scale = fov / (fov + this.z);
        return {
          x: width / 2 + (this.x + mouse.x * 50) * scale,
          y: height / 2 + (this.y + mouse.y * 50) * scale,
          scale: scale,
          z: this.z
        };
      }
    }

    function init3DPoints() {
      particles = [];
      const count = isMobile ? 40 : 80;
      for (let i = 0; i < count; i++) {
        particles.push(new Point3D());
      }
    }

    function drawPerspectiveGrid(colors) {
      const horizonY = height * 0.68;
      const fov = 280;

      ctx.save();
      ctx.strokeStyle = `rgba(${colors.primary === 0x00f0ff ? '0, 240, 255' : '168, 85, 247'}, 0.2)`;
      ctx.lineWidth = 1;

      // Perspective vanishing lines
      const lineCount = 18;
      for (let i = -lineCount; i <= lineCount; i++) {
        const xBottom = width / 2 + (i * (width / lineCount) * 1.8) + mouse.x * 60;
        ctx.beginPath();
        ctx.moveTo(width / 2 + mouse.x * 20, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal depth scanlines
      for (let d = 1; d <= 8; d++) {
        const y = horizonY + Math.pow(d / 8, 2.2) * (height - horizonY);
        const alpha = (d / 8) * 0.32;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const colors = getThemeColors();
      drawPerspectiveGrid(colors);

      const projected = [];
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        projected.push(particles[i].project());
      }

      // Draw 3D Connective Lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130 * p1.scale) {
            const alpha = (1 - dist / (130 * p1.scale)) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1 * p1.scale;
            ctx.stroke();
          }
        }
      }

      // Draw 3D Node Spheres
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const r = Math.max(1.2, 3.5 * p.scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + 0.6 * p.scale})`;
        ctx.shadowBlur = 12 * p.scale;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    resize();
    animate();
  }
})();
