import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
  ActiveTheory-inspired 3D Background
  - Subtle floating particles (white/gray, not neon)
  - Soft ambient lighting
  - Gentle camera movement on scroll
  - No flashy cyberpunk effects
  - Elegant, minimal, sophisticated
*/

// Simple seeded PRNG for deterministic visual positions (not security-sensitive)
function mulberry32(seed) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Subtle floating dust particles ───
function DustParticles({ count = 800 }) {
  const ref = useRef();

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rng = mulberry32(42); // Fixed seed for consistent layout
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 40;
      pos[i * 3 + 1] = (rng() - 0.5) * 25;
      pos[i * 3 + 2] = (rng() - 0.5) * 30 - 5;
    }
    return { positions: pos };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const posArr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.5) * 0.001;
      posArr[i * 3] += Math.cos(t * 0.2 + i * 0.3) * 0.0005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Subtle geometric wireframe shapes ───
function FloatingGeometry() {
  const group = useRef();

  const shapes = useMemo(() => [
    { pos: [-6, 3, -12], rot: [0.3, 0.5, 0], scale: 1.2, speed: 0.15 },
    { pos: [7, -2, -15], rot: [0.1, 0.8, 0.2], scale: 0.8, speed: 0.12 },
    { pos: [-3, -4, -10], rot: [0.5, 0.3, 0.1], scale: 0.6, speed: 0.18 },
    { pos: [5, 4, -18], rot: [0.2, 0.1, 0.4], scale: 1.5, speed: 0.1 },
    { pos: [0, 0, -20], rot: [0, 0, 0], scale: 2.0, speed: 0.08 },
  ], []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((mesh, i) => {
      const s = shapes[i];
      mesh.rotation.x = s.rot[0] + t * s.speed;
      mesh.rotation.y = s.rot[1] + t * s.speed * 0.7;
      mesh.position.y = s.pos[1] + Math.sin(t * 0.3 + i) * 0.5;
    });
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          {i % 3 === 0 ? (
            <icosahedronGeometry args={[1, 1]} />
          ) : i % 3 === 1 ? (
            <octahedronGeometry args={[1, 0]} />
          ) : (
            <torusGeometry args={[1, 0.3, 8, 16]} />
          )}
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.03 + i * 0.005}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Soft light orbs (AT ambient lights) ───
function AmbientOrbs() {
  const group = useRef();

  const orbs = useMemo(() => [
    { pos: [5, 3, -8], color: '#4a9eff', intensity: 0.4, distance: 20 },
    { pos: [-6, -2, -10], color: '#8855ff', intensity: 0.3, distance: 18 },
    { pos: [0, 5, -12], color: '#ff6688', intensity: 0.2, distance: 15 },
  ], []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((light, i) => {
      const o = orbs[i];
      light.position.x = o.pos[0] + Math.sin(t * 0.2 + i * 2) * 2;
      light.position.y = o.pos[1] + Math.cos(t * 0.15 + i) * 1.5;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <pointLight
          key={i}
          color={o.color}
          intensity={o.intensity}
          distance={o.distance}
          position={o.pos}
        />
      ))}
    </group>
  );
}

// ─── Subtle ground plane with grid ───
function SubtleGrid() {
  const matRef = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);
          float dist = length(vUv - 0.5);
          float fade = 1.0 - smoothstep(0.1, 0.5, dist);
          float alpha = gridAlpha * 0.04 * fade;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -5]} material={material}>
      <planeGeometry args={[60, 60]} />
    </mesh>
  );
}

// ─── MAIN SCENE ───
const ATScene = () => {
  const { camera } = useThree();

  useFrame(() => {
    const t = performance.now() * 0.0001;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 3) * 0.3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(t * 2) * 0.2, 0.02);
  });

  return (
    <>
      <fog attach="fog" args={['#000000', 8, 30]} />
      <ambientLight intensity={0.05} />
      <AmbientOrbs />
      <DustParticles count={600} />
      <FloatingGeometry />
      <SubtleGrid />
    </>
  );
};

export default ATScene;