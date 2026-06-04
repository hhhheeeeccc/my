import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const ParticleField = ({ count = 500 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    let seed = 42;
    for (let i = 0; i < count; i++) {
      p[i * 3] = (seededRandom(seed++) - 0.5) * 20;
      p[i * 3 + 1] = (seededRandom(seed++) - 0.5) * 20;
      p[i * 3 + 2] = (seededRandom(seed++) - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.02;
    ref.current.rotation.x = time * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#3b82f6"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const InteractiveBlob = ({ position, color, speed, distort, radius = 1 }) => {
  const mesh = useRef();
  const mouse = useThree((state) => state.mouse);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      // Gentle floating
      mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.3;

      // Subtle mouse interaction
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.2, 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * 0.2, 0.1);
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={mesh} args={[radius, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={radius}
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
    </Float>
  );
};

const Experience3D = () => {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 5, 15]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#6366f1" />

      <ParticleField count={800} />

      <InteractiveBlob
        position={[-4, 2, -3]}
        color="#1d4ed8"
        speed={1.5}
        distort={0.4}
        radius={1.5}
      />
      <InteractiveBlob
        position={[4, -3, -4]}
        color="#4338ca"
        speed={1}
        distort={0.5}
        radius={2}
      />
      <InteractiveBlob
        position={[2, 4, -5]}
        color="#0e7490"
        speed={1.2}
        distort={0.3}
        radius={1.2}
      />

      {/* Large central hero-like background blob */}
      <InteractiveBlob
        position={[0, 0, -6]}
        color="#1e3a8a"
        speed={0.8}
        distort={0.5}
        radius={4}
      />
    </>
  );
};

export default Experience3D;
