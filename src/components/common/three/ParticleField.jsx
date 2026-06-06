import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ count = 500, focusMode, velocityFactor }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    let seed = 42;
    const seededRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      p[i * 3] = (seededRandom(seed++) - 0.5) * 20;
      p[i * 3 + 1] = (seededRandom(seed++) - 0.5) * 20;
      p[i * 3 + 2] = (seededRandom(seed++) - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const baseSpeed = focusMode ? 0.08 : 0.02;
    const speed = baseSpeed + velocityFactor.get() * 0.5;
    ref.current.rotation.y = time * speed;
    ref.current.rotation.x = time * (speed * 0.5);

    const scale = focusMode ? 1.2 : 1;
    const stretch = 1 + velocityFactor.get() * 0.2;
    ref.current.scale.set(
      THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1),
      THREE.MathUtils.lerp(ref.current.scale.y, scale * stretch, 0.1),
      THREE.MathUtils.lerp(ref.current.scale.z, scale, 0.1)
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={focusMode ? "#60a5fa" : "#3b82f6"} transparent opacity={focusMode ? 0.6 : 0.3} sizeAttenuation />
    </points>
  );
};

export default ParticleField;
