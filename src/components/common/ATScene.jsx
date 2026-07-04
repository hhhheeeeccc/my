import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const getSecureValues = (count) => {
  const array = new Uint32Array(count);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < count; i++) array[i] = i * 98765;
  }
  return Array.from(array).map(v => v / 4294967296);
};

const HyperEnvironment = ({ count = 4000 }) => {
  const pointsRef = useRef(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const actualCount = isMobile ? 1500 : count;

  const particles = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const randoms = getSecureValues(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      const r = 20 + randoms[i*3] * 60;
      const theta = 2 * Math.PI * randoms[i*3+1];
      const phi = Math.acos(2 * randoms[i*3+2] - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [actualCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.z = t * 0.3;
    // Deep float effect
    pointsRef.current.position.y = Math.sin(t * 2) * 2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={actualCount} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const ATScene = () => {
  const { camera, mouse } = useThree();
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const lookAtVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    if (!camera) return;
    // Immersive 360 look-around: mouse creates deep rotation & parallax
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, -mouse.x * Math.PI * 0.4, 0.03);
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouse.y * Math.PI * 0.2, 0.03);
    camera.rotation.copy(targetRotation.current);

    // Slight position parallax for depth
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.y * 2, 0.03);
  });

  return (
    <>
      <color attach="background" args={['#020204']} />
      <fog attach="fog" args={['#000000', 10, 70]} />
      <HyperEnvironment />
      <ambientLight intensity={0.4} />
      <pointLight position={[30, 30, 30]} intensity={2.5} color="#4f46e5" />
      <pointLight position={[-30, -30, -30]} intensity={1.5} color="#10b981" />
      <spotLight position={[0, 50, 0]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
    </>
  );
};

export default ATScene;
