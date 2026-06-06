import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const InteractiveBlob = ({ position, color, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) => {
  const mesh = useRef();
  const mouse = useThree((state) => state.mouse);
  const { scrollYProgress } = useScroll();
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const handleDown = () => setPulse(1.8);
    const handleUp = () => setPulse(1);
    const target = globalThis;
    target.addEventListener('mousedown', handleDown);
    target.addEventListener('mouseup', handleUp);
    return () => {
      target.removeEventListener('mousedown', handleDown);
      target.removeEventListener('mouseup', handleUp);
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
      const scl = (1 + scrollYProgress.get() * 0.5) * pulse * (focusMode ? 1.5 : 1) * (clickPulse ? 1.4 : 1);
      const str = 1 + velocityFactor.get() * 0.3;
      mesh.current.scale.set(THREE.MathUtils.lerp(mesh.current.scale.x, scl, 0.1), THREE.MathUtils.lerp(mesh.current.scale.y, scl * str, 0.1), THREE.MathUtils.lerp(mesh.current.scale.z, scl, 0.1));
      const td = focusMode ? distort + 0.6 : distort + (pulse > 1 ? 0.6 : 0) + velocityFactor.get() * 0.8 + (clickPulse ? 1.2 : 0);
      mesh.current.material.distort = THREE.MathUtils.lerp(mesh.current.material.distort, td, 0.1);
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

InteractiveBlob.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
  distort: PropTypes.number.isRequired,
  radius: PropTypes.number,
  focusMode: PropTypes.bool.isRequired,
  velocityFactor: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  clickPulse: PropTypes.bool.isRequired
};

export default InteractiveBlob;
