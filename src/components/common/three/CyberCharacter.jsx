import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ===================== SPRING PHYSICS =====================
class Spring {
  constructor(stiffness = 100, damping = 16) {
    this.value = 0; this.target = 0; this.velocity = 0;
    this.stiffness = stiffness; this.damping = damping;
  }
  update(dt = 1/60) {
    const f = (this.target - this.value) * this.stiffness - this.velocity * this.damping;
    this.velocity += f * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

// ===================== BODY SKELETON DEFINITION =====================
// Key joints as [x, y, z] offsets from character root
const SKELETON = {
  head:        [0, 0.58, 0],
  neck:        [0, 0.42, 0],
  chest:       [0, 0.22, 0],
  spine:       [0, 0.0, 0],
  hip:         [0, -0.12, 0],
  lShoulder:   [-0.28, 0.38, 0],
  rShoulder:   [0.28, 0.38, 0],
  lElbow:      [-0.48, 0.18, 0.05],
  rElbow:      [0.48, 0.18, 0.05],
  lWrist:      [-0.58, -0.02, 0.12],
  rWrist:      [0.58, -0.02, 0.12],
  lHand:       [-0.62, -0.1, 0.18],
  rHand:       [0.62, -0.1, 0.18],
  lHip:        [-0.14, -0.16, 0],
  rHip:        [0.14, -0.16, 0],
  lKnee:       [-0.14, -0.52, 0.08],
  rKnee:       [0.14, -0.52, 0.08],
  lAnkle:      [-0.14, -0.88, 0.0],
  rAnkle:      [0.14, -0.88, 0.0],
  lFoot:       [-0.14, -0.92, 0.06],
  rFoot:       [0.14, -0.92, 0.06],
};

// Connections between joints (bone pairs)
const BONES = [
  ['head','neck'],['neck','chest'],['chest','spine'],['spine','hip'],
  ['neck','lShoulder'],['neck','rShoulder'],
  ['lShoulder','lElbow'],['lElbow','lWrist'],['lWrist','lHand'],
  ['rShoulder','rElbow'],['rElbow','rWrist'],['rWrist','rHand'],
  ['hip','lHip'],['hip','rHip'],
  ['lHip','lKnee'],['lKnee','lAnkle'],['lAnkle','lFoot'],
  ['rHip','rKnee'],['rKnee','rAnkle'],['rAnkle','rFoot'],
  // Extra structural lines
  ['lShoulder','rShoulder'],['lHip','rHip'],
  ['chest','lShoulder'],['chest','rShoulder'],
  ['spine','lHip'],['spine','rHip'],
];

// ===================== HOLOGRAPHIC SHADER =====================
const holoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vY;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    vUv = uv;
    vY = position.y;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const holoFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScanSpeed;
  uniform float uGlitchIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vY;

  float scanLine(float y, float time, float speed) {
    return smoothstep(0.95, 1.0, sin(y * 60.0 - time * speed));
  }

  float holographicNoise(vec2 uv, float time) {
    return sin(uv.x * 40.0 + time * 3.0) * sin(uv.y * 30.0 - time * 2.0) * 0.5 + 0.5;
  }

  void main() {
    // Fresnel edge glow
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);

    // Scan lines
    float scan = scanLine(vY, uTime, uScanSpeed);

    // Holographic noise
    float noise = holographicNoise(vUv, uTime);

    // Glitch effect
    float glitch = step(0.98 - uGlitchIntensity, sin(uTime * 50.0 + vY * 20.0));

    // Base color with fresnel
    vec3 color = uColor * (0.15 + fresnel * 1.5);

    // Add scan line brightness
    color += uColor * scan * 0.4;

    // Add noise variation
    color *= 0.7 + noise * 0.3;

    // Glitch color shift
    if (glitch > 0.0) {
      color = vec3(color.r * 0.5, color.g * 1.5, color.b * 2.0);
    }

    // Edge-only rendering (stronger at edges)
    float alpha = (fresnel * 0.8 + scan * 0.15 + noise * 0.05) * uOpacity;

    // Glitch flash
    alpha += glitch * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ===================== ENERGY BEAM MATERIAL =====================
function HoloShaderMat({ color = '#00ffff', opacity = 0.7, scanSpeed = 4.0, glitchIntensity = 0.02 }) {
  const matRef = useRef(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uScanSpeed: { value: scanSpeed },
    uGlitchIntensity: { value: glitchIntensity },
  }), [color, opacity, scanSpeed, glitchIntensity]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <shaderMaterial ref={matRef} uniforms={uniforms} vertexShader={holoVertexShader} fragmentShader={holoFragmentShader} transparent side={THREE.DoubleSide} depthWrite={false} />;
}

// ===================== ENERGY SKELETON (beams connecting joints) =====================
function EnergySkeleton({ getJointPos }) {
  const lineRef = useRef(null);
  const posArray = useMemo(() => new Float32Array(BONES.length * 6), []);
  const colArray = useMemo(() => {
    const cols = new Float32Array(BONES.length * 6);
    const c1 = new THREE.Color('#00ffff');
    const c2 = new THREE.Color('#ff00ff');
    BONES.forEach((_, i) => {
      const t = i / BONES.length;
      const c = new THREE.Color().lerpColors(c1, c2, t);
      cols[i*6]=c.r; cols[i*6+1]=c.g; cols[i*6+2]=c.b;
      cols[i*6+3]=c.r; cols[i*6+4]=c.g; cols[i*6+5]=c.b;
    });
    return cols;
  }, []);

  useFrame((state) => {
    if (!lineRef.current) return;
    const t = state.clock.elapsedTime;
    // Update bone positions every frame
    BONES.forEach((bone, i) => {
      const from = getJointPos(bone[0]);
      const to = getJointPos(bone[1]);
      if (from && to) {
        posArray[i*6]=from[0]; posArray[i*6+1]=from[1]; posArray[i*6+2]=from[2];
        posArray[i*6+3]=to[0]; posArray[i*6+4]=to[1]; posArray[i*6+5]=to[2];
      }
    });
    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.material.opacity = 0.35 + Math.sin(t * 2) * 0.15;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
        <bufferAttribute attach="attributes-color" args={[colArray, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.4} toneMapped={false} />
    </line>
  );
}

// ===================== JOINT NODES (glowing points at joints) =====================
function JointNodes({ getJointPos, scrollT }) {
  const nodeNames = Object.keys(SKELETON);
  const count = nodeNames.length;
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const pos = getJointPos(nodeNames[i]);
      if (pos) dummy.position.set(pos[0], pos[1], pos[2]);
      const pulse = 1 + Math.sin(t * 3 + i * 0.7) * 0.5;
      dummy.scale.setScalar(0.018 * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// ===================== BODY PARTICLE CLOUD (the main visual body) =====================
function BodyParticleCloud({ scrollT, getJointPos }) {
  const count = 600;
  const meshRef = useRef(null);
  const particles = useMemo(() => {
    const temp = [];
    const jointNames = Object.keys(SKELETON);
    for (let i = 0; i < count; i++) {
      // Attach particle to a random joint with some spread
      const jointName = jointNames[Math.floor(Math.random() * jointNames.length)];
      const spread = 0.08 + Math.random() * 0.12;
      temp.push({
        joint: jointName,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        ),
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: 0.01 + Math.random() * 0.06,
        size: 0.003 + Math.random() * 0.008,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color('#00ffff'), new THREE.Color('#ff00ff'), new THREE.Color('#00ff88'), new THREE.Color('#ffffff')];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = (scrollT < 0.2 || scrollT > 0.8) ? 1.5 : 0.8;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const jointPos = getJointPos(p.joint);
      if (!jointPos) continue;

      dummy.position.set(
        jointPos[0] + p.offset.x + Math.sin(t * p.speed + p.phase) * p.orbitRadius * intensity,
        jointPos[1] + p.offset.y + Math.cos(t * p.speed * 0.8 + p.phase) * p.orbitRadius * intensity,
        jointPos[2] + p.offset.z + Math.sin(t * p.speed * 0.6 + p.phase * 2) * p.orbitRadius
      );

      const s = p.size * (1 + Math.sin(t * 4 + i * 0.3) * 0.5) * intensity;
      dummy.scale.setScalar(Math.max(0.001, s));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.7} vertexColors />
    </instancedMesh>
  );
}

// ===================== ENERGY AURA =====================
function EnergyAura({ scrollT }) {
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const ring3 = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const intensity = (scrollT < 0.2 || scrollT > 0.8) ? 1 : 0.5;

    if (ring1.current) {
      ring1.current.rotation.x = t * 0.3;
      ring1.current.rotation.y = t * 0.5;
      ring1.current.material.opacity = (0.08 + Math.sin(t * 2) * 0.04) * intensity;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.4;
      ring2.current.rotation.z = t * 0.3;
      ring2.current.material.opacity = (0.05 + Math.sin(t * 1.5 + 1) * 0.03) * intensity;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.2;
      ring3.current.rotation.z = -t * 0.6;
      ring3.current.material.opacity = (0.04 + Math.sin(t * 2.5 + 2) * 0.02) * intensity;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      <mesh ref={ring1} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.6, 0.008, 8, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.08} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} rotation={[1, 0.5, 0]}>
        <torusGeometry args={[0.75, 0.006, 8, 64]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.05} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3} rotation={[0.3, 0, 1]}>
        <torusGeometry args={[0.9, 0.005, 8, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.04} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ===================== HOLOGRAPHIC TEXT =====================
function HoloText3D({ text, yOffset, color, scrollT, visibleRange }) {
  const groupRef = useRef(null);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 96);
    ctx.font = 'bold 44px monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 48);
    // Double pass for extra glow
    ctx.shadowBlur = 60;
    ctx.globalAlpha = 0.5;
    ctx.fillText(text, 256, 48);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text, color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const [min, max] = visibleRange;
    const inRange = scrollT >= min && scrollT <= max;
    const fadeIn = scrollT >= min && scrollT <= min + 0.05;
    const fadeOut = scrollT >= max - 0.05 && scrollT <= max;

    let targetOpacity = 0;
    let targetY = yOffset;
    if (inRange) {
      targetOpacity = 1;
      targetY += Math.sin(t * 1.5) * 0.06;
    }
    if (fadeIn) targetOpacity = (scrollT - min) / 0.05;
    if (fadeOut) targetOpacity = (max - scrollT) / 0.05;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, inRange ? 1 : 0, 0.05));
    // Holographic flicker
    if (inRange && Math.random() < 0.015) {
      groupRef.current.position.x += (Math.random() - 0.5) * 0.008;
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0.3]} scale={[0, 0, 0]}>
      <mesh>
        <planeGeometry args={[2.2, 0.42]} />
        <meshBasicMaterial map={texture} transparent opacity={0.9} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Holo border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.3, 0.47)]} />
        <lineBasicMaterial color={color} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// ===================== DATA RAIN (vertical streams around character) =====================
