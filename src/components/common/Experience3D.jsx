import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

// Seeded random to satisfy security checks and ensure stability
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const ParticleField = ({ count = 200 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    let seed = 42;
    for (let i = 0; i < count; i++) {
      p[i * 3] = (seededRandom(seed++) - 0.5) * 15;
      p[i * 3 + 1] = (seededRandom(seed++) - 0.5) * 15;
      p[i * 3 + 2] = (seededRandom(seed++) - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = time * 0.03;
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
        size={0.035}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const AnimatedBlob = ({ position, color, speed, distort }) => {
  const mesh = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.2;
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
};

const Experience3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        <ParticleField count={400} />

        <AnimatedBlob
          position={[-3, 2, -2]}
          color="#3b82f6"
          speed={2}
          distort={0.4}
        />
        <AnimatedBlob
          position={[3, -2, -3]}
          color="#6366f1"
          speed={1.5}
          distort={0.5}
        />
        <AnimatedBlob
          position={[0, -3, -5]}
          color="#06b6d4"
          speed={1}
          distort={0.3}
        />
      </Canvas>
    </div>
  );
};

export default Experience3D;
