import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Stars,
  useScroll,
  Points,
  PointMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { useScroll as useFramerScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { Bloom, EffectComposer, ChromaticAberration, Glitch, Scanline } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import CyberCharacter from './three/CyberCharacter';

// Create cinematic fog
const createFog = (color, near, far) => new THREE.Fog(color, near, far);

// ===================== CYBERPUNK COMPONENTS =====================

function NeonGrid() {
  const gridRef = useRef();
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, '#1e293b', '#0f172a']}
      position={[0, -2, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function NeonDataRain({ count = 500, focusMode, velocityFactor }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const vel = velocityFactor.get();
    for (let i = 0; i < count; i++) {
      ref.current.geometry.attributes.position.array[i * 3 + 1] -= (0.05 + vel * 0.2);
      if (ref.current.geometry.attributes.position.array[i * 3 + 1] < -5) {
        ref.current.geometry.attributes.position.array[i * 3 + 1] = 15;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={points}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={focusMode ? 0.8 : 0.4}
      />
    </Points>
  );
}

function CyberRings({ focusMode, clickPulse }) {
  return (
    <group position={[0, 0, -2]}>
      <CyberRing radius={2} color="#00ffff" speed={1} visible={focusMode} />
      <CyberRing radius={2.5} color="#ff00ff" speed={-0.8} visible={focusMode} />
      <CyberRing radius={3} color="#00ff88" speed={0.5} visible={focusMode} />

      {/* Decorative floating bits */}
      <group>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 3;
          return (
            <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.5} rotationIntensity={0.3}>
              <mesh
                position={[Math.cos(angle) * r, Math.sin(i * 1.5) * 0.4, Math.sin(angle) * r]}
                rotation={[i, i * 0.5, 0]}
              >
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                  emissive={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                  emissiveIntensity={focusMode ? 3 : 1}
                  transparent
                  opacity={focusMode ? 0.8 : 0.3}
                />
              </mesh>
            </Float>
          );
        })}
      </group>
    </group>
  );
}

function CyberRing({ radius, color, speed, visible }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      ref.current.material.opacity = THREE.MathUtils.lerp(
        ref.current.material.opacity,
        visible ? 0.6 : 0.15,
        0.05
      );
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 16, 80]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ===================== CYBERPUNK BLOBS =====================
function CyberBlob({ position, colorValue, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) {
  const mesh = useRef(null);
  const mouse = useThree((state) => state.mouse);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      const targetY = focusMode ? position[1] * 0.5 : position[1] + Math.sin(time * speed) * 0.3;
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);

      // Update color from MotionValue
      mesh.current.material.color.set(colorValue.get());
      mesh.current.material.emissive.set(colorValue.get());

      // Interactive mouse follow - subtle sway towards mouse
      const targetRotX = mouse.y * (focusMode ? 0.8 : 0.4);
      const targetRotY = mouse.x * (focusMode ? 0.8 : 0.4);
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotX, 0.08);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetRotY, 0.08);

      const scl = (1 + (focusMode ? 0.5 : 0)) * (focusMode ? 1.3 : 1) * (clickPulse ? 1.4 : 1);
      const str = 1 + velocityFactor.get() * 0.3;
      mesh.current.scale.set(
        THREE.MathUtils.lerp(mesh.current.scale.x, scl, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.y, scl * str, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.z, scl, 0.1)
      );
      const td = focusMode ? distort + 0.6 : distort + velocityFactor.get() * 0.8 + (clickPulse ? 1.2 : 0);
      mesh.current.material.distort = THREE.MathUtils.lerp(mesh.current.material.distort, td, 0.1);
      mesh.current.material.opacity = THREE.MathUtils.lerp(
        mesh.current.material.opacity,
        focusMode || clickPulse ? 0.35 : 0.12,
        0.1
      );
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[radius, 4]} />
        <MeshDistortMaterial
          speed={speed * (focusMode ? 2 : 1)}
          distort={distort}
          radius={radius}
          transparent
          opacity={0.12}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ===================== FLOATING LIGHT BEAMS =====================
function LightBeams({ focusMode }) {
  const beams = useMemo(() => {
    const configs = [];
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ff3366', '#6633ff'];
    for (let i = 0; i < 8; i++) {
      configs.push({
        position: [(Math.random() - 0.5) * 20, 3, -8 + (Math.random() - 0.5) * 15],
        color: colors[Math.floor(Math.random() * colors.length)],
        height: 8 + Math.random() * 10,
      });
    }
    return configs;
  }, []);

  return (
    <group>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position}>
          <cylinderGeometry args={[0.01, 0.15, beam.height, 6, 1, true]} />
          <meshBasicMaterial
            color={beam.color}
            transparent
            opacity={focusMode ? 0.06 : 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ===================== MAIN EXPERIENCE =====================
const Experience3D = () => {
  const { camera, mouse } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollYProgress } = useFramerScroll();

  // Create persistent references for things that change per frame
  const scrollProgress = useMemo(() => ({ get: () => scrollYProgress.get() }), [scrollYProgress]);

  const { scrollY } = useFramerScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { stiffness: 50, damping: 20 });
  const velFactor = useMemo(() => ({ get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1) }), [smoothVelocity]);

  // Color mapping based on scroll - returns MotionValues
  const lightColor1 = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['#00ffff', '#3b82f6', '#8b5cf6', '#ec4899', '#00ffff']);
  const lightColor2 = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['#ff00ff', '#2dd4bf', '#6366f1', '#f43f5e', '#ff00ff']);

  const pLight1 = useRef();
  const pLight2 = useRef();

  useEffect(() => {
    const target = globalThis;
    const h = (e) => {
      // Small state updates for focus are okay as they are discrete events, not per-frame
      setFocus(prev => ({ active: e.detail.focus, pulse: e.detail.click || prev.pulse }));
      if (e.detail.click) setTimeout(() => setFocus(p => ({ ...p, pulse: false })), 800);
    };
    target.addEventListener('ui-focus', h);
    return () => target.removeEventListener('ui-focus', h);
  }, []);

  useFrame(() => {
    const sp = scrollYProgress.get();

    // Update light colors directly via ref to avoid re-renders
    if (pLight1.current) {
      pLight1.current.color.set(lightColor1.get());
    }
    if (pLight2.current) {
      pLight2.current.color.set(lightColor2.get());
    }

    // === CINEMATIC CAMERA ===
    let targetZ, targetY, targetRotX, targetFov;

    if (sp < 0.2) {
      targetZ = 6 - (sp / 0.2) * 1;
      targetY = 0.5 + (sp / 0.2) * 0.3;
      targetRotX = -0.05 - (sp / 0.2) * 0.05;
      targetFov = 72 + (sp / 0.2) * 3;
    } else if (sp < 0.45) {
      const t = (sp - 0.2) / 0.25;
      targetZ = 5 - t * 1;
      targetY = 0.8 + Math.sin(t * Math.PI) * 0.5;
      targetRotX = -0.1 + Math.sin(t * Math.PI) * 0.05;
      targetFov = 75 + Math.sin(t * Math.PI) * 5;
    } else if (sp < 0.7) {
      const t = (sp - 0.45) / 0.25;
      targetZ = 4 - t * 0.5 + Math.sin(t * Math.PI) * 0.3;
      targetY = 1.0 - t * 0.3;
      targetRotX = -0.05 - t * 0.1;
      targetFov = 78 + Math.sin(t * Math.PI) * 8;
    } else {
      const t = (sp - 0.7) / 0.3;
      targetZ = 4.5 + t * 1.5;
      targetY = 0.5 - t * 0.5;
      targetRotX = -0.15 + t * 0.15;
      targetFov = 76 - t * 4;
    }

    const vel = velFactor.get();
    const velShake = vel * 0.15;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (focus.pulse ? 3 : (focus.active ? targetZ - 0.5 : targetZ)) + velShake, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.03);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (sp < 0.5 ? -0.05 : 0.05) + mouse.x * 0.1, 0.02);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov + vel * 15 + (focus.pulse ? 25 : 0), 0.08);
    camera.updateProjectionMatrix();
  });

  const fog = useMemo(() => createFog('#020617', 8, 25), []);

  const cyberBlobs = useMemo(() => [
    { pos: [-4, 2, -3], colorValue: lightColor1, s: 1.5, d: 0.4, r: 1.5 },
    { pos: [4, -3, -4], colorValue: lightColor2, s: 1, d: 0.5, r: 2 },
    { pos: [2, 4, -5], colorValue: { get: () => '#00ff88' }, s: 1.2, d: 0.3, r: 1.2 },
    { pos: [0, 0, -6], colorValue: { get: () => '#ff3366' }, s: 0.8, d: 0.5, r: 4 },
  ], [lightColor1, lightColor2]);

  return (
    <>
      <primitive object={fog} attach="fog" />

      <ambientLight args={['#ffffff', focus.active ? 0.15 : 0.08]} />
      <pointLight ref={pLight1} args={['#00ffff', focus.active ? 3 : 1.5]} position={[8, 8, 5]} distance={30} />
      <pointLight ref={pLight2} args={['#ff00ff', focus.active ? 2.5 : 1.2]} position={[-8, 5, 3]} distance={30} />
      <pointLight args={['#ff3366', focus.active ? 2 : 0.8]} position={[0, -3, 8]} distance={25} />
      <spotLight args={['#6633ff', focus.active ? 2.5 : 1]} position={[0, 15, -5]} angle={0.4} penumbra={1} distance={45} />

      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0.5} fade speed={0.5} />
      <NeonGrid />
      <NeonDataRain count={1000} focusMode={focus.active} velocityFactor={velFactor} />

      {cyberBlobs.map((b, i) => (
        <CyberBlob
          key={i}
          position={b.pos}
          colorValue={b.colorValue}
          speed={b.s}
          distort={b.d}
          radius={b.r}
          focusMode={focus.active}
          velocityFactor={velFactor}
          clickPulse={focus.pulse}
        />
      ))}

      <CyberRings focusMode={focus.active} clickPulse={focus.pulse} />
      <LightBeams focusMode={focus.active} />

      <CyberCharacter scrollProgress={scrollProgress} />

      <EffectComposer>
        <Bloom
          intensity={focus.active ? 2.2 : 1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(
            focus.active || focus.pulse ? 0.0015 : 0.0004,
            focus.active || focus.pulse ? 0.0015 : 0.0004
          )}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Glitch
          delay={[2, 4]}
          duration={[0.1, 0.3]}
          strength={[0.1, 0.3]}
          mode={GlitchMode.SPORADIC}
          active={focus.pulse || velFactor.get() > 0.5}
          ratio={0.85}
        />
        <Scanline
           blendFunction={BlendFunction.OVERLAY}
           density={1.5}
           opacity={0.05}
        />
      </EffectComposer>
    </>
  );
};

export default Experience3D;