function CharacterDataRain({ scrollT }) {
  const count = 80;
  const meshRef = useRef(null);
  const drops = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 1,
        y: Math.random() * 3 - 1,
        speed: 1 + Math.random() * 3,
        char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
      });
    }
    return temp;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const visible = scrollT > 0.2 && scrollT < 0.7;
    const targetAlpha = visible ? 0.4 : 0;

    for (let i = 0; i < count; i++) {
      const d = drops[i];
      d.y -= d.speed * 0.02;
      if (d.y < -1.5) { d.y = 2; d.x = (Math.random() - 0.5) * 2; }

      dummy.position.set(d.x, d.y, d.z);
      const s = 0.012 * (visible ? 1 : 0.1);
      dummy.scale.set(Math.max(0.001, s * 2), Math.max(0.001, s * 3), 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, targetAlpha, 0.04);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  );
}

// ===================== HOLOGRAPHIC DESK (coding state) =====================
function HoloDesk({ scrollT }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const inRange = scrollT > 0.18 && scrollT < 0.78;
    const fadeIn = scrollT > 0.18 && scrollT < 0.25;
    const fadeOut = scrollT > 0.7 && scrollT < 0.78;

    let scale = 0;
    if (inRange) {
      if (fadeIn) scale = (scrollT - 0.18) / 0.07;
      else if (fadeOut) scale = (0.78 - scrollT) / 0.08;
      else scale = 1;
    }

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.05));
  });

  const codeLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 12; i++) {
      lines.push({
        width: 0.1 + Math.random() * 0.55,
        x: -0.35 + Math.random() * 0.1,
        y: 0.2 - i * 0.032,
        color: ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00', '#6633ff'][Math.floor(Math.random() * 5)],
      });
    }
    return lines;
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.15, 0.35]} scale={[0, 0, 0]}>
      {/* Holographic desk surface */}
      <mesh position={[0, -0.35, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.6, 0.02, 0.6]} />
        <HoloShaderMat color="#00ffff" opacity={0.15} scanSpeed={6} />
      </mesh>
      {/* Desk edge glow */}
      <mesh position={[0, -0.35, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.62, 0.005, 0.62]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} toneMapped={false} />
      </mesh>

      {/* Monitor */}
      <group position={[0, 0.0, -0.05]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.85, 0.5, 0.02]} />
          <meshStandardMaterial color="#050515" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0.15, 0.012]}>
          <planeGeometry args={[0.78, 0.43]} />
          <meshStandardMaterial color="#020818" emissive="#003355" emissiveIntensity={2} toneMapped={false} transparent opacity={0.9} />
        </mesh>
        {/* Code lines */}
        {codeLines.map((line, i) => (
          <mesh key={i} position={[line.x, line.y, 0.02]}>
            <planeGeometry args={[line.width, 0.008]} />
            <meshBasicMaterial color={line.color} toneMapped={false} transparent opacity={0.85} />
          </mesh>
        ))}
        {/* Screen frame */}
        <lineSegments position={[0, 0.15, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.86, 0.51, 0.025)]} />
          <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </lineSegments>
      </group>

      {/* Keyboard holographic */}
      <mesh position={[0, -0.33, 0.18]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.5, 0.01, 0.16]} />
        <HoloShaderMat color="#00ffff" opacity={0.12} scanSpeed={8} />
      </mesh>
      {/* Keyboard edge */}
      <mesh position={[0, -0.33, 0.18]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.52, 0.005, 0.17]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.15} toneMapped={false} />
      </mesh>

      {/* Desk neon strips */}
      <mesh position={[0, -0.34, 0.3]}>
        <boxGeometry args={[1.55, 0.005, 0.005]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== TRANSITION SHOCKWAVE =====================
function TransitionShockwave({ scrollT }) {
  const ringRef = useRef(null);
  const prevZone = useRef(-1);
  const timer = useRef(0);

  useFrame((state, delta) => {
    if (!ringRef.current) return;
    const zone = scrollT < 0.2 ? 0 : scrollT < 0.75 ? 1 : 2;
    if (zone !== prevZone.current) {
      timer.current = 1;
      prevZone.current = zone;
    }
    timer.current = Math.max(0, timer.current - delta * 1.5);
    const burst = timer.current;
    const s = 0.5 + (1 - burst) * 2;
    ringRef.current.scale.set(s, s, 1);
    ringRef.current.material.opacity = burst * 0.5;
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.35, 48]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ===================== FLOATING ORBITAL FRAGMENTS =====================
function OrbitalFragments({ scrollT }) {
  const count = 20;
  const meshRef = useRef(null);
  const fragments = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        orbitRadius: 0.5 + Math.random() * 0.8,
        orbitSpeed: 0.3 + Math.random() * 0.8,
        yOffset: (Math.random() - 0.5) * 2,
        ySpeed: 0.5 + Math.random(),
        phase: Math.random() * Math.PI * 2,
        size: [0.02, 0.04, 0.015, 0.03][Math.floor(Math.random() * 4)],
        rotationSpeed: Math.random() * 2 - 1,
      });
    }
    return temp;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = (scrollT < 0.15 || scrollT > 0.8) ? 1.2 : 0.4;

    for (let i = 0; i < count; i++) {
      const f = fragments[i];
      const angle = t * f.orbitSpeed + f.phase;
      dummy.position.set(
        Math.cos(angle) * f.orbitRadius * intensity,
        f.yOffset + Math.sin(t * f.ySpeed + f.phase) * 0.3,
        Math.sin(angle) * f.orbitRadius * 0.5
      );
      dummy.rotation.set(t * f.rotationSpeed, t * f.rotationSpeed * 0.7, 0);
      dummy.scale.setScalar(f.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.4} toneMapped={false} />
    </instancedMesh>
  );
}

