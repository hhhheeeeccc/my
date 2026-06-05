import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
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

const InteractiveBlob = ({ position, color, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) => {
  const mesh = useRef();
  const mouse = useThree((state) => state.mouse);
  const { scrollYProgress } = useScroll();
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const handleDown = () => setPulse(1.8);
    const handleUp = () => setPulse(1);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      const targetY = focusMode ? position[1] * 0.5 : position[1] + Math.sin(time * speed) * 0.3;
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);

      const rotFactor = focusMode ? 0.8 : 0.2;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * rotFactor, 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * rotFactor, 0.1);

      const scrollScale = 1 + scrollYProgress.get() * 0.5;
      const focusScale = focusMode ? 1.5 : 1;
      const clickEffect = clickPulse ? 1.4 : 1;
      const stretch = 1 + velocityFactor.get() * 0.3;

      const targetScaleVal = scrollScale * pulse * focusScale * clickEffect;
      mesh.current.scale.set(
        THREE.MathUtils.lerp(mesh.current.scale.x, targetScaleVal, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.y, targetScaleVal * stretch, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.z, targetScaleVal, 0.1)
      );

      const targetDistort = focusMode ? distort + 0.6 : distort + (pulse > 1 ? 0.4 : 0) + velocityFactor.get() * 0.5 + (clickPulse ? 0.8 : 0);
      mesh.current.material.distort = THREE.MathUtils.lerp(mesh.current.material.distort, targetDistort, 0.1);
      mesh.current.material.opacity = THREE.MathUtils.lerp(mesh.current.material.opacity, focusMode || clickPulse ? 0.5 : 0.2, 0.1);
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={mesh} args={[radius, 64, 64]} position={position}>
        <MeshDistortMaterial color={color} speed={speed * (focusMode ? 2 : 1)} distort={distort} radius={radius} transparent opacity={0.2} metalness={0.8} roughness={0.2} />
      </Sphere>
    </Float>
  );
};

const Experience3D = () => {
  const { camera } = useThree();
  const [focusMode, setFocusMode] = useState(false);
  const [clickPulse, setClickPulse] = useState(false);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 50, damping: 20 });
  const normalizedVelocity = useMemo(() => ({
    get: () => Math.min(Math.abs(smoothVelocity.get() / 1000), 1)
  }), [smoothVelocity]);

  useEffect(() => {
    const handleFocus = (e) => {
      setFocusMode(e.detail.focus);
      if (e.detail.click) {
        setClickPulse(true);
        setTimeout(() => setClickPulse(false), 800);
      }
    };
    window.addEventListener('ui-focus', handleFocus);
    return () => window.removeEventListener('ui-focus', handleFocus);
  }, []);

  useFrame(() => {
    const targetZ = clickPulse ? 3 : (focusMode ? 4 : 5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, focusMode ? -0.1 : 0, 0.05);

    camera.fov = THREE.MathUtils.lerp(camera.fov, 75 + normalizedVelocity.get() * 10 + (clickPulse ? 15 : 0), 0.1);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 5, 15]} />
      <ambientLight intensity={focusMode ? 0.6 : 0.4} />
      <pointLight position={[10, 10, 10]} intensity={focusMode ? 2 : 1} color="#3b82f6" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={focusMode ? 2 : 1} color="#6366f1" />
      <ParticleField count={800} focusMode={focusMode} velocityFactor={normalizedVelocity} />
      <InteractiveBlob position={[-4, 2, -3]} color={focusMode ? "#3b82f6" : "#1d4ed8"} speed={1.5} distort={0.4} radius={1.5} focusMode={focusMode} velocityFactor={normalizedVelocity} clickPulse={clickPulse} />
      <InteractiveBlob position={[4, -3, -4]} color={focusMode ? "#6366f1" : "#4338ca"} speed={1} distort={0.5} radius={2} focusMode={focusMode} velocityFactor={normalizedVelocity} clickPulse={clickPulse} />
      <InteractiveBlob position={[2, 4, -5]} color={focusMode ? "#22d3ee" : "#0e7490"} speed={1.2} distort={0.3} radius={1.2} focusMode={focusMode} velocityFactor={normalizedVelocity} clickPulse={clickPulse} />
      <InteractiveBlob position={[0, 0, -6]} color={focusMode ? "#1e40af" : "#1e3a8a"} speed={0.8} distort={0.5} radius={4} focusMode={focusMode} velocityFactor={normalizedVelocity} clickPulse={clickPulse} />
    </>
  );
};

export default Experience3D;
