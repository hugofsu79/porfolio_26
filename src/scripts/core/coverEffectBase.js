import * as THREE from "three";

export function coverFx() {
    const root = document.querySelector("[data-cover-fx]");
    if (!root) return;

    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    if (isTouch) {
      const img = root.querySelector("img");
      const canvas = root.querySelector("canvas");
      canvas.style.display = "none";
      img.style.visibility = "visible";
      return;
    }

    const img = root.querySelector("img");
    const canvas = root.querySelector("canvas");

    let lastMouse = new THREE.Vector2(0.5, 0.5);
    let velocity = 0;
    let scrollFactor = 1;

    /* =========================
       RENDERER
    ========================= */

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* =========================
       SCENE / CAMERA
    ========================= */

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 20);
    camera.position.z = 1;

    /* =========================
       TEXTURE
    ========================= */

    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;

    /* =========================
       UNIFORMS
    ========================= */

    const uniforms = {
        uTexture: { value: texture },
        uHover: { value: 2 },
        uHoverTarget: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uZoom: { value: 0 },
        uZoomTarget: { value: 0 },
        uVelocity: { value: 0 },
        uVelocityTarget: { value: 0 },
    };

    /* =========================
       GEOMETRY / MATERIAL
    ========================= */

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uZoom;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    /* =========================
       ZOOM CENTRÉ SUR LA SOURIS
    ========================= */
    float zoomStrength = 0.08 * uZoom;
    uv = (uv - uMouse) * (1.0 - zoomStrength) + uMouse;

    /* =========================
       MOUSE PULL DISTORTION
    ========================= */
    float dist = distance(uv, uMouse);
    float pull = (1.0 - smoothstep(0.0, 0.5, dist)) * (0.05 + uVelocity * 0.3) * uHover;
    vec2 direction = normalize(uMouse - uv);
    uv += direction * pull;

    /* =========================
       CHROMATIC ABERRATION
    ========================= */
    float chroma = (0.004 + uVelocity * 0.15) * uHover;

    uv = clamp(uv, 0.001, 0.999);

    float r = texture2D(uTexture, uv + vec2(chroma, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(chroma, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /* =========================
       RESIZE (cover behavior)
    ========================= */

    function resize() {
        const rect = root.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        renderer.setSize(rect.width, rect.height, false);

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const boxAspect = rect.width / rect.height;

        texture.repeat.set(
            boxAspect > imgAspect ? 1 : imgAspect / boxAspect,
            boxAspect > imgAspect ? boxAspect / imgAspect : 1
        );

        texture.offset.set(
            (1 - texture.repeat.x) / 2,
            (1 - texture.repeat.y) / 2
        );

        texture.needsUpdate = true;
    }

    /* =========================
       RENDER LOOP
    ========================= */

    function render(time) {
        uniforms.uTime.value = time * 0.01;

        uniforms.uHover.value +=
            (uniforms.uHoverTarget.value * scrollFactor - uniforms.uHover.value) * 0.09;

        uniforms.uZoom.value +=
            (uniforms.uZoomTarget.value * scrollFactor - uniforms.uZoom.value) * 0.06;

        uniforms.uVelocity.value +=
          (uniforms.uVelocityTarget.value - uniforms.uVelocity.value) * 0.15;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    /* =========================
       EVENTS
    ========================= */

    if (img.complete) {
        resize();
        render();
    } else {
        img.addEventListener("load", () => {
            resize();
            render();
        });
    }

    root.addEventListener("mouseenter", () => {
        uniforms.uHoverTarget.value = 1;
        uniforms.uZoomTarget.value = 1;
    });

    root.addEventListener("mouseleave", () => {
        uniforms.uHoverTarget.value = 0;
        uniforms.uZoomTarget.value = 0;
    });

    root.addEventListener("mousemove", (e) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      const current = new THREE.Vector2(x, y);
      velocity = current.distanceTo(lastMouse);
      lastMouse.copy(current);

      uniforms.uMouse.value.copy(current);
      uniforms.uVelocityTarget.value = velocity;
    });

    window.addEventListener("scroll", () => {
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // 1 = visible, 0 = hors écran
      const progress = 1 - Math.min(Math.max(-rect.top / viewportH, 0), 1);
      scrollFactor = progress;
    });

    window.addEventListener("resize", resize);
}