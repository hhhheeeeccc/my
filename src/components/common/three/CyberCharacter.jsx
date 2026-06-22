import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ===================== NEON WIREFRAME MATERIAL =====================
function neonMat(color = '#00ffff', emissiveIntensity = 2) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
      transparent
      opacity={0.9}
      metalness={0.9}
      roughness={0.1}
    />
  );
}

function neonEdgeMat(color = '#00ffff') {
  return <lineBasicMaterial color={color} transparent opacity={0.6} />;
}

// ===================== CHARACTER HEAD =====================
function Head({ scrollT }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    // Look at mouse slightly
    const mx = state.pointer.x * 0.15;
    const my = -state.pointer.y * 0.1;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx, 0.08);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, my, 0.08);
    // Wave head slightly in greeting pose
    if (scrollT < 0.25) {
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        Math.sin(state.clock.elapsedTime * 3) * 0.1,
        0.1
      );
    } else {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
    }
  });

  return (
    <group ref={group} position={[0, 0.55, 0]}>
      {/* Head sphere */}
      <mesh>
        <boxGeometry args={[0.32, 0.38, 0.32]} />
        {neonMat('#00ffff', 1.5)}
      </mesh>
      {/* Visor / Eyes */}
      <mesh position={[0, 0.02, 0.17]}>
        <boxGeometry args={[0.28, 0.08, 0.02]} />
        <meshStandardMaterial color="#0a0a2e" emissive="#ff00ff" emissiveIntensity={3} />
      </mesh>
      {/* Eye glow line */}
      <mesh position={[0, 0.02, 0.18]}>
        <boxGeometry args={[0.22, 0.02, 0.01]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
        {neonMat('#00ff88', 3)}
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* Head edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.33, 0.39, 0.33)]} />
        {neonEdgeMat('#00ffff')}
      </lineSegments>
    </group>
  );
}

// ===================== CHARACTER TORSO =====================
function Torso() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main torso */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.45, 0.5, 0.25]} />
        {neonMat('#0a1628', 0.5)}
      </mesh>
      {/* Chest neon stripe */}
      <mesh position={[0, 0.2, 0.13]}>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.12, 0.13]}>
        <boxGeometry args={[0.2, 0.02, 0.01]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Torso edges */}
      <lineSegments position={[0, 0.15, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.46, 0.51, 0.26)]} />
        {neonEdgeMat('#00ffff')}
      </lineSegments>
    </group>
  );
}

