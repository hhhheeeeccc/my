import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ===================== SPRING-BASED SMOOTH INTERPOLATION =====================
class SmoothSpring {
  constructor(stiffness = 120, damping = 18) {
    this.value = 0;
    this.target = 0;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }
  update(dt = 1 / 60) {
    const force = (this.target - this.value) * this.stiffness;
    const dampForce = -this.velocity * this.damping;
    this.velocity += (force + dampForce) * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
  setTarget(t) { this.target = t; }
  reset(v = 0) { this.value = v; this.target = v; this.velocity = 0; }
}

// ===================== MATERIALS =====================
function neonMat(color = '#00ffff', intensity = 2, opacity = 0.9) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      transparent
      opacity={opacity}
      metalness={0.95}
      roughness={0.05}
    />
  );
}

function hologramMat(color = '#00ffff', opacity = 0.15) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.5}
      transparent
      opacity={opacity}
      metalness={1}
      roughness={0}
      side={THREE.DoubleSide}
    />
  );
}

function edgeMat(color = '#00ffff', opacity = 0.5) {
  return <lineBasicMaterial color={color} transparent opacity={opacity} />;
}

// ===================== HOLOGRAPHIC WELCOME TEXT =====================
function HoloText({ scrollT, text, yOffset, color = '#00ffff' }) {
  const groupRef = useRef(null);
  const textObj = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 48px monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text, color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT < 0.2;
    const targetOpacity = visible ? 1 : 0;
    const targetY = visible ? yOffset + Math.sin(t * 1.5) * 0.08 : yOffset + 0.5;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity * 0.8, 0.06);
      }
    });
    // Subtle holographic flicker
    if (visible && Math.random() < 0.02) {
      groupRef.current.position.x += (Math.random() - 0.5) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      <mesh>
        <planeGeometry args={[2.2, 0.55]} />
        <meshBasicMaterial map={textObj} transparent opacity={0.8} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Holographic frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.3, 0.6)]} />
        {edgeMat(color, 0.3)}
      </lineSegments>
      {/* Scan line effect */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== HOLOGRAPHIC GOODBYE TEXT =====================
function GoodbyeHolo({ scrollT }) {
  const groupRef = useRef(null);
  const textObj = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 42px monospace';
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 25;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SEE YOU SOON!', 256, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT > 0.82;
    const targetScale = visible ? 1 : 0;
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.05);
    if (visible) {
      groupRef.current.position.y = 1.3 + Math.sin(t * 2) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.3, 0.5]} scale={[0, 0, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 0.6]} />
        <meshBasicMaterial map={textObj} transparent opacity={0.85} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.6, 0.65)]} />
        {edgeMat('#ff00ff', 0.4)}
      </lineSegments>
    </group>
  );
}

// ===================== ENERGY ORBS (transition particles) =====================
function EnergyOrbs({ scrollT }) {
  const count = 40;
  const meshRef = useRef(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1
        ),
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        size: 0.008 + Math.random() * 0.012,
      });
    }
    return temp;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = (scrollT > 0.15 && scrollT < 0.35) || (scrollT > 0.7 && scrollT < 0.85) ? 2 : 0.5;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.offset.x + Math.sin(t * p.speed + p.phase) * 0.4 * intensity,
        p.offset.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.3 * intensity,
        p.offset.z + Math.sin(t * p.speed * 0.6 + p.phase * 2) * 0.2
      );
      dummy.scale.setScalar(p.size * (1 + Math.sin(t * 4 + i) * 0.3) * intensity);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.7} />
    </instancedMesh>
  );
}

// ===================== HOLOGRAPHIC FLOATING UI PANELS =====================
function HoloUIPanels({ scrollT }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT > 0.2 && scrollT < 0.7;
    const targetOpacity = visible ? 1 : 0;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 1.2 + i * 1.5) * 0.0005;
      child.rotation.y = Math.sin(t * 0.5 + i) * 0.15;
      if (child.material) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity * 0.25, 0.04);
      }
    });
  });

  const panelConfigs = [
    { pos: [-1.2, 0.5, 0.3], size: [0.6, 0.4], color: '#00ffff' },
    { pos: [-1.0, 1.0, 0.1], size: [0.4, 0.3], color: '#ff00ff' },
    { pos: [-1.4, 0.1, 0.4], size: [0.5, 0.35], color: '#00ff88' },
  ];

  return (
    <group ref={groupRef}>
      {panelConfigs.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[0, 0.3, 0]}>
          <planeGeometry args={p.size} />
          {hologramMat(p.color, 0.25)}
        </mesh>
      ))}
    </group>
  );
}

// ===================== CHARACTER HEAD (upgraded) =====================
function Head({ scrollT }) {
  const group = useRef(null);
  const visorGlow = useRef(null);
  const antennaTip = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x * 0.2;
    const my = -state.pointer.y * 0.12;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, my, 0.06);

    // Head tilt in different states
    if (scrollT < 0.2) {
      // Welcome: friendly tilt with wave
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        Math.sin(t * 2.5) * 0.08 + 0.05,
        0.06
      );
    } else if (scrollT < 0.75) {
      // Coding: focused, slight forward tilt
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -0.05, 0.04);
    } else {
      // Goodbye: gentle sway
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        Math.sin(t * 1.8) * 0.12,
        0.06
      );
    }

    // Visor pulsing
    if (visorGlow.current) {
      const baseIntensity = scrollT < 0.2 ? 5 : scrollT < 0.75 ? 4 : 6;
      visorGlow.current.material.emissiveIntensity = baseIntensity + Math.sin(t * 4) * 1;
    }

    // Antenna tip blink
    if (antennaTip.current) {
      antennaTip.current.material.emissiveIntensity = 3 + Math.sin(t * 6) * 2;
      antennaTip.current.scale.setScalar(0.8 + Math.sin(t * 6) * 0.3);
    }
  });

  return (
    <group ref={group} position={[0, 0.55, 0]}>
      {/* Main head - rounded box feel */}
      <mesh>
        <boxGeometry args={[0.34, 0.4, 0.34]} />
        {neonMat('#0a1628', 0.4, 0.95)}
      </mesh>
      {/* Head wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.35, 0.41, 0.35)]} />
        {edgeMat('#00ffff', 0.4)}
      </lineSegments>

      {/* Face plate / visor */}
      <mesh position={[0, 0.02, 0.175]}>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
        <meshStandardMaterial color="#050520" emissive="#1a0030" emissiveIntensity={1} metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Eye visor glow */}
      <mesh ref={visorGlow} position={[0, 0.02, 0.185]}>
        <boxGeometry args={[0.24, 0.025, 0.01]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      {/* Secondary eye line */}
      <mesh position={[0, -0.02, 0.185]}>
        <boxGeometry args={[0.18, 0.015, 0.01]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Jaw accent line */}
      <mesh position={[0, -0.12, 0.175]}>
        <boxGeometry args={[0.2, 0.01, 0.01]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Antenna stalk */}
      <mesh position={[0.08, 0.26, 0]}>
        <cylinderGeometry args={[0.008, 0.012, 0.18, 4]} />
        {neonMat('#00ffff', 1.5)}
      </mesh>
      {/* Antenna tip */}
      <mesh ref={antennaTip} position={[0.08, 0.37, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      {/* Ear pieces */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.19, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.1, 0.12]} />
          {neonMat('#00ffff', 2)}
        </mesh>
      ))}

      {/* Crown/forehead accent */}
      <mesh position={[0, 0.17, 0.175]}>
        <boxGeometry args={[0.15, 0.015, 0.01]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== CHARACTER TORSO (upgraded) =====================
function Torso({ scrollT }) {
  const coreRef = useRef(null);
  const chestLightRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Core energy pulse
    if (coreRef.current) {
      const isActive = scrollT > 0.2 && scrollT < 0.75;
      coreRef.current.material.emissiveIntensity = isActive ? 3 + Math.sin(t * 5) * 1.5 : 1.5 + Math.sin(t * 2) * 0.5;
      coreRef.current.scale.setScalar(isActive ? 0.8 + Math.sin(t * 4) * 0.15 : 0.6);
    }
    if (chestLightRef.current) {
      chestLightRef.current.material.emissiveIntensity = 2 + Math.sin(t * 3) * 1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main torso body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.48, 0.52, 0.26]} />
        {neonMat('#0a1628', 0.3, 0.95)}
      </mesh>
      {/* Torso wireframe */}
      <lineSegments position={[0, 0.15, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.49, 0.53, 0.27)]} />
        {edgeMat('#00ffff', 0.3)}
      </lineSegments>

      {/* Chest plate */}
      <mesh position={[0, 0.22, 0.135]}>
        <boxGeometry args={[0.35, 0.18, 0.01]} />
        <meshStandardMaterial color="#050515" emissive="#0a0030" emissiveIntensity={0.5} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Chest neon stripes */}
      <mesh position={[0, 0.25, 0.14]}>
        <boxGeometry args={[0.28, 0.015, 0.005]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.18, 0.14]}>
        <boxGeometry args={[0.2, 0.015, 0.005]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh ref={chestLightRef} position={[0, 0.21, 0.14]}>
        <boxGeometry args={[0.08, 0.015, 0.005]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Energy core (center chest) */}
      <mesh ref={coreRef} position={[0, 0.21, 0.145]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Shoulder accents */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.28, 0.38, 0]}>
            <boxGeometry args={[0.12, 0.06, 0.18]} />
            {neonMat('#0a1628', 0.5)}
          </mesh>
          <mesh position={[s * 0.28, 0.38, 0.095]}>
            <boxGeometry args={[0.1, 0.015, 0.005]} />
            <meshStandardMaterial
              color={s === -1 ? '#ff00ff' : '#00ffff'}
              emissive={s === -1 ? '#ff00ff' : '#00ffff'}
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Belt/waist accent */}
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.28]} />
        {neonMat('#0a1628', 0.4)}
      </mesh>
      <mesh position={[0, -0.08, 0.145]}>
        <boxGeometry args={[0.4, 0.015, 0.005]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== ARM (upgraded with spring physics) =====================
function Arm({ side = 'left', scrollT }) {
  const upperRef = useRef(null);
  const lowerRef = useRef(null);
  const handRef = useRef(null);
  const trailRef = useRef(null);
  const isLeft = side === 'left';
  const xSign = isLeft ? -1 : 1;

  // Spring-based smooth interpolation for each joint
  const springs = useMemo(() => ({
    upperZ: new SmoothSpring(80, 14),
    upperX: new SmoothSpring(80, 14),
    lowerZ: new SmoothSpring(100, 16),
    handGlow: new SmoothSpring(60, 12),
  }), []);

  useFrame((state, delta) => {
    if (!upperRef.current || !lowerRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (scrollT < 0.2) {
      // ============ GREETING STATE ============
      if (!isLeft) {
        // Right arm: dramatic wave animation
        springs.upperZ.setTarget(Math.PI * 0.85);
        springs.upperX.setTarget(-0.4 + Math.sin(t * 1.5) * 0.15);
        springs.lowerZ.setTarget(Math.sin(t * 4) * 0.5 + 0.2);
        springs.handGlow.setTarget(3);
      } else {
        // Left arm: relaxed at side, slight sway
        springs.upperZ.setTarget(0.12);
        springs.upperX.setTarget(Math.sin(t * 1.2) * 0.05);
        springs.lowerZ.setTarget(Math.sin(t * 1.5) * 0.05);
        springs.handGlow.setTarget(1);
      }
    } else if (scrollT < 0.75) {
      // ============ CODING STATE ============
      // Both arms reach forward to keyboard with typing motion
      const typingOffset = isLeft
        ? Math.sin(t * 8) * 0.06
        : Math.sin(t * 8 + 1.5) * 0.06;
      springs.upperZ.setTarget(xSign * 0.45);
      springs.upperX.setTarget(-Math.PI * 0.38 + typingOffset);
      springs.lowerZ.setTarget(-0.6 + typingOffset * 0.5);
      springs.handGlow.setTarget(2 + Math.sin(t * 8) * 0.5);
    } else {
      // ============ GOODBYE STATE ============
      // Both arms wave enthusiastically with phase offset
      const wavePhase = isLeft ? 0 : Math.PI;
      const waveSpeed = 4.5;
      springs.upperZ.setTarget(xSign * Math.PI * 0.65);
      springs.upperX.setTarget(-0.25 + Math.sin(t * 1.5) * 0.1);
      springs.lowerZ.setTarget(Math.sin(t * waveSpeed + wavePhase) * 0.5 + 0.25);
      springs.handGlow.setTarget(3 + Math.sin(t * waveSpeed) * 1);
    }

    // Update springs
    springs.upperZ.update(dt);
    springs.upperX.update(dt);
    springs.lowerZ.update(dt);
    springs.handGlow.update(dt);

    // Apply to refs
    upperRef.current.rotation.z = springs.upperZ.value;
    upperRef.current.rotation.x = springs.upperX.value;
    lowerRef.current.rotation.z = springs.lowerZ.value;

    // Hand glow
    if (handRef.current) {
      handRef.current.material.emissiveIntensity = springs.handGlow.value;
    }

    // Energy trail between hand and desk when coding
    if (trailRef.current) {
      const showTrail = scrollT > 0.25 && scrollT < 0.7;
      trailRef.current.material.opacity = THREE.MathUtils.lerp(
        trailRef.current.material.opacity,
        showTrail ? 0.15 + Math.sin(t * 6) * 0.08 : 0,
        0.06
      );
      if (showTrail) {
        trailRef.current.rotation.z = t * 3;
      }
    }
  });

  return (
    <group position={[xSign * 0.3, 0.34, 0]}>
      <group ref={upperRef}>
        {/* Upper arm */}
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.12, 0.34, 0.12]} />
          {neonMat('#0a1628', 0.4, 0.95)}
        </mesh>
        <lineSegments position={[0, -0.16, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.13, 0.35, 0.13)]} />
          {edgeMat('#00ffff', 0.25)}
        </lineSegments>
        {/* Upper arm accent stripe */}
        <mesh position={[0, -0.08, 0.065]}>
          <boxGeometry args={[0.08, 0.015, 0.005]} />
          <meshStandardMaterial
            color={isLeft ? '#ff00ff' : '#00ff88'}
            emissive={isLeft ? '#ff00ff' : '#00ff88'}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Elbow joint - glowing sphere */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* Elbow ring */}
        <mesh position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.008, 6, 16]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* Lower arm */}
        <group ref={lowerRef} position={[0, -0.35, 0]}>
          <mesh position={[0, -0.13, 0]}>
            <boxGeometry args={[0.1, 0.28, 0.1]} />
            {neonMat('#0a1628', 0.4, 0.95)}
          </mesh>
          <lineSegments position={[0, -0.13, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.11, 0.29, 0.11)]} />
            {edgeMat('#00ffff', 0.2)}
          </lineSegments>
          {/* Wrist accent */}
          <mesh position={[0, -0.26, 0.055]}>
            <boxGeometry args={[0.06, 0.015, 0.005]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
          </mesh>

          {/* Hand - more detailed */}
          <mesh ref={handRef} position={[0, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.09, 0.06]} />
            {neonMat('#00ffff', 1.5)}
          </mesh>
          {/* Fingers suggestion */}
          <mesh position={[0.02, -0.36, 0.01]}>
            <boxGeometry args={[0.06, 0.05, 0.03]} />
            {neonMat('#00ffff', 1)}
          </mesh>

          {/* Energy trail effect when coding */}
          <mesh ref={trailRef} position={[0, -0.35, 0.1]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.08, 0.005, 4, 20]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ===================== LEGS (upgraded) =====================
function Legs({ scrollT }) {
  const leftUpper = useRef(null);
  const leftLower = useRef(null);
  const rightUpper = useRef(null);
  const rightLower = useRef(null);
  const leftFoot = useRef(null);
  const rightFoot = useRef(null);

  const springs = useMemo(() => ({
    leftUpperX: new SmoothSpring(60, 12),
    leftLowerX: new SmoothSpring(60, 12),
    rightUpperX: new SmoothSpring(60, 12),
    rightLowerX: new SmoothSpring(60, 12),
  }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const isSitting = scrollT > 0.2 && scrollT < 0.75;

    springs.leftUpperX.setTarget(isSitting ? -Math.PI * 0.5 : 0);
    springs.rightUpperX.setTarget(isSitting ? -Math.PI * 0.48 : 0);
    springs.leftLowerX.setTarget(isSitting ? Math.PI * 0.5 : 0);
    springs.rightLowerX.setTarget(isSitting ? Math.PI * 0.48 : 0);

    springs.leftUpperX.update(dt);
    springs.leftLowerX.update(dt);
    springs.rightUpperX.update(dt);
    springs.rightLowerX.update(dt);

    if (leftUpper.current) leftUpper.current.rotation.x = springs.leftUpperX.value;
    if (leftLower.current) leftLower.current.rotation.x = springs.leftLowerX.value;
    if (rightUpper.current) rightUpper.current.rotation.x = springs.rightUpperX.value;
    if (rightLower.current) rightLower.current.rotation.x = springs.rightLowerX.value;

    // Subtle idle leg sway when standing
    if (!isSitting) {
      const t = state.clock.elapsedTime;
      if (leftUpper.current) {
        leftUpper.current.rotation.x += Math.sin(t * 0.8) * 0.005;
      }
    }
  });

  const Leg = ({ side }) => {
    const xSign = side === 'left' ? -1 : 1;
    return (
      <group position={[xSign * 0.13, -0.12, 0]}>
        <group ref={side === 'left' ? leftUpper : rightUpper}>
          {/* Upper leg */}
          <mesh position={[0, -0.21, 0]}>
            <boxGeometry args={[0.15, 0.44, 0.15]} />
            {neonMat('#0a1628', 0.35, 0.95)}
          </mesh>
          <lineSegments position={[0, -0.21, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.16, 0.45, 0.16)]} />
            {edgeMat('#00ffff', 0.2)}
          </lineSegments>
          {/* Thigh accent */}
          <mesh position={[0, -0.1, 0.08]}>
            <boxGeometry args={[0.08, 0.015, 0.005]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>

          {/* Knee joint */}
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.055, 0.007, 6, 16]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>

          {/* Lower leg */}
          <group ref={side === 'left' ? leftLower : rightLower} position={[0, -0.44, 0]}>
            <mesh position={[0, -0.19, 0]}>
              <boxGeometry args={[0.13, 0.4, 0.13]} />
              {neonMat('#0a1628', 0.35, 0.95)}
            </mesh>
            <lineSegments position={[0, -0.19, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.14, 0.41, 0.14)]} />
              {edgeMat('#00ffff', 0.2)}
            </lineSegments>
            {/* Shin accent */}
            <mesh position={[0, -0.1, 0.07]}>
              <boxGeometry args={[0.06, 0.015, 0.005]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.5} toneMapped={false} />
            </mesh>

            {/* Foot / Boot */}
            <mesh ref={side === 'left' ? leftFoot : rightFoot} position={[0, -0.42, 0.04]}>
              <boxGeometry args={[0.14, 0.07, 0.22]} />
              {neonMat('#00ffff', 1)}
            </mesh>
            {/* Foot sole glow */}
            <mesh position={[0, -0.46, 0.04]}>
              <boxGeometry args={[0.12, 0.01, 0.2]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    );
  };

  return (
    <group>
      <Leg side="left" />
      <Leg side="right" />
    </group>
  );
}

// ===================== HOLOGRAPHIC CHAIR =====================
function HoloChair({ scrollT }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT > 0.18 && scrollT < 0.78;
    const targetScale = visible ? 1 : 0;
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.04);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.04);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.04);
    // Holographic shimmer
    if (visible) {
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = 0.2 + Math.sin(t * 2 + i * 0.5) * 0.05;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, -0.1]} scale={[0, 0, 0]}>
      {/* Chair back */}
      <mesh position={[0, 0.35, -0.2]}>
        <boxGeometry args={[0.5, 0.6, 0.04]} />
        {hologramMat('#00ffff', 0.2)}
      </mesh>
      <lineSegments position={[0, 0.35, -0.2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.51, 0.61, 0.05)]} />
        {edgeMat('#00ffff', 0.15)}
      </lineSegments>
      {/* Chair seat */}
      <mesh position={[0, 0.02, -0.05]}>
        <boxGeometry args={[0.5, 0.04, 0.45]} />
        {hologramMat('#00ffff', 0.2)}
      </mesh>
      {/* Chair legs - holographic */}
      {[[-0.2, -0.25], [0.2, -0.25], [-0.2, 0.15], [0.2, 0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.4, z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 4]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ===================== DESK + COMPUTER (upgraded) =====================
function DeskSetup({ scrollT }) {
  const groupRef = useRef(null);
  const screenGlowRef = useRef(null);
  const screenGlowRef2 = useRef(null);

  const codeLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 10; i++) {
      lines.push({
        width: 0.1 + Math.random() * 0.55,
        x: -0.32 + Math.random() * 0.12,
        y: 0.18 - i * 0.035,
        color: ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00', '#6633ff'][Math.floor(Math.random() * 5)],
        indent: Math.random() > 0.5 ? 0.05 : 0,
      });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Desk visible during coding section
    const fadeIn = scrollT > 0.15 && scrollT < 0.2;
    const visible = scrollT > 0.15 && scrollT < 0.82;
    const fadeOut = scrollT > 0.75 && scrollT < 0.82;
    let targetScale = visible ? 1 : 0;
    if (fadeIn) targetScale = (scrollT - 0.15) / 0.05;
    if (fadeOut) targetScale = (0.82 - scrollT) / 0.07;

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetScale === 0 ? 2 : 0,
      0.05
    );

    // Screen flicker effect
    if (screenGlowRef.current) {
      const baseFlicker = 1.5 + Math.sin(t * 10) * 0.2;
      const randomFlicker = Math.random() > 0.97 ? 0.5 : 0;
      screenGlowRef.current.material.emissiveIntensity = baseFlicker + randomFlicker;
    }
    if (screenGlowRef2.current) {
      screenGlowRef2.current.material.emissiveIntensity = 2 + Math.sin(t * 8 + 1) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ===== DESK ===== */}
      <mesh position={[0, -0.35, 0.3]}>
        <boxGeometry args={[1.9, 0.06, 0.75]} />
        {neonMat('#0a1628', 0.25)}
      </mesh>
      <lineSegments position={[0, -0.35, 0.3]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.91, 0.07, 0.76)]} />
        {edgeMat('#00ffff', 0.25)}
      </lineSegments>
      {/* Desk surface glow strips */}
      <mesh position={[0, -0.315, 0.3]}>
        <boxGeometry args={[1.85, 0.005, 0.01]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Desk legs */}
      {[[-0.85, -0.15], [0.85, -0.15], [-0.85, 0.7], [0.85, 0.7]].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, -0.65, z]}>
            <boxGeometry args={[0.04, 0.58, 0.04]} />
            {neonMat('#00ffff', 0.8)}
          </mesh>
          {/* Leg glow ring */}
          <mesh position={[x, -0.5, z]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ===== MONITOR ===== */}
      <group position={[0, 0.0, 0.3]}>
        {/* Monitor body */}
        <mesh position={[0, 0.22, 0.05]}>
          <boxGeometry args={[0.9, 0.55, 0.04]} />
          <meshStandardMaterial color="#080818" roughness={0.2} metalness={0.9} />
        </mesh>
        <lineSegments position={[0, 0.22, 0.05]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.91, 0.56, 0.05)]} />
          {edgeMat('#00ffff', 0.3)}
        </lineSegments>

        {/* Screen glow */}
        <mesh ref={screenGlowRef} position={[0, 0.22, 0.072]}>
          <planeGeometry args={[0.82, 0.47]} />
          <meshStandardMaterial color="#020818" emissive="#003355" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>

        {/* Code lines on screen */}
        {codeLines.map((line, i) => (
          <mesh key={i} position={[line.x + line.indent, line.y, 0.078]}>
            <planeGeometry args={[line.width, 0.01]} />
            <meshStandardMaterial
              color={line.color}
              emissive={line.color}
              emissiveIntensity={3}
              toneMapped={false}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}

        {/* Screen cursor blink */}
        <mesh ref={screenGlowRef2} position={[0.15, 0.18 - 10 * 0.035, 0.079]}>
          <planeGeometry args={[0.008, 0.025]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.9} />
        </mesh>

        {/* Monitor brand accent */}
        <mesh position={[0, -0.06, 0.07]}>
          <boxGeometry args={[0.06, 0.01, 0.005]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* Monitor stand */}
        <mesh position={[0, -0.1, 0.05]}>
          <cylinderGeometry args={[0.03, 0.04, 0.22, 6]} />
          {neonMat('#1a1a2e', 0.3)}
        </mesh>
        {/* Monitor base */}
        <mesh position={[0, -0.22, 0.05]}>
          <boxGeometry args={[0.3, 0.02, 0.18]} />
          {neonMat('#1a1a2e', 0.3)}
        </mesh>
        <lineSegments position={[0, -0.22, 0.05]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.31, 0.03, 0.19)]} />
          {edgeMat('#00ffff', 0.15)}
        </lineSegments>
      </group>

      {/* ===== KEYBOARD ===== */}
      <mesh position={[0, -0.31, 0.48]}>
        <boxGeometry args={[0.5, 0.018, 0.17]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#00ffff" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </mesh>
      <lineSegments position={[0, -0.31, 0.48]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.51, 0.025, 0.18)]} />
        {edgeMat('#00ffff', 0.3)}
      </lineSegments>

      {/* Keyboard keys - with wave typing effect */}
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 11 }, (_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.21 + col * 0.042, -0.298, 0.4 + row * 0.038]}
          >
            <boxGeometry args={[0.035, 0.006, 0.03]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={
                0.3 + Math.sin(Date.now() * 0.003 + row * 8 + col * 1.2) * 0.4
              }
              toneMapped={false}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))
      )}

      {/* ===== MOUSE ===== */}
      <group position={[0.35, -0.31, 0.5]}>
        <mesh>
          <boxGeometry args={[0.06, 0.02, 0.1]} />
          {neonMat('#0a1628', 0.5)}
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.061, 0.021, 0.101)]} />
          {edgeMat('#00ffff', 0.2)}
        </lineSegments>
        <mesh position={[0, 0.012, -0.02]}>
          <boxGeometry args={[0.015, 0.005, 0.025]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* ===== COFFEE MUG ===== */}
      <group position={[0.6, -0.28, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.035, 0.11, 8]} />
          {neonMat('#ff00ff', 0.8)}
        </mesh>
        {/* Mug handle */}
        <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.008, 6, 12, Math.PI]} />
          {neonMat('#ff00ff', 0.6)}
        </mesh>
        {/* Steam particles */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.sin(i * 2.1) * 0.015, 0.08 + i * 0.03, Math.cos(i * 2.1) * 0.015]}>
            <sphereGeometry args={[0.012 - i * 0.003, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25 - i * 0.06} />
          </mesh>
        ))}
      </group>

      {/* ===== SMALL HOLOGRAPHIC DISPLAY ===== */}
      <group position={[-0.6, -0.15, 0.35]}>
        <mesh>
          <planeGeometry args={[0.25, 0.15]} />
          <meshStandardMaterial
            color="#020818"
            emissive="#003344"
            emissiveIntensity={1}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.26, 0.16)]} />
          {edgeMat('#00ff88', 0.2)}
        </lineSegments>
        {/* Mini data bars */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.08 + i * 0.045, -0.02, 0.001]}>
            <planeGeometry args={[0.02, 0.03 + i * 0.015]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ===== DESK NEON STRIP ===== */}
      <mesh position={[0, -0.315, 0.68]}>
        <boxGeometry args={[1.85, 0.008, 0.008]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.315, -0.08]}>
        <boxGeometry args={[1.85, 0.008, 0.008]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== CHARACTER PARTICLES (upgraded) =====================
function CharacterParticles({ scrollT }) {
  const count = 100;
  const meshRef = useRef(null);
  const particles = useMemo(() => {
    const temp = [];
    const colors = [new THREE.Color('#00ffff'), new THREE.Color('#ff00ff'), new THREE.Color('#00ff88')];
    for (let i = 0; i < count; i++) {
      temp.push({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 2.5,
          Math.random() * 2.5 - 0.5,
          (Math.random() - 0.5) * 1.5
        ),
        speed: 0.4 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseSize: 0.006 + Math.random() * 0.012,
      });
    }
    return temp;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = scrollT < 0.2 || scrollT > 0.8 ? 1.5 : 0.6;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.offset.x + Math.sin(t * p.speed + p.phase) * 0.35 * intensity,
        p.offset.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.25 * intensity,
        p.offset.z + Math.sin(t * p.speed * 0.5 + p.phase * 2) * 0.25
      );
      const s = p.baseSize * (1 + Math.sin(t * 3 + i * 0.5) * 0.4) * intensity;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.5} />
    </instancedMesh>
  );
}

// ===================== GROUND HOLOGRAPHIC RING =====================
function GroundRing({ scrollT }) {
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.08 + Math.sin(t * 2) * 0.04;
      ringRef.current.rotation.z = t * 0.3;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      ringRef.current.scale.set(s, s, 1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.material.opacity = 0.05 + Math.sin(t * 1.5 + 1) * 0.03;
      ring2Ref.current.rotation.z = -t * 0.2;
    }
  });

  return (
    <group position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.3, 0.85, 48]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.08} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.9, 1.2, 48]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.05} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== TRANSITION BURST EFFECT =====================
function TransitionBurst({ scrollT }) {
  const particlesRef = useRef(null);
  const count = 25;
  const burstData = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      temp.push({
        angle,
        speed: 1.5 + Math.random() * 2,
        offset: new THREE.Vector3(),
      });
    }
    return temp;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Track previous state for burst trigger
  const prevState = useRef(0);
  const burstTimer = useRef(0);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    const t = state.clock.elapsedTime;
    const currentZone = scrollT < 0.2 ? 0 : scrollT < 0.75 ? 1 : 2;

    // Detect zone transition
    if (currentZone !== prevState.current) {
      burstTimer.current = 1;
      prevState.current = currentZone;
    }
    burstTimer.current = Math.max(0, burstTimer.current - delta * 2);

    const burstIntensity = burstTimer.current;
    burstData.forEach((p, i) => {
      const radius = burstIntensity * p.speed * 0.5;
      dummy.position.set(
        Math.cos(p.angle + t * 0.5) * radius,
        Math.sin(p.angle + t * 0.5) * radius,
        Math.sin(t * 2 + i) * 0.1
      );
      const s = burstIntensity * 0.02 * (1 + Math.sin(t * 8 + i) * 0.5);
      dummy.scale.setScalar(Math.max(0.001, s));
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// ===================== DATA STREAM (character to monitor) =====================
function DataStream({ scrollT }) {
  const groupRef = useRef(null);
  const streamParticles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 15; i++) {
      temp.push({
        progress: Math.random(),
        speed: 0.5 + Math.random() * 1.5,
        side: Math.random() > 0.5 ? 1 : -1,
        offset: (Math.random() - 0.5) * 0.1,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT > 0.25 && scrollT < 0.7;
    const targetOpacity = visible ? 1 : 0;

    groupRef.current.children.forEach((child, i) => {
      if (!visible) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0, 0.08);
        return;
      }
      const sp = streamParticles[i % streamParticles.length];
      sp.progress = (sp.progress + sp.speed * 0.008) % 1;
      // Stream from hands area down to keyboard
      const startY = 0.15;
      const endY = -0.35;
      const y = startY + (endY - startY) * sp.progress;
      child.position.y = y;
      child.position.x = sp.side * 0.3 + sp.offset * Math.sin(sp.progress * Math.PI);
      child.position.z = 0.35 + Math.sin(sp.progress * Math.PI) * 0.15;
      child.material.opacity = THREE.MathUtils.lerp(
        child.material.opacity,
        targetOpacity * Math.sin(sp.progress * Math.PI) * 0.6,
        0.1
      );
    });
  });

  return (
    <group ref={groupRef}>
      {streamParticles.map((sp, i) => (
        <mesh key={i} position={[sp.side * 0.3, 0, 0.35]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ===================== MAIN CHARACTER GROUP =====================
function CyberCharacter({ scrollProgress }) {
  const mainGroup = useRef(null);
  const scrollSpring = useRef(new SmoothSpring(40, 10));
  const posXSpring = useRef(new SmoothSpring(35, 10));
  const posYSpring = useRef(new SmoothSpring(35, 10));
  const posZSpring = useRef(new SmoothSpring(35, 10));
  const rotYSpring = useRef(new SmoothSpring(30, 10));
  const scaleSpring = useRef(new SmoothSpring(30, 10));

  const getScrollT = useCallback(() => scrollSpring.current.value, []);

  useFrame((state, delta) => {
    if (!mainGroup.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Smooth scroll tracking with spring
    scrollSpring.current.setTarget(scrollProgress.get());
    scrollSpring.current.update(dt);
    const st = scrollSpring.current.value;

    // === POSITION SPRINGS BASED ON SCROLL ZONE ===
    if (st < 0.2) {
      // HERO: Character on the right side, standing, welcoming
      posXSpring.current.setTarget(1.6);
      posYSpring.current.setTarget(-0.15 + Math.sin(t * 1.2) * 0.04);
      posZSpring.current.setTarget(0.5);
      rotYSpring.current.setTarget(-0.35);
      scaleSpring.current.setTarget(1.15);
    } else if (st < 0.75) {
      // PROJECTS/CODING: Move to center-right, sit at desk
      const transitionT = Math.min((st - 0.2) / 0.1, 1); // Quick transition
      posXSpring.current.setTarget(THREE.MathUtils.lerp(1.6, 0.7, transitionT));
      posYSpring.current.setTarget(THREE.MathUtils.lerp(-0.15, 0.75, transitionT));
      posZSpring.current.setTarget(THREE.MathUtils.lerp(0.5, -0.3, transitionT));
      rotYSpring.current.setTarget(THREE.MathUtils.lerp(-0.35, 0.25, transitionT));
      scaleSpring.current.setTarget(1.1);
    } else {
      // FOOTER: Stand up, move to center, wave goodbye
      const transitionT = Math.min((st - 0.75) / 0.1, 1);
      posXSpring.current.setTarget(THREE.MathUtils.lerp(0.7, 0.3, transitionT));
      posYSpring.current.setTarget(THREE.MathUtils.lerp(0.75, -0.1, transitionT) + Math.sin(t * 1.2) * 0.04);
      posZSpring.current.setTarget(THREE.MathUtils.lerp(-0.3, 0.8, transitionT));
      rotYSpring.current.setTarget(THREE.MathUtils.lerp(0.25, -0.2, transitionT));
      scaleSpring.current.setTarget(1.15);
    }

    // Update all springs
    posXSpring.current.update(dt);
    posYSpring.current.update(dt);
    posZSpring.current.update(dt);
    rotYSpring.current.update(dt);
    scaleSpring.current.update(dt);

    // Apply spring values
    mainGroup.current.position.x = posXSpring.current.value;
    mainGroup.current.position.y = posYSpring.current.value;
    mainGroup.current.position.z = posZSpring.current.value;
    mainGroup.current.rotation.y = rotYSpring.current.value;

    // Scale with breathing
    const breathe = 1 + Math.sin(t * 2) * 0.006;
    const s = scaleSpring.current.value * breathe;
    mainGroup.current.scale.set(s, s * breathe, s);
  });

  return (
    <group ref={mainGroup} position={[1.6, -0.15, 0.5]} scale={[1.15, 1.15, 1.15]}>
      <Head scrollT={getScrollT()} />
      <Torso scrollT={getScrollT()} />
      <Arm side="left" scrollT={getScrollT()} />
      <Arm side="right" scrollT={getScrollT()} />
      <Legs scrollT={getScrollT()} />

      {/* Holographic Chair (appears when sitting) */}
      <HoloChair scrollT={getScrollT()} />

      {/* Desk Setup (appears in coding section) */}
      <DeskSetup scrollT={getScrollT()} />

      {/* Data stream from hands to keyboard */}
      <DataStream scrollT={getScrollT()} />

      {/* Energy orbs around character */}
      <EnergyOrbs scrollT={getScrollT()} />

      {/* Floating holographic UI panels (coding section) */}
      <HoloUIPanels scrollT={getScrollT()} />

      {/* Character ambient particles */}
      <CharacterParticles scrollT={getScrollT()} />

      {/* Transition burst particles */}
      <TransitionBurst scrollT={getScrollT()} />

      {/* Ground holographic ring */}
      <GroundRing scrollT={getScrollT()} />

      {/* Holographic Welcome Text (hero section) */}
      <HoloText scrollT={getScrollT()} text="WELCOME!" yOffset={1.4} color="#00ffff" />

      {/* Holographic Sub Text */}
      <HoloText scrollT={getScrollT()} text="LET'S BUILD" yOffset={1.0} color="#ff00ff" />

      {/* Holographic Goodbye Text (footer) */}
      <GoodbyeHolo scrollT={getScrollT()} />
    </group>
  );
}

export default CyberCharacter;