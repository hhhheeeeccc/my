import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Scanline, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { createFog, getSecureRandom } from '../../utils/three-utils';
import CyberCharacter from './three/CyberCharacter';

const CYBER_COLORS = ['#00ffff', '#ff00ff', '#00ff88', '#ffffff', '#ff3366'];

// ===================== NEON DATA RAIN =====================
function NeonDataRain({ count = 1200, focusMode }) {
  const meshRef = useRef(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3((getSecureRandom() - 0.5) * 30, getSecureRandom() * 25 - 10, (getSecureRandom() - 0.5) * 30),
      speed: 0.3 + getSecureRandom() * 1.5,
      color: new THREE.Color(CYBER_COLORS[Math.floor(getSecureRandom() * CYBER_COLORS.length)]),
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const speedMult = focusMode ? 2 : 1;
    particles.forEach((p, i) => {
      p.position.y -= p.speed * 0.04 * speedMult;
      if (p.position.y < -10) p.position.y = 15;
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

// ===================== CYBER RINGS =====================
function CyberRings({ focusMode }) {
  const fragData = useMemo(() => [...Array(6)].map((_, i) => ({
    angle: (i / 6) * Math.PI * 2,
    r: 3,
    speed: 1.5 + i * 0.2,
    color: i % 2 === 0 ? '#00ffff' : '#ff00ff'
  })), []);

  return (
    <group position={[0, 0, -5]}>
      <CyberRing radius={2} color="#00ffff" speed={0.5} visible={focusMode} />
      <CyberRing radius={2.2} color="#ff00ff" speed={-0.3} visible={focusMode} />
      {fragData.map((f, i) => (
        <Float key={i} speed={f.speed} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh position={[Math.cos(f.angle) * f.r, Math.sin(i * 1.5) * 0.4, Math.sin(f.angle) * f.r]} rotation={[i, i * 0.5, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={focusMode ? 3 : 1} transparent opacity={focusMode ? 0.8 : 0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CyberRing({ radius, color, speed, visible }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, visible ? 0.6 : 0.15, 0.05);
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 16, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.15} />
    </mesh>
  );
}

// ===================== CYBERPUNK BLOBS =====================
function CyberBlob({ position, color, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) {
  const mesh = useRef(null);
  const mouse = useThree((state) => state.mouse);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, focusMode ? position[1] * 0.5 : position[1] + Math.sin(time * speed) * 0.3, 0.05);
    const rf = focusMode ? 0.8 : 0.2;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * rf, 0.1);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * rf, 0.1);

    let scl = 1.0;
    if (focusMode) scl *= 1.9;
    if (clickPulse) scl *= 1.4;

    const str = 1 + velocityFactor.get() * 0.3;
    mesh.current.scale.set(THREE.MathUtils.lerp(mesh.current.scale.x, scl, 0.1), THREE.MathUtils.lerp(mesh.current.scale.y, scl * str, 0.1), THREE.MathUtils.lerp(mesh.current.scale.z, scl, 0.1));
    const td = focusMode ? distort + 0.6 : distort + velocityFactor.get() * 0.8 + (clickPulse ? 1.2 : 0);
    mesh.current.material.distort = THREE.MathUtils.lerp(mesh.current.material.distort, td, 0.1);
    mesh.current.material.opacity = THREE.MathUtils.lerp(mesh.current.material.opacity, focusMode || clickPulse ? 0.35 : 0.12, 0.1);
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[radius, 4]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={focusMode ? 1.5 : 0.5} speed={speed * (focusMode ? 2 : 1)} distort={distort} transparent opacity={0.12} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

// ===================== MAIN EXPERIENCE =====================
const Experience3D = () => {
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY, scrollYProgress } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { stiffness: 50, damping: 20 });
  const velFactor = useMemo(() => ({ get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1) }), [smoothVelocity]);

  useEffect(() => {
    const h = (e) => {
      setFocus(prev => ({ active: e.detail.focus, pulse: e.detail.click || prev.pulse }));
      if (e.detail.click) {
        const t = setTimeout(() => setFocus(p => ({ ...p, pulse: false })), 800);
        return () => clearTimeout(t);
      }
    };
    window.addEventListener('ui-focus', h);
    return () => window.removeEventListener('ui-focus', h);
  }, []);

  useFrame((state) => {
    const sp = scrollYProgress.get();
    let { z, y, rx, fov } = { z: 6, y: 0.5, rx: -0.05, fov: 72 };

    if (sp < 0.2) {
      const t = sp / 0.2;
      z -= t; y += t * 0.3; rx -= t * 0.05; fov += t * 3;
    } else if (sp < 0.45) {
      const t = (sp - 0.2) / 0.25;
      z = 5 - t; y = 0.8 + Math.sin(t * Math.PI) * 0.5; rx = -0.1 + Math.sin(t * Math.PI) * 0.05; fov = 75 + Math.sin(t * Math.PI) * 5;
    } else if (sp < 0.7) {
      const t = (sp - 0.45) / 0.25;
      z = 4 - t * 0.5 + Math.sin(t * Math.PI) * 0.3; y = 1.0 - t * 0.3; rx = -0.05 - t * 0.1; fov = 78 + Math.sin(t * Math.PI) * 8;
    } else {
      const t = (sp - 0.7) / 0.3;
      z = 4.5 + t * 1.5; y = 0.5 - t * 0.5; rx = -0.15 + t * 0.15; fov = 76 - t * 4;
    }

    const vel = velFactor.get();
    let finalZ = focus.pulse ? 3 : (focus.active ? z - 0.5 : z);
    finalZ += vel * 0.15;

    const msX = (state.viewport?.width || 1) * 0.05 * state.mouse.x;
    const msY = (state.viewport?.height || 1) * 0.05 * state.mouse.y;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, finalZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y + msY, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, msX, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, rx - msY * 0.05, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (sp < 0.5 ? -0.05 : 0.05) + msX * 0.05, 0.04);
    camera.fov = THREE.MathUtils.lerp(camera.fov, fov + vel * 25 + (focus.pulse ? 30 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  const cyberBlobs = useMemo(() => [
    { pos: [-4, 2, -3], col: '#00ffff', s: 1.5, d: 0.4, r: 1.5 },
    { pos: [4, -3, -4], col: '#ff00ff', s: 1, d: 0.5, r: 2 },
    { pos: [2, 4, -5], col: '#00ff88', s: 1.2, d: 0.3, r: 1.2 },
    { pos: [0, 0, -6], col: '#ff3366', s: 0.8, d: 0.5, r: 4 },
  ], []);

  return (
    <>
      <primitive object={useMemo(() => createFog('#020617', 8, 25), [])} attach="fog" />
      <ambientLight args={['#ffffff', focus.active ? 0.15 : 0.08]} />
      <pointLight args={['#00ffff', focus.active ? 2.5 : 1]} position={[8, 8, 5]} />
      <pointLight args={['#ff00ff', focus.active ? 2 : 0.8]} position={[-8, 5, 3]} />
      <pointLight args={['#ff3366', focus.active ? 1.5 : 0.5]} position={[0, -3, 8]} />
      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0.5} fade speed={0.5} />
      <gridHelper args={[100, 50, '#06b6d4', '#1e293b']} position={[0, -1, 0]}><meshBasicMaterial transparent opacity={0.05} wireframe /></gridHelper>
      <NeonDataRain focusMode={focus.active} />
      {cyberBlobs.map((b, i) => <CyberBlob key={i} {...b} speed={b.s} distort={b.d} radius={b.r} focusMode={focus.active} velocityFactor={velFactor} clickPulse={focus.pulse} />)}
      <CyberRings focusMode={focus.active} />
      <CyberCharacter scrollProgress={useMemo(() => ({ get: () => scrollYProgress.get() }), [scrollYProgress])} />
      <EffectComposer>
        <Bloom intensity={focus.active ? 1.8 : 1.0} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[focus.active ? 0.0008 : 0.0002, focus.active ? 0.0008 : 0.0002]} radialModulation modulationOffset={0.5} />
        <Glitch delay={[1.5, 3.5]} duration={[0.6, 1.0]} strength={[0.1, 0.3]} mode={1} active={focus.active || velFactor.get() > 0.5} ratio={0.85} />
        <Scanline blendFunction={BlendFunction.OVERLAY} density={1.2} opacity={0.05} />
        <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.08} />
      </EffectComposer>
    </>
  );
};

export default Experience3D;