// ===================== ARM =====================
function Arm({ side = 'left', scrollT }) {
  const upperRef = useRef(null);
  const lowerRef = useRef(null);
  const isLeft = side === 'left';
  const xSign = isLeft ? -1 : 1;

  useFrame((state) => {
    if (!upperRef.current || !lowerRef.current) return;
    const t = state.clock.elapsedTime;

    if (scrollT < 0.25) {
      // GREETING: One arm waves
      if (!isLeft) {
        // Right arm waves
        upperRef.current.rotation.z = THREE.MathUtils.lerp(upperRef.current.rotation.z, Math.PI * 0.8, 0.05);
        upperRef.current.rotation.x = THREE.MathUtils.lerp(upperRef.current.rotation.x, -0.3, 0.05);
        lowerRef.current.rotation.z = THREE.MathUtils.lerp(lowerRef.current.rotation.z, Math.sin(t * 5) * 0.4 + 0.3, 0.1);
      } else {
        // Left arm relaxed
        upperRef.current.rotation.z = THREE.MathUtils.lerp(upperRef.current.rotation.z, 0.1, 0.05);
        upperRef.current.rotation.x = THREE.MathUtils.lerp(upperRef.current.rotation.x, 0, 0.05);
        lowerRef.current.rotation.z = THREE.MathUtils.lerp(lowerRef.current.rotation.z, 0, 0.05);
      }
    } else if (scrollT < 0.75) {
      // CODING: Both arms forward on desk
      upperRef.current.rotation.z = THREE.MathUtils.lerp(upperRef.current.rotation.z, xSign * 0.5, 0.05);
      upperRef.current.rotation.x = THREE.MathUtils.lerp(upperRef.current.rotation.x, -Math.PI * 0.35, 0.05);
      lowerRef.current.rotation.z = THREE.MathUtils.lerp(lowerRef.current.rotation.z, -0.5, 0.05);
    } else {
      // GOODBYE: Both arms wave
      upperRef.current.rotation.z = THREE.MathUtils.lerp(upperRef.current.rotation.z, xSign * Math.PI * 0.6, 0.05);
      upperRef.current.rotation.x = THREE.MathUtils.lerp(upperRef.current.rotation.x, -0.2, 0.05);
      lowerRef.current.rotation.z = THREE.MathUtils.lerp(
        lowerRef.current.rotation.z,
        Math.sin(t * 4 + (isLeft ? 0 : Math.PI)) * 0.4 + 0.3,
        0.1
      );
    }
  });

  return (
    <group position={[xSign * 0.3, 0.32, 0]}>
      {/* Upper arm */}
      <group ref={upperRef}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.12, 0.32, 0.12]} />
          {neonMat('#0a1628', 0.5)}
        </mesh>
        <lineSegments position={[0, -0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.13, 0.33, 0.13)]} />
          {neonEdgeMat('#00ffff')}
        </lineSegments>
        {/* Elbow joint glow */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* Lower arm */}
        <group ref={lowerRef} position={[0, -0.32, 0]}>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.1, 0.26, 0.1]} />
            {neonMat('#0a1628', 0.5)}
          </mesh>
          <lineSegments position={[0, -0.12, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.11, 0.27, 0.11)]} />
            {neonEdgeMat('#00ffff')}
          </lineSegments>
          {/* Hand */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.09, 0.08, 0.06]} />
            {neonMat('#00ffff', 1)}
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ===================== LEGS =====================
function Legs({ scrollT }) {
  const leftUpper = useRef(null);
  const leftLower = useRef(null);
  const rightUpper = useRef(null);
  const rightLower = useRef(null);

  useFrame(() => {
    [leftUpper, rightUpper].forEach((ref) => {
      if (ref.current) {
        if (scrollT < 0.25 || scrollT >= 0.75) {
          // Standing
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.05);
        } else {
          // Sitting - legs forward
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -Math.PI * 0.45, 0.05);
        }
      }
    });
    [leftLower, rightLower].forEach((ref) => {
      if (ref.current) {
        if (scrollT < 0.25 || scrollT >= 0.75) {
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.05);
        } else {
          // Sitting - lower legs down
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, Math.PI * 0.45, 0.05);
        }
      }
    });
  });

  const Leg = ({ side }) => {
    const xSign = side === 'left' ? -1 : 1;
    return (
      <group position={[xSign * 0.12, -0.12, 0]}>
        <group ref={side === 'left' ? leftUpper : rightUpper}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.14, 0.42, 0.14]} />
            {neonMat('#0a1628', 0.4)}
          </mesh>
          <lineSegments position={[0, -0.2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.15, 0.43, 0.15)]} />
            {neonEdgeMat('#00ffff')}
          </lineSegments>
          {/* Knee joint */}
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <group ref={side === 'left' ? leftLower : rightLower} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <boxGeometry args={[0.12, 0.38, 0.12]} />
              {neonMat('#0a1628', 0.4)}
            </mesh>
            <lineSegments position={[0, -0.18, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.13, 0.39, 0.13)]} />
              {neonEdgeMat('#00ffff')}
            </lineSegments>
            {/* Foot */}
            <mesh position={[0, -0.4, 0.04]}>
              <boxGeometry args={[0.12, 0.06, 0.2]} />
              {neonMat('#00ffff', 1)}
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

// ===================== DESK + COMPUTER =====================
function DeskSetup({ scrollT }) {
  const groupRef = useRef(null);
  const screenGlowRef = useRef(null);
  const codeLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 8; i++) {
      lines.push({
        width: 0.15 + Math.random() * 0.5,
        x: -0.3 + Math.random() * 0.1,
        y: 0.15 - i * 0.04,
        color: ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00'][Math.floor(Math.random() * 4)],
      });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Desk visible only in coding section
    const targetScale = (scrollT > 0.15 && scrollT < 0.85) ? 1 : 0;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.04));
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetScale === 0 ? 1 : 0,
      0.04
    );

    // Screen flicker
    if (screenGlowRef.current) {
      screenGlowRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Desk surface */}
      <mesh position={[0, -0.35, 0.3]}>
        <boxGeometry args={[1.8, 0.06, 0.7]} />
        {neonMat('#0a1628', 0.3)}
      </mesh>
      <lineSegments position={[0, -0.35, 0.3]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.81, 0.07, 0.71)]} />
        {neonEdgeMat('#00ffff')}
      </lineSegments>

      {/* Desk legs */}
      {[[-0.8, -0.15], [0.8, -0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.65, z]}>
          <boxGeometry args={[0.04, 0.58, 0.04]} />
          {neonMat('#00ffff', 1)}
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.0, 0.3]}>
        {/* Monitor body */}
        <mesh position={[0, 0.2, 0.05]}>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          <meshStandardMaterial color="#0a0a1a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Screen (glowing) */}
        <mesh ref={screenGlowRef} position={[0, 0.2, 0.07]}>
          <planeGeometry args={[0.72, 0.42]} />
          <meshStandardMaterial color="#020815" emissive="#00ffff" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        {/* Code lines on screen */}
        {codeLines.map((line, i) => (
          <mesh key={i} position={[line.x, line.y, 0.08]}>
            <planeGeometry args={[line.width, 0.012]} />
            <meshStandardMaterial color={line.color} emissive={line.color} emissiveIntensity={3} toneMapped={false} />
          </mesh>
        ))}
        {/* Monitor stand */}
        <mesh position={[0, -0.08, 0.05]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
          {neonMat('#333', 0.5)}
        </mesh>
        {/* Monitor base */}
        <mesh position={[0, -0.18, 0.05]}>
          <boxGeometry args={[0.25, 0.02, 0.15]} />
          {neonMat('#333', 0.5)}
        </mesh>
        {/* Monitor edges */}
        <lineSegments position={[0, 0.2, 0.05]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.81, 0.51, 0.05)]} />
          {neonEdgeMat('#00ffff')}
        </lineSegments>
      </group>

      {/* Keyboard */}
      <mesh position={[0, -0.31, 0.45]}>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#00ffff" emissiveIntensity={0.3} />
      </mesh>
      <lineSegments position={[0, -0.31, 0.45]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.46, 0.03, 0.16)]} />
        {neonEdgeMat('#00ffff')}
      </lineSegments>
      {/* Keyboard keys (grid) */}
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => (
          <mesh key={`${row}-${col}`} position={[-0.19 + col * 0.042, -0.295, 0.38 + row * 0.04]}>
            <boxGeometry args={[0.035, 0.005, 0.03]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={Math.sin(Date.now() * 0.001 + row * 10 + col) > 0.3 ? 1.5 : 0.3}
              toneMapped={false}
            />
          </mesh>
        ))
      )}

      {/* Coffee mug */}
      <group position={[0.55, -0.28, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.04, 0.1, 8]} />
          {neonMat('#ff00ff', 1)}
        </mesh>
        {/* Steam */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Desk neon strip */}
      <mesh position={[0, -0.31, 0.66]}>
        <boxGeometry args={[1.75, 0.01, 0.01]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== FLOATING PARTICLES AROUND CHARACTER =====================
function CharacterParticles() {
  const count = 80;
  const meshRef = useRef(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 2 - 0.5,
          (Math.random() - 0.5) * 1
        ),
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.offset.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.offset.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.2,
        p.offset.z + Math.sin(t * p.speed * 0.5 + p.phase * 2) * 0.2
      );
      dummy.scale.setScalar(0.01 + Math.sin(t * 3 + i) * 0.005);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.6} />
    </instancedMesh>
  );
}

