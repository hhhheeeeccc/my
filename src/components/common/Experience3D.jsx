import React, { useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import * as THREE from 'three';
import ParticleField from './three/ParticleField';
import InteractiveBlob from './three/InteractiveBlob';
import { BLOBS_CONFIG } from '../../utils/constants';

const Experience3D = () => {
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { stiffness: 50, damping: 20 });
  const velFactor = useMemo(() => ({ get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1) }), [smoothVelocity]);

  useEffect(() => {
    const h = (e) => {
      setFocus(prev => ({ active: e.detail.focus, pulse: e.detail.click || prev.pulse }));
      if (e.detail.click) setTimeout(() => setFocus(p => ({ ...p, pulse: false })), 800);
    };
    window.addEventListener('ui-focus', h);
    return () => window.removeEventListener('ui-focus', h);
  }, []);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, focus.pulse ? 3 : (focus.active ? 4 : 5), 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, focus.active ? -0.1 : 0, 0.05);
    camera.fov = THREE.MathUtils.lerp(camera.fov, 75 + velFactor.get() * 10 + (focus.pulse ? 15 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <color attach="background" args={['#020617']} /><fog attach="fog" args={['#020617', 5, 15]} />
      <ambientLight intensity={focus.active ? 0.6 : 0.4} /><pointLight position={[10, 10, 10]} intensity={focus.active ? 2 : 1} color="#3b82f6" /><spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={focus.active ? 2 : 1} color="#6366f1" />
      <ParticleField count={800} focusMode={focus.active} velocityFactor={velFactor} />
      {BLOBS_CONFIG.map((b, i) => <InteractiveBlob key={i} position={b.pos} color={focus.active ? b.col[0] : b.col[1]} speed={b.s} distort={b.d} radius={b.r} focusMode={focus.active} velocityFactor={velFactor} clickPulse={focus.pulse} />)}
    </>
  );
};

export default Experience3D;