// ===================== HOLOGRAPHIC HEAD VISOR =====================
function HoloVisor({ scrollT }) {
  const visorRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (visorRef.current) {
      visorRef.current.material.opacity = 0.6 + Math.sin(t * 3) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 4 + Math.sin(t * 5) * 2;
      glowRef.current.scale.x = 1 + Math.sin(t * 4) * 0.05;
    }
  });

  return (
    <group position={[0, 0.58, 0]}>
      {/* Head holographic mesh */}
      <mesh>
        <sphereGeometry args={[0.16, 16, 12]} />
        <HoloShaderMat color="#00ffff" opacity={0.25} scanSpeed={5} glitchIntensity={0.04} />
      </mesh>
      {/* Visor */}
      <mesh ref={visorRef} position={[0, 0.02, 0.12]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.02]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      {/* Visor glow line */}
      <mesh ref={glowRef} position={[0, 0.02, 0.13]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.015, 0.005]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0.06, 0.2, 0]}>
        <cylinderGeometry args={[0.005, 0.008, 0.12, 4]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh position={[0.06, 0.27, 0]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#00ff88" toneMapped={false} transparent opacity={0.8 + Math.sin(Date.now() * 0.005) * 0.2} />
      </mesh>
    </group>
  );
}

// ===================== HOLOGRAPHIC TORSO MESH =====================
function HoloTorso({ scrollT }) {
  const coreRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const active = scrollT > 0.2 && scrollT < 0.75;
      coreRef.current.material.emissiveIntensity = active ? 4 + Math.sin(t * 6) * 2 : 2 + Math.sin(t * 2) * 0.5;
      coreRef.current.scale.setScalar(0.8 + Math.sin(t * (active ? 5 : 2)) * 0.15);
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Torso holo mesh */}
      <mesh>
        <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
        <HoloShaderMat color="#00ffff" opacity={0.2} scanSpeed={4} glitchIntensity={0.03} />
      </mesh>
      {/* Chest plate detail */}
      <mesh position={[0, 0.08, 0.14]}>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <HoloShaderMat color="#0088ff" opacity={0.15} scanSpeed={6} glitchIntensity={0.02} />
      </mesh>
      {/* Energy core */}
      <mesh ref={coreRef} position={[0, 0.1, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Shoulder connections */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.26, 0.15, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ff00ff" toneMapped={false} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Belt */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.35, 0.03, 0.2]} />
        <meshBasicMaterial color="#ff3366" transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===================== MAIN CHARACTER =====================
function CyberCharacter({ scrollProgress }) {
  const mainGroup = useRef(null);
  const scrollSpring = useRef(new Spring(40, 10));
  const posSprings = useRef({
    x: new Spring(30, 10), y: new Spring(30, 10), z: new Spring(30, 10),
    rotY: new Spring(25, 10), scale: new Spring(25, 8),
  });

  // Animated joint positions (modified by scroll for poses)
  const jointPositions = useRef({});
  // Initialize with default skeleton
  useMemo(() => {
    Object.keys(SKELETON).forEach(k => {
      jointPositions.current[k] = [...SKELETON[k]];
    });
  }, []);

  const getJointPos = useCallback((name) => jointPositions.current[name], []);

  // Pose springs for each joint
  const poseSprings = useRef({});

  useFrame((state, delta) => {
    if (!mainGroup.current) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Smooth scroll
    scrollSpring.current.setTarget(scrollProgress.get());
    scrollSpring.current.update(dt);
    const st = scrollSpring.current.value;

    // === POSE CALCULATION ===
    const joints = jointPositions.current;

    if (st < 0.2) {
      // ===== WELCOME POSE =====
      // Standing, right arm raised waving
      const wave = Math.sin(t * 4.5) * 0.3;
      const wave2 = Math.sin(t * 3) * 0.1;

      // Right arm: raised and waving
      joints.rShoulder = [0.28, 0.38, 0];
      joints.rElbow = [0.52, 0.55 + wave2, 0.15];
      joints.rWrist = [0.45 + wave, 0.75 + wave * 0.5, 0.2];
      joints.rHand = [0.4 + wave * 1.2, 0.85 + wave * 0.3, 0.25];

      // Left arm: relaxed, slight sway
      joints.lShoulder = [-0.28, 0.38, 0];
      joints.lElbow = [-0.5, 0.18 + Math.sin(t * 1.5) * 0.03, 0.05];
      joints.lWrist = [-0.55, -0.0 + Math.sin(t * 1.2) * 0.02, 0.1];
      joints.lHand = [-0.58, -0.08 + Math.sin(t * 1.2) * 0.02, 0.15];

      // Standing legs
      joints.lHip = [-0.14, -0.16, 0];
      joints.rHip = [0.14, -0.16, 0];
      joints.lKnee = [-0.14, -0.52, 0.02];
      joints.rKnee = [0.14, -0.52, 0.02];
      joints.lAnkle = [-0.14, -0.88, 0];
      joints.rAnkle = [0.14, -0.88, 0];
      joints.lFoot = [-0.14, -0.92, 0.06];
      joints.rFoot = [0.14, -0.92, 0.06];

      // Head looking forward with slight friendly tilt
      joints.head = [0, 0.58, 0];
      joints.neck = [0, 0.42, 0];

    } else if (st < 0.75) {
      // ===== CODING POSE =====
      // Transition blend
      const blend = Math.min((st - 0.2) / 0.1, 1);
      const typing = Math.sin(t * 8);

      // Both arms forward to desk
      joints.rShoulder = [0.28, 0.36, 0];
      joints.rElbow = [0.4, 0.15, 0.25];
      joints.rWrist = [0.2 + typing * 0.02, -0.05, 0.4];
      joints.rHand = [0.15 + typing * 0.03, -0.12, 0.45];

      joints.lShoulder = [-0.28, 0.36, 0];
      joints.lElbow = [-0.4, 0.15, 0.25];
      joints.lWrist = [-0.2 + typing * -0.02, -0.05, 0.4];
      joints.lHand = [-0.15 + typing * -0.03, -0.12, 0.45];

      // Sitting legs
      joints.lHip = [-0.14, -0.16, 0];
      joints.rHip = [0.14, -0.16, 0];
      joints.lKnee = [-0.14, -0.4, 0.3];
      joints.rKnee = [0.14, -0.4, 0.3];
      joints.lAnkle = [-0.14, -0.4, 0.6];
      joints.rAnkle = [0.14, -0.4, 0.6];
      joints.lFoot = [-0.14, -0.42, 0.65];
      joints.rFoot = [0.14, -0.42, 0.65];

      // Head slightly tilted down (looking at screen)
      joints.head = [0, 0.56, 0.03];
      joints.neck = [0, 0.41, 0.02];

    } else {
      // ===== GOODBYE POSE =====
      const blend = Math.min((st - 0.75) / 0.1, 1);
      const wave1 = Math.sin(t * 5) * 0.35;
      const wave2 = Math.sin(t * 4.5 + Math.PI) * 0.35;

      // Both arms waving
      joints.rShoulder = [0.28, 0.38, 0];
      joints.rElbow = [0.5, 0.5, 0.1];
      joints.rWrist = [0.42 + wave1, 0.72 + wave1 * 0.3, 0.15];
      joints.rHand = [0.38 + wave1 * 1.1, 0.82 + wave1 * 0.3, 0.2];

      joints.lShoulder = [-0.28, 0.38, 0];
      joints.lElbow = [-0.5, 0.5, 0.1];
      joints.lWrist = [-0.42 + wave2, 0.72 + wave2 * 0.3, 0.15];
      joints.lHand = [-0.38 + wave2 * 1.1, 0.82 + wave2 * 0.3, 0.2];

      // Standing legs
      joints.lHip = [-0.14, -0.16, 0];
      joints.rHip = [0.14, -0.16, 0];
      joints.lKnee = [-0.14, -0.52, 0.02];
      joints.rKnee = [0.14, -0.52, 0.02];
      joints.lAnkle = [-0.14, -0.88, 0];
      joints.rAnkle = [0.14, -0.88, 0];
      joints.lFoot = [-0.14, -0.92, 0.06];
      joints.rFoot = [0.14, -0.92, 0.06];

      joints.head = [0, 0.58, 0];
      joints.neck = [0, 0.42, 0];
    }

    // === POSITION SPRINGS ===
    const ps = posSprings.current;
    if (st < 0.2) {
      ps.x.setTarget(2.0);
      ps.y.setTarget(-0.1 + Math.sin(t * 1.2) * 0.03);
      ps.z.setTarget(0.5);
      ps.rotY.setTarget(-0.3);
      ps.scale.setTarget(1.0);
    } else if (st < 0.75) {
      const b = Math.min((st - 0.2) / 0.12, 1);
      ps.x.setTarget(THREE.MathUtils.lerp(2.0, 1.2, b));
      ps.y.setTarget(THREE.MathUtils.lerp(-0.1, 0.5, b));
      ps.z.setTarget(THREE.MathUtils.lerp(0.5, 0, b));
      ps.rotY.setTarget(THREE.MathUtils.lerp(-0.3, 0.2, b));
      ps.scale.setTarget(1.0);
    } else {
      const b = Math.min((st - 0.75) / 0.12, 1);
      ps.x.setTarget(THREE.MathUtils.lerp(1.2, 0.5, b));
      ps.y.setTarget(THREE.MathUtils.lerp(0.5, -0.05, b) + Math.sin(t * 1.2) * 0.03);
      ps.z.setTarget(THREE.MathUtils.lerp(0, 0.8, b));
      ps.rotY.setTarget(THREE.MathUtils.lerp(0.2, -0.15, b));
      ps.scale.setTarget(1.0);
    }

    Object.values(ps).forEach(s => s.update(dt));

    mainGroup.current.position.x = ps.x.value;
    mainGroup.current.position.y = ps.y.value;
    mainGroup.current.position.z = ps.z.value;
    mainGroup.current.rotation.y = ps.rotY.value;
    const breathe = 1 + Math.sin(t * 2) * 0.005;
    mainGroup.current.scale.setScalar(ps.scale.value * breathe);
  });

  return (
    <group ref={mainGroup} position={[2.0, -0.1, 0.5]}>
      {/* Holographic Head */}
      <HoloVisor scrollT={scrollSpring.current.value} />

      {/* Holographic Torso */}
      <HoloTorso scrollT={scrollSpring.current.value} />

      {/* Energy Skeleton Beams */}
      <EnergySkeleton getJointPos={getJointPos} />

      {/* Joint Glow Nodes */}
      <JointNodes getJointPos={getJointPos} scrollT={scrollSpring.current.value} />

      {/* Body Particle Cloud - forms the visible body */}
      <BodyParticleCloud scrollT={scrollSpring.current.value} getJointPos={getJointPos} />

      {/* Energy Aura Rings */}
      <EnergyAura scrollT={scrollSpring.current.value} />

      {/* Orbital Fragments */}
      <OrbitalFragments scrollT={scrollSpring.current.value} />

      {/* Holographic Desk (coding section) */}
      <HoloDesk scrollT={scrollSpring.current.value} />

      {/* Character Data Rain (coding section) */}
      <CharacterDataRain scrollT={scrollSpring.current.value} />

      {/* Transition Shockwave */}
      <TransitionShockwave scrollT={scrollSpring.current.value} />

      {/* Holographic Texts */}
      <HoloText3D text="WELCOME!" yOffset={1.3} color="#00ffff" scrollT={scrollSpring.current.value} visibleRange={[0, 0.22]} />
      <HoloText3D text="LET'S CODE" yOffset={0.9} color="#ff00ff" scrollT={scrollSpring.current.value} visibleRange={[0.22, 0.35]} />
      <HoloText3D text="SEE YOU!" yOffset={1.3} color="#ff00ff" scrollT={scrollSpring.current.value} visibleRange={[0.82, 1.0]} />
    </group>
  );
}

export default CyberCharacter;