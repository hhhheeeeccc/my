import React, { useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import * as THREE from 'three';
import ParticleField from './three/ParticleField';
import InteractiveBlob from './three/InteractiveBlob';
import { BLOBS_CONFIG } from '../../utils/constants.jsx';
import { createColor, createFog } from '../../utils/three-utils';

const Experience3D = () => {
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY } = useScroll();
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

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, focus.pulse ? 3 : (focus.active ? 4 : 5), 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, focus.active ? -0.1 : 0, 0.05);
    camera.fov = THREE.MathUtils.lerp(camera.fov, 75 + velFactor.get() * 20 + (focus.pulse ? 25 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  const bg = useMemo(() => createColor('#020617'), []);
  const fog = useMemo(() => createFog('#020617', 5, 15), []);

  return (
    <>
      <primitive object={bg} attach="background" />
      <primitive object={fog} attach="fog" />
      <ambientLight args={['#ffffff', focus.active ? 0.6 : 0.4]} />
      <pointLight args={['#3b82f6', focus.active ? 2 : 1]} position={[10, 10, 10]} />
      <spotLight args={['#6366f1', focus.active ? 2 : 1]} position={[-10, 10, 10]} angle={0.15} penumbra={1} />
      <ParticleField count={800} focusMode={focus.active} velocityFactor={velFactor} />
      {BLOBS_CONFIG.map((b, i) => (
        <InteractiveBlob key={i} position={b.pos} color={focus.active ? b.col[0] : b.col[1]} speed={b.s} distort={b.d} radius={b.r} focusMode={focus.active} velocityFactor={velFactor} clickPulse={focus.pulse} />
      ))}
    </>
  );
};

export default Experience3D;
