import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text, Stars } from '@react-three/drei';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Scanline, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { createFog } from '../../utils/three-utils';
import CyberCharacter from './three/CyberCharacter';

// ===================== NEON DATA RAIN =====================
function NeonDataRain({ count = 1500, focusMode, velocityFactor }) {
  const meshRef = useRef(null);

  const particles = useMemo(() => {
    const temp = [];
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffffff', '#ff3366'];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 25 - 10,
          (Math.random() - 0.5) * 30
        ),
        speed: 0.3 + Math.random() * 1.5,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const speedMult = focusMode ? 2 : 1;
    particles.forEach((p, i) => {
      p.position.y -= p.speed * 0.04 * speedMult;
      if (p.position.y < -10) {
        p.position.y = 15;
      }
      dummy.position.copy(p.position);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.015, 0.25, 0.015]} />
      <meshBasicMaterial transparent opacity={0.4} />
    </instancedMesh>
  );
}

// ===================== NEON GRID =====================
function NeonGrid() {
  return (
    <gridHelper
      args={[100, 50, '#06b6d4', '#1e293b']}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
    >
      <meshBasicMaterial transparent opacity={0.05} wireframe />
    </gridHelper>
  );
}

// ===================== CYBER RINGS =====================
function CyberRings({ focusMode, clickPulse }) {
  return (
    <group position={[0, 0, -5]}>
      <CyberRing radius={2} color="#00ffff" speed={0.5} visible={focusMode} />
      <CyberRing radius={2.2} color="#ff00ff" speed={-0.3} visible={focusMode} />
      <CyberRing radius={2.5} color="#00ff88" speed={0.4} visible={focusMode} />

      {/* Floating data fragments */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
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
function CyberBlob({ position, color, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) {
  const mesh = useRef(null);
  const mouse = useThree((state) => state.mouse);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      const targetY = focusMode ? position[1] * 0.5 : position[1] + Math.sin(time * speed) * 0.3;
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);
      const rotFactor = focusMode ? 0.8 : 0.2;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * rotFactor, 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * rotFactor, 0.1);
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
      <mesh ref={mesh} args={[undefined, 64, 64]} position={position}>
        <icosahedronGeometry args={[radius, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={focusMode ? 1.5 : 0.5}
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
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY, scrollYProgress } = useScroll();
  const scrollProgress = useMemo(() => ({ get: () => scrollYProgress.get() }), [scrollYProgress]);
  const smoothVelocity = useSpring(useVelocity(scrollY), { stiffness: 50, damping: 20 });
  const velFactor = useMemo(() => ({ get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1) }), [smoothVelocity]);

  useEffect(() => {
    const target = globalThis;
    const h = (e) => {
      setFocus(prev => ({ active: e.detail.focus, pulse: e.detail.click || prev.pulse }));
      if (e.detail.click) setTimeout(() => setFocus(p => ({ ...p, pulse: false })), 800);
    };
    target.addEventListener('ui-focus', h);
    return () => target.removeEventListener('ui-focus', h);
  }, []);

  useFrame((state) => {
    const sp = scrollYProgress.get();

    // === CINEMATIC CAMERA ===
    let targetZ, targetY, targetRotX, targetFov;

    if (sp < 0.2) {
      const t = sp / 0.2;
      targetZ = 6 - t * 1;
      targetY = 0.5 + t * 0.3;
      targetRotX = -0.05 - t * 0.05;
      targetFov = 72 + t * 3;
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

    // Velocity shake
    const vel = velFactor.get();
    const velShake = vel * 0.15;

    const mouseShiftX = (state.viewport?.width || 1) * 0.05 * (state.mouse.x);
    const mouseShiftY = (state.viewport?.height || 1) * 0.05 * (state.mouse.y);

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (focus.pulse ? 3 : (focus.active ? targetZ - 0.5 : targetZ)) + velShake, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + mouseShiftY, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseShiftX, 0.05);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX - mouseShiftY * 0.05, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (sp < 0.5 ? -0.05 : 0.05) + mouseShiftX * 0.05, 0.04);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov + vel * 25 + (focus.pulse ? 30 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  const fog = useMemo(() => createFog('#020617', 8, 25), []);

  const cyberBlobs = [
    { pos: [-4, 2, -3], col: '#00ffff', s: 1.5, d: 0.4, r: 1.5 },
    { pos: [4, -3, -4], col: '#ff00ff', s: 1, d: 0.5, r: 2 },
    { pos: [2, 4, -5], col: '#00ff88', s: 1.2, d: 0.3, r: 1.2 },
    { pos: [0, 0, -6], col: '#ff3366', s: 0.8, d: 0.5, r: 4 },
  ];

  return (
    <>
      <primitive object={fog} attach="fog" />
      <ambientLight args={['#ffffff', focus.active ? 0.15 : 0.08]} />
      <pointLight args={['#00ffff', focus.active ? 2.5 : 1]} position={[8, 8, 5]} distance={25} />
      <pointLight args={['#ff00ff', focus.active ? 2 : 0.8]} position={[-8, 5, 3]} distance={25} />
      <pointLight args={['#ff3366', focus.active ? 1.5 : 0.5]} position={[0, -3, 8]} distance={20} />
      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0.5} fade speed={0.5} />
      <NeonGrid />
      <NeonDataRain count={1200} focusMode={focus.active} velocityFactor={velFactor} />
      {cyberBlobs.map((b, i) => (
        <CyberBlob
          key={i}
          position={b.pos}
          color={b.col}
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
      <pointLight args={['#00ffff', 0.8, 8]} position={[1.5, 2, 1]} distance={10} />
      <CyberCharacter scrollProgress={scrollProgress} />

      <EffectComposer>
        <Bloom
          intensity={focus.active ? 1.8 : 1.0}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(
            focus.active ? 0.0008 : 0.0002,
            focus.active ? 0.0008 : 0.0002
          )}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Glitch
          delay={new THREE.Vector2(1.5, 3.5)}
          duration={new THREE.Vector2(0.6, 1.0)}
          strength={new THREE.Vector2(0.1, 0.3)}
          mode={1}
          active={focus.active || velFactor.get() > 0.5}
          ratio={0.85}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY}
          density={1.2}
          opacity={0.05}
        />
        <Noise
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.08}
        />
      </EffectComposer>
    </>
  );
};

export default Experience3D;
