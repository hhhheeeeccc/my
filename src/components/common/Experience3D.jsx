import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Scanline, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { createFog, getSecureRandom } from '../../utils/three-utils';
import CyberCharacter from './three/CyberCharacter';
import InteractiveBlob from './three/InteractiveBlob';
import gsap from 'gsap';

const COLORS = ['#00ffff', '#ff00ff', '#00ff88', '#ffffff', '#ff3366'];

function NeonDataRain({ focusMode }) {
  const meshRef = useRef(null);
  const particles = useMemo(() => Array.from({ length: 1000 }, () => ({
    pos: new THREE.Vector3((getSecureRandom() - 0.5) * 30, getSecureRandom() * 25 - 10, (getSecureRandom() - 0.5) * 30),
    speed: 0.3 + getSecureRandom() * 1.5,
    color: new THREE.Color(COLORS[Math.floor(getSecureRandom() * COLORS.length)]),
  })), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const mult = focusMode ? 2 : 1;
    particles.forEach((p, i) => {
      p.pos.y -= p.speed * 0.04 * mult;
      if (p.pos.y < -10) p.pos.y = 15;
      dummy.position.copy(p.pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (<instancedMesh ref={meshRef} args={[null, null, 1000]}><boxGeometry args={[0.015, 0.25, 0.015]} /><meshBasicMaterial transparent opacity={0.4} /></instancedMesh>);
}

function CyberRings({ focusMode }) {
  const frags = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i, angle: (i / 6) * Math.PI * 2, r: 3, speed: 1.5 + i * 0.2, col: i % 2 === 0 ? COLORS[0] : COLORS[1]
  })), []);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const op = (r, v) => { if (r.current) r.current.material.opacity = THREE.MathUtils.lerp(r.current.material.opacity, v ? 0.6 : 0.15, 0.05); };
    if (ref1.current) { ref1.current.rotation.x = t * 0.15; ref1.current.rotation.y = t * 0.25; }
    if (ref2.current) { ref2.current.rotation.x = t * -0.09; ref2.current.rotation.y = t * -0.15; }
    op(ref1, focusMode); op(ref2, focusMode);
  });
  return (
    <group position={[0, 0, -5]}>
      <mesh ref={ref1}><torusGeometry args={[2, 0.015, 16, 80]} /><meshStandardMaterial color={COLORS[0]} emissive={COLORS[0]} emissiveIntensity={2} transparent opacity={0.15} /></mesh>
      <mesh ref={ref2}><torusGeometry args={[2.2, 0.015, 16, 80]} /><meshStandardMaterial color={COLORS[1]} emissive={COLORS[1]} emissiveIntensity={2} transparent opacity={0.15} /></mesh>
      {frags.map((f) => (<motion.group key={f.id}><mesh position={[Math.cos(f.angle) * f.r, Math.sin(f.id * 1.5) * 0.4, Math.sin(f.angle) * f.r]} rotation={[f.id, f.id * 0.5, 0]}><boxGeometry args={[0.1, 0.1, 0.1]} /><meshStandardMaterial color={f.col} emissive={f.col} emissiveIntensity={focusMode ? 3 : 1} transparent opacity={focusMode ? 0.8 : 0.3} /></mesh></motion.group>))}
    </group>
  );
}

const Experience3D = () => {
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY, scrollYProgress } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { stiffness: 50, damping: 20 });
  const velFactor = useMemo(() => ({ get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1) }), [smoothVelocity]);

  useEffect(() => {
    const h = (e) => {
      setFocus(p => ({ active: e.detail.focus, pulse: e.detail.click || p.pulse }));
      if (e.detail.click) gsap.delayedCall(0.8, () => setFocus(p => ({ ...p, pulse: false })));
    };
    window.addEventListener('ui-focus', h);
    return () => { window.removeEventListener('ui-focus', h); gsap.killDelayedCallsTo(setFocus); };
  }, []);

  const blobs = useMemo(() => [{ pos: [-4, 2, -3], col: COLORS[0], s: 1.5, d: 0.4, r: 1.5 }, { pos: [4, -3, -4], col: COLORS[1], s: 1, d: 0.5, r: 2 }, { pos: [2, 4, -5], col: COLORS[2], s: 1.2, d: 0.3, r: 1.2 }, { pos: [0, 0, -6], col: COLORS[4], s: 0.8, d: 0.5, r: 4 }], []);
  const beams = useMemo(() => Array.from({ length: 8 }, () => ({ pos: [(getSecureRandom() - 0.5) * 20, 3, -8 + (getSecureRandom() - 0.5) * 15], col: COLORS[Math.floor(getSecureRandom() * COLORS.length)], h: 8 + getSecureRandom() * 10 })), []);

  useFrame((s) => {
    const sp = scrollYProgress.get();
    let { z, y, rx, fv } = { z: 6, y: 0.5, rx: -0.05, fv: 72 };
    if (sp < 0.2) { const t = sp / 0.2; z -= t; y += t * 0.3; rx -= t * 0.05; fv += t * 3; }
    else if (sp < 0.45) { const t = (sp - 0.2) / 0.25; z = 5 - t; y = 0.8 + Math.sin(t * Math.PI) * 0.5; rx = -0.1 + Math.sin(t * Math.PI) * 0.05; fv = 75 + Math.sin(t * Math.PI) * 5; }
    else if (sp < 0.7) { const t = (sp - 0.45) / 0.25; z = 4 - t * 0.5 + Math.sin(t * Math.PI) * 0.3; y = 1.0 - t * 0.3; rx = -0.05 - t * 0.1; fv = 78 + Math.sin(t * Math.PI) * 8; }
    else { const t = (sp - 0.7) / 0.3; z = 4.5 + t * 1.5; y = 0.5 - t * 0.5; rx = -0.15 + t * 0.15; fv = 76 - t * 4; }

    let fZ = focus.pulse ? 3 : (focus.active ? z - 0.5 : z);
    fZ += velFactor.get() * 0.15;
    const msX = (s.viewport?.width || 1) * 0.05 * s.mouse.x;
    const msY = (s.viewport?.height || 1) * 0.05 * s.mouse.y;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, fZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y + msY, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, msX, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, rx - msY * 0.05, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (sp < 0.5 ? -0.05 : 0.05) + msX * 0.05, 0.04);
    camera.fov = THREE.MathUtils.lerp(camera.fov, fv + velFactor.get() * 25 + (focus.pulse ? 30 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <primitive object={useMemo(() => createFog('#020617', 8, 25), [])} attach="fog" />
      <ambientLight args={['#ffffff', focus.active ? 0.15 : 0.08]} />
      {[[8,8,5,COLORS[0]], [-8,5,3,COLORS[1]], [0,-3,8,COLORS[4]]].map((l, i) => <pointLight key={i} args={[l[3], focus.active ? 2 : 1]} position={[l[0], l[1], l[2]]} />)}
      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0.5} fade speed={0.5} />
      <gridHelper args={[100, 50, '#06b6d4', '#1e293b']} position={[0, -1, 0]}><meshBasicMaterial transparent opacity={0.05} wireframe /></gridHelper>
      <NeonDataRain focusMode={focus.active} />
      {blobs.map((b, i) => <InteractiveBlob key={i} position={b.pos} color={b.col} speed={b.s} distort={b.d} radius={b.r} focusMode={focus.active} velocityFactor={velFactor} clickPulse={focus.pulse} />)}
      <CyberRings focusMode={focus.active} />
      <group>{beams.map((b, i) => <mesh key={i} position={b.pos}><cylinderGeometry args={[0.01, 0.15, b.h, 6, 1, true]} /><meshBasicMaterial color={b.col} transparent opacity={focus.active ? 0.06 : 0.02} side={THREE.DoubleSide} /></mesh>)}</group>
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
