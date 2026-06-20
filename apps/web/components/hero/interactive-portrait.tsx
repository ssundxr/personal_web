"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 100);
    camera.position.z = 1;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    // Uniforms
    const uniforms = {
      pointer: { value: new THREE.Vector2(10, 10) },
      pointerDown: { value: 1.0 },
      pointerRadius: { value: 0.35 },
      pointerDuration: { value: 2.5 },
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      aspect: { value: container.clientWidth / container.clientHeight },
    };

    // Framebuffer for blob
    let blobRenderTarget1 = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, {
      format: THREE.RedFormat,
      type: THREE.FloatType,
    });
    let blobRenderTarget2 = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, {
      format: THREE.RedFormat,
      type: THREE.FloatType,
    });

    // Materials and Geometries
    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    const blobMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    blobMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.pointer = uniforms.pointer;
      shader.uniforms.pointerDown = uniforms.pointerDown;
      shader.uniforms.pointerRadius = uniforms.pointerRadius;
      shader.uniforms.pointerDuration = uniforms.pointerDuration;
      shader.uniforms.time = uniforms.time;
      shader.uniforms.aspect = uniforms.aspect;
      shader.uniforms.fbTexture = { value: blobRenderTarget1.texture };
      
      // Store shader reference for updates
      blobMaterial.userData.shader = shader;

      shader.fragmentShader = `
        uniform vec2 pointer;
        uniform float pointerDown;
        uniform float pointerRadius;
        uniform float pointerDuration;
        uniform float time;
        uniform float aspect;
        uniform sampler2D fbTexture;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
          float a = hash(i); float b = hash(i + vec2(1.,0.));
          float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
          return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        vec2 uv = vUv;
        float prevRed = texture2D(fbTexture, uv).r;
        float dTime = 0.016; // Approx delta time
        float red = max(0.0, prevRed - clamp(dTime / pointerDuration, 0.0, 0.05));

        if (pointerDown > 0.5) {
          vec2 aspectUv = uv;
          aspectUv.x *= aspect;
          vec2 aspectPointer = pointer * 0.5 + 0.5;
          aspectPointer.x *= aspect;

          vec2 delta = aspectUv - aspectPointer;
          float dist = length(delta);
          float angle = atan(delta.y, delta.x);

          float noiseVal = noise(vec2(angle * 3.0 + time, time * 0.5));
          float noiseVal2 = noise(vec2(angle * 5.0 - time, time * 0.8));
          float organicRadius = pointerRadius * (0.7 + noiseVal * 0.5 + noiseVal2 * 0.3);

          float blob = 1.0 - smoothstep(organicRadius * 0.8, organicRadius, dist);
          red = clamp(red + blob * 0.5, 0.0, 1.0);
        }

        diffuseColor.r = red;
        diffuseColor.g = 0.0;
        diffuseColor.b = 0.0;
        `
      );
    };

    const blobScene = new THREE.Scene();
    const blobMesh = new THREE.Mesh(planeGeometry, blobMaterial);
    blobScene.add(blobMesh);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    const baseTexture = textureLoader.load("/shyam.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      resize(); // Call resize to calculate planes correctly once loaded
    });
    
    // For overlay, fallback to same image if no overlay provided
    const overlayTexture = textureLoader.load("/shyam.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      resize();
    });

    const baseMaterial = new THREE.MeshBasicMaterial({ map: baseTexture });
    const baseMesh = new THREE.Mesh(planeGeometry, baseMaterial);
    baseMesh.position.z = 0.0;
    scene.add(baseMesh);

    const bgPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    bgPlaneMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blobRenderTarget2.texture };
      shader.uniforms.time = uniforms.time;
      
      bgPlaneMaterial.userData.shader = shader;

      shader.vertexShader = `
        varying vec2 vPosProj;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
        #include <project_vertex>
        vPosProj = (projectionMatrix * modelViewMatrix * vec4(position, 1.0)).xy;
        `
      );

      shader.fragmentShader = `
        uniform sampler2D texBlob;
        uniform float time;
        varying vec2 vPosProj;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
          float a = hash(i); float b = hash(i + vec2(1.,0.));
          float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
          return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
                value += amplitude * noise(p);
                p *= 2.1;
                amplitude *= 0.3;
            }
            return value;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        vec2 screenUv = vPosProj * 0.5 + 0.5;
        float mask = texture2D(texBlob, screenUv).r;
        if (mask < 0.02) discard;

        vec2 uv = screenUv * 3.5;
        vec2 distUv = uv + fbm(uv * 2.0 + time * 0.2) * 0.7;
        float n = fbm(distUv);

        vec3 colorBg = vec3(1.0);
        vec3 colorSoftShape = vec3(0.92);
        vec3 colorLine = vec3(0.8);

        float soft = smoothstep(0.1, 0.9, sin(n * 3.0));
        float line = smoothstep(0.49, 0.51, fract(n * 15.0)) - smoothstep(0.51, 0.53, fract(n * 15.0));

        vec3 color = mix(colorBg, colorSoftShape, soft);
        color = mix(color, colorLine, line);

        diffuseColor = vec4(color, 1.0);
        `
      );
    };
    const bgPlaneMesh = new THREE.Mesh(planeGeometry, bgPlaneMaterial);
    bgPlaneMesh.position.z = 0.05;
    scene.add(bgPlaneMesh);

    const overlayMaterial = new THREE.MeshBasicMaterial({ map: overlayTexture, transparent: true });
    overlayMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blobRenderTarget2.texture };
      
      overlayMaterial.userData.shader = shader;

      shader.vertexShader = `
        varying vec2 vPosProj;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
        #include <project_vertex>
        vPosProj = (projectionMatrix * modelViewMatrix * vec4(position, 1.0)).xy;
        `
      );

      shader.fragmentShader = `
        uniform sampler2D texBlob;
        varying vec2 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        vec2 screenUv = vPosProj * 0.5 + 0.5;
        float mask = texture2D(texBlob, screenUv).r;
        if (mask < 0.02) discard;
        #include <color_fragment>
        diffuseColor.a *= mask;
        `
      );
    };
    const overlayMesh = new THREE.Mesh(planeGeometry, overlayMaterial);
    overlayMesh.position.z = 0.1;
    scene.add(overlayMesh);

    // Event Listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      uniforms.pointer.value.set(x, y);
    };

    const onMouseLeave = () => {
      uniforms.pointer.value.set(10, 10);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(width, height);
      uniforms.aspect.value = width / height;

      blobRenderTarget1.setSize(width, height);
      blobRenderTarget2.setSize(width, height);

      // Fit image logic
      if (baseTexture.image) {
        const imgAspect = baseTexture.image.width / baseTexture.image.height;
        const containerAspect = width / height;

        if (containerAspect > imgAspect) {
          // Fill width
          baseMesh.scale.set(1, containerAspect / imgAspect, 1);
          overlayMesh.scale.set(1, containerAspect / imgAspect, 1);
        } else {
          // Fill height
          baseMesh.scale.set(imgAspect / containerAspect, 1, 1);
          overlayMesh.scale.set(imgAspect / containerAspect, 1, 1);
        }
      }
    };

    window.addEventListener("resize", resize);
    resize();

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      const delta = clock.getDelta();
      uniforms.time.value += delta;

      // Render blob mask
      renderer.setRenderTarget(blobRenderTarget2);
      renderer.render(blobScene, camera);
      renderer.setRenderTarget(null);

      // Swap render targets for feedback loop
      const temp = blobRenderTarget1;
      blobRenderTarget1 = blobRenderTarget2;
      blobRenderTarget2 = temp;
      
      if (blobMaterial.userData.shader) {
          blobMaterial.userData.shader.uniforms.fbTexture.value = blobRenderTarget1.texture;
      }

      // Ensure scene shaders use the latest blob render target
      if (bgPlaneMaterial.userData.shader) {
          bgPlaneMaterial.userData.shader.uniforms.texBlob.value = blobRenderTarget1.texture;
      }
      if (overlayMaterial.userData.shader) {
          overlayMaterial.userData.shader.uniforms.texBlob.value = blobRenderTarget1.texture;
      }

      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
      
      renderer.dispose();
      baseTexture.dispose();
      overlayTexture.dispose();
      planeGeometry.dispose();
      blobMaterial.dispose();
      baseMaterial.dispose();
      bgPlaneMaterial.dispose();
      overlayMaterial.dispose();
      blobRenderTarget1.dispose();
      blobRenderTarget2.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#1a1f1a] cursor-crosshair overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <img
        src="/shyam.jpg"
        alt="Badge"
        className="absolute bottom-4 left-4 z-10 pointer-events-none max-w-[120px] rounded-full w-12 h-12 object-cover border-2 border-white"
      />
    </div>
  );
}