// ===================== MAIN CHARACTER GROUP =====================
function CyberCharacter({ scrollProgress }) {
  const mainGroup = useRef(null);
  const scrollT = useRef(0);

  useFrame((state) => {
    if (!mainGroup.current) return;
    const t = state.clock.elapsedTime;

    // Smooth scroll tracking
    scrollT.current = THREE.MathUtils.lerp(scrollT.current, scrollProgress.get(), 0.05);
    const st = scrollT.current;

    // === POSITION BASED ON SCROLL ===
    if (st < 0.25) {
      // HERO: Character on the right side, standing
      const targetX = 1.8;
      const targetY = -0.2 + Math.sin(t * 1.5) * 0.05;
      mainGroup.current.position.x = THREE.MathUtils.lerp(mainGroup.current.position.x, targetX, 0.04);
      mainGroup.current.position.y = THREE.MathUtils.lerp(mainGroup.current.position.y, targetY, 0.04);
      mainGroup.current.position.z = THREE.MathUtils.lerp(mainGroup.current.position.z, 0, 0.04);
      mainGroup.current.rotation.y = THREE.MathUtils.lerp(mainGroup.current.rotation.y, -0.3, 0.04);
    } else if (st < 0.75) {
      // PROJECTS: Move to center, sit at desk
      const targetX = 0.8;
      const targetY = 0.8; // Higher up = sitting at desk level
      mainGroup.current.position.x = THREE.MathUtils.lerp(mainGroup.current.position.x, targetX, 0.04);
      mainGroup.current.position.y = THREE.MathUtils.lerp(mainGroup.current.position.y, targetY, 0.04);
      mainGroup.current.position.z = THREE.MathUtils.lerp(mainGroup.current.position.z, -0.5, 0.04);
      mainGroup.current.rotation.y = THREE.MathUtils.lerp(mainGroup.current.rotation.y, 0.2, 0.04);
    } else {
      // FOOTER: Move back to center, stand and wave
      const targetX = 0.5;
      const targetY = -0.2 + Math.sin(t * 1.5) * 0.05;
      mainGroup.current.position.x = THREE.MathUtils.lerp(mainGroup.current.position.x, targetX, 0.04);
      mainGroup.current.position.y = THREE.MathUtils.lerp(mainGroup.current.position.y, targetY, 0.04);
      mainGroup.current.position.z = THREE.MathUtils.lerp(mainGroup.current.position.z, 0, 0.04);
      mainGroup.current.rotation.y = THREE.MathUtils.lerp(mainGroup.current.rotation.y, -0.15, 0.04);
    }

    // Subtle idle breathing
    mainGroup.current.scale.y = 1 + Math.sin(t * 2) * 0.008;
  });

  return (
    <group ref={mainGroup} position={[1.8, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      <Head scrollT={scrollT.current} />
      <Torso />
      <Arm side="left" scrollT={scrollT.current} />
      <Arm side="right" scrollT={scrollT.current} />
      <Legs scrollT={scrollT.current} />
      <CharacterParticles />
      <DeskSetup scrollT={scrollT.current} />

      {/* Ground glow circle under character */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <ringGeometry args={[0.3, 0.8, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default CyberCharacter;