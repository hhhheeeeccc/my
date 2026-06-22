import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text, Stars } from '@react-three/drei';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { createFog } from '../../utils/three-utils';
import CyberCharacter from './three/CyberCharacter';

// ===================== NEON DATA RAIN =====================
function NeonDataRain({ count = 1500, focusMode, velocityFactor }) {
  const meshRef = useRef(null);

  const particles = useMemo(() => {
    const temp = [];
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffffff', '#ff3366'];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 25 - 10,
          (Math.random() - 0.5) * 30
        ),
        speed: 0.3 + Math.random() * 1.5,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const speedMult = focusMode ? 2 : 1;
    particles.forEach((p, i) => {
      p.position.y -= p.speed * 0.04 * speedMult;
      if (p.position.y < -10) {
        p.position.y = 15;
        p.position.x = (Math.random() - 0.5) * 30;
      }
      dummy.position.copy(p.position);
      const s = 0.015 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.008 + velocityFactor.get() * 0.01;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.7} />
    </instancedMesh>
  );
}

// ===================== NEON GRID FLOOR =====================
function NeonGrid() {
  const gridUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#00ffff') },
    uColor2: { value: new THREE.Color('#ff00ff') },
  }), []);

  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: gridUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;

        void main() {
          vec2 grid = abs(fract(vUv * 30.0 - 0.5) - 0.5) / fwidth(vUv * 30.0);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);
          float dist = length(vUv - 0.5);
          float pulse = sin(dist * 20.0 - uTime * 1.5) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, sin(vUv.x * 6.28 + uTime * 0.5) * 0.5 + 0.5);
          float edgeFade = 1.0 - smoothstep(0.2, 0.5, dist);
          float alpha = gridAlpha * (0.15 + pulse * 0.1) * edgeFade;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [gridUniforms]);

  const matRef = useRef(gridMaterial);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -2]} material={gridMaterial}>
      <planeGeometry args={[50, 50, 1, 1]} />
    </mesh>
  );
}

// ===================== CYBER HOLOGRAM RINGS =====================
function CyberRings({ focusMode, clickPulse }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * (focusMode ? 0.4 : 0.15);
    }
    if (coreRef.current) {
      const scale = (1 + Math.sin(state.clock.elapsedTime * 2) * 0.08) * (focusMode ? 1.3 : 1) * (clickPulse ? 1.5 : 1);
      coreRef.current.scale.setScalar(scale);
    }
  });

  const ringColor = focusMode ? '#00ffff' : '#3b82f6';

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial
          color={ringColor}
          emissive={ringColor}
          emissiveIntensity={focusMode ? 3 : 1.5}
          speed={2 + (focusMode ? 2 : 0)}
          distort={focusMode ? 0.5 : 0.25}
          roughness={0}
          metalness={1}
          transparent
          opacity={focusMode ? 0.7 : 0.4}
        />
      </mesh>

      <mesh scale={[1.3, 1.3, 1.3]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={focusMode ? 0.3 : 0.1} />
      </mesh>

      {[
        { radius: 1.8, color: '#00ffff', speed: 0.8 },
        { radius: 2.3, color: '#ff00ff', speed: -0.6 },
        { radius: 2.8, color: '#00ff88', speed: 0.4 },
      ].map((ring, i) => (
        <CyberRing key={i} {...ring} visible={focusMode} />
      ))}

      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 3;
        return (
          <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.5} rotationIntensity={0.3}>
            <mesh
              position={[Math.cos(angle) * r, Math.sin(i * 1.5) * 0.4, Math.sin(angle) * r]}
              rotation={[i, i * 0.5, 0]}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                emissive={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                emissiveIntensity={focusMode ? 3 : 1}
                transparent
                opacity={focusMode ? 0.8 : 0.3}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function CyberRing({ radius, color, speed, visible }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      ref.current.material.opacity = THREE.MathUtils.lerp(
        ref.current.material.opacity,
        visible ? 0.6 : 0.15,
        0.05
      );
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 16, 80]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ===================== CYBERPUNK BLOBS =====================
function CyberBlob({ position, color, speed, distort, radius = 1, focusMode, velocityFactor, clickPulse }) {
  const mesh = useRef(null);
  const mouse = useThree((state) => state.mouse);
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
      const scl = (1 + (focusMode ? 0.5 : 0)) * pulse * (focusMode ? 1.3 : 1) * (clickPulse ? 1.4 : 1);
      const str = 1 + velocityFactor.get() * 0.3;
      mesh.current.scale.set(
        THREE.MathUtils.lerp(mesh.current.scale.x, scl, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.y, scl * str, 0.1),
        THREE.MathUtils.lerp(mesh.current.scale.z, scl, 0.1)
      );
      const td = focusMode ? distort + 0.6 : distort + (pulse > 1 ? 0.6 : 0) + velocityFactor.get() * 0.8 + (clickPulse ? 1.2 : 0);
      mesh.current.material.distort = THREE.MathUtils.lerp(mesh.current.material.distort, td, 0.1);
      mesh.current.material.opacity = THREE.MathUtils.lerp(
        mesh.current.material.opacity,
        focusMode || clickPulse ? 0.35 : 0.12,
        0.1
      );
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} args={[undefined, 64, 64]} position={position}>
        <icosahedronGeometry args={[radius, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={focusMode ? 1.5 : 0.5}
          speed={speed * (focusMode ? 2 : 1)}
          distort={distort}
          radius={radius}
          transparent
          opacity={0.12}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ===================== FLOATING LIGHT BEAMS =====================
function LightBeams({ focusMode }) {
  const beams = useMemo(() => {
    const configs = [];
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ff3366', '#6633ff'];
    for (let i = 0; i < 8; i++) {
      configs.push({
        position: [(Math.random() - 0.5) * 20, 3, -8 + (Math.random() - 0.5) * 15],
        color: colors[Math.floor(Math.random() * colors.length)],
        height: 8 + Math.random() * 10,
      });
    }
    return configs;
  }, []);

  return (
    <group>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position}>
          <cylinderGeometry args={[0.01, 0.15, beam.height, 6, 1, true]} />
          <meshBasicMaterial
            color={beam.color}
            transparent
            opacity={focusMode ? 0.06 : 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ===================== MAIN EXPERIENCE =====================
const Experience3D = () => {
  const { camera } = useThree();
  const [focus, setFocus] = useState({ active: false, pulse: false });
  const { scrollY, scrollYProgress } = useScroll();
  const scrollProgress = useMemo(() => ({ get: () => scrollYProgress.get() }), [scrollYProgress]);
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

  const fog = useMemo(() => createFog('#020617', 8, 25), []);

  const cyberBlobs = [
    { pos: [-4, 2, -3], col: '#00ffff', s: 1.5, d: 0.4, r: 1.5 },
    { pos: [4, -3, -4], col: '#ff00ff', s: 1, d: 0.5, r: 2 },
    { pos: [2, 4, -5], col: '#00ff88', s: 1.2, d: 0.3, r: 1.2 },
    { pos: [0, 0, -6], col: '#ff3366', s: 0.8, d: 0.5, r: 4 },
  ];

  return (
    <>
      <primitive object={fog} attach="fog" />

      {/* Cyberpunk Lighting */}
      <ambientLight args={['#ffffff', focus.active ? 0.15 : 0.08]} />
      <pointLight args={['#00ffff', focus.active ? 2.5 : 1]} position={[8, 8, 5]} distance={25} />
      <pointLight args={['#ff00ff', focus.active ? 2 : 0.8]} position={[-8, 5, 3]} distance={25} />
      <pointLight args={['#ff3366', focus.active ? 1.5 : 0.5]} position={[0, -3, 8]} distance={20} />
      <spotLight args={['#6633ff', focus.active ? 2 : 0.8]} position={[0, 15, -5]} angle={0.4} penumbra={1} distance={40} />

      {/* Background Stars */}
      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0.5} fade speed={0.5} />

      {/* Neon Grid */}
      <NeonGrid />

      {/* Data Rain Particles */}
      <NeonDataRain count={1200} focusMode={focus.active} velocityFactor={velFactor} />

      {/* Cyberpunk Blobs (replacing original blobs) */}
      {cyberBlobs.map((b, i) => (
        <CyberBlob
          key={i}
          position={b.pos}
          color={b.col}
          speed={b.s}
          distort={b.d}
          radius={b.r}
          focusMode={focus.active}
          velocityFactor={velFactor}
          clickPulse={focus.pulse}
        />
      ))}

      {/* Hologram Center */}
      <CyberRings focusMode={focus.active} clickPulse={focus.pulse} />

      {/* Light Beams */}
      <LightBeams focusMode={focus.active} />

      {/* 3D Cyberpunk Character - Scroll Animated */}
      <CyberCharacter scrollProgress={scrollProgress} />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom
          intensity={focus.active ? 2 : 1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(
            focus.active ? 0.001 : 0.0003,
            focus.active ? 0.001 : 0.0003
          )}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Vignette offset={0.3} darkness={focus.active ? 0.8 : 0.5} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  );
};

export default Experience3D;