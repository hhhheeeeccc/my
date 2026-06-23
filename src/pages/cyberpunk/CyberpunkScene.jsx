import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Scanline, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import './cyberpunk.css'

// ===================== NEON GRID FLOOR =====================
function NeonGrid() {
  const gridRef = useRef(null)
  const gridUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#00ffff') },
    uColor2: { value: new THREE.Color('#ff00ff') },
  }), [])

  const gridMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: gridUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);

          float dist = length(vUv - 0.5);
          float pulse = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;

          vec3 color = mix(uColor1, uColor2, sin(vUv.x * 6.28 + uTime * 0.5) * 0.5 + 0.5);

          float edgeFade = 1.0 - smoothstep(0.3, 0.5, dist);

          float alpha = gridAlpha * (0.3 + pulse * 0.2) * edgeFade;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    })
    return mat
  }, [gridUniforms])

  const matRef = useRef(gridMaterial)

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    if (gridRef.current) {
      gridRef.current.position.z = -10
    }
  })

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <mesh material={gridMaterial}>
        <planeGeometry args={[60, 60, 1, 1]} />
      </mesh>
    </group>
  )
}

// ===================== CYBERPUNK BUILDINGS =====================
function CyberBuilding({ position, height, color }) {
  const meshRef = useRef(null)

  const windowMatrix = useMemo(() => {
    const matrices = []
    for (let row = 0; row < Math.floor(height * 2); row++) {
      for (let col = -1; col <= 1; col++) {
        const matrix = new THREE.Matrix4()
        matrix.setPosition(col * 0.35, row * 0.5 - height / 2, 0.51)
        matrices.push(matrix)
      }
    }
    return matrices
  }, [height])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, height, 1.5]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.8} metalness={0.3} />
      </mesh>

      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.52, height + 0.02, 1.52)]} />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>

      {windowMatrix.map((matrix, i) => (
        <mesh
          key={i}
          position={[matrix.elements[12], matrix.elements[13] + position[1], matrix.elements[14]]}
        >
          <planeGeometry args={[0.2, 0.25]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={Math.random() > 0.3 ? 1.5 : 0.1}
            transparent
            opacity={Math.random() > 0.3 ? 0.9 : 0.2}
          />
        </mesh>
      ))}

      {Math.random() > 0.5 && (
        <mesh position={[0, height / 2 + 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      )}

      <mesh position={[0, height / 2 + 1.2, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

// ===================== BUILDING CLUSTER =====================
function CityCluster() {
  const buildings = useMemo(() => {
    const configs = []
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ff3366', '#ffaa00', '#6633ff']

    for (let i = -8; i <= 8; i += 2) {
      configs.push({
        position: [i + (Math.random() - 0.5) * 0.5, 0, -8 + (Math.random() - 0.5) * 2],
        height: 2 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    for (let i = -10; i <= 10; i += 1.5) {
      configs.push({
        position: [i + (Math.random() - 0.5) * 0.5, 0, -15 + (Math.random() - 0.5) * 3],
        height: 3 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    for (let i = -12; i <= 12; i += 2) {
      configs.push({
        position: [i + (Math.random() - 0.5), 0, -22 + (Math.random() - 0.5) * 4],
        height: 4 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    for (let z = -8; z >= -20; z -= 3) {
      configs.push({
        position: [-12 + (Math.random() - 0.5) * 2, 0, z],
        height: 3 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      configs.push({
        position: [12 + (Math.random() - 0.5) * 2, 0, z],
        height: 3 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    return configs
  }, [])

  return (
    <group>
      {buildings.map((config, i) => (
        <CyberBuilding key={i} {...config} />
      ))}
    </group>
  )
}

// ===================== FLOATING PARTICLES (DATA RAIN) =====================
function DataRain() {
  const count = 2000
  const meshRef = useRef(null)

  const particles = useMemo(() => {
    const temp = []
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffffff']
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 50,
          Math.random() * 30 - 5,
          (Math.random() - 0.5) * 50
        ),
        speed: 0.5 + Math.random() * 2,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
      })
    }
    return temp
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      p.position.y -= p.speed * 0.05
      if (p.position.y < -5) {
        p.position.y = 25
        p.position.x = (Math.random() - 0.5) * 50
      }
      dummy.position.copy(p.position)
      dummy.scale.setScalar(0.02 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.01)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00ffff" toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  )
}

// ===================== HOLOGRAM RING =====================
function HologramRing({ position, radius, color, speed = 1 }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  )
}

// ===================== CENTRAL HOLOGRAM =====================
function CentralHologram() {
  const groupRef = useRef(null)
  const coreRef = useRef(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      coreRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          speed={3}
          distort={0.3}
          roughness={0}
          metalness={1}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh scale={[1.3, 1.3, 1.3]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.3} />
      </mesh>

      <HologramRing position={[0, 0, 0]} radius={2} color="#00ffff" speed={1} />
      <HologramRing position={[0, 0, 0]} radius={2.5} color="#ff00ff" speed={-0.7} />
      <HologramRing position={[0, 0, 0]} radius={3} color="#00ff88" speed={0.5} />
      <HologramRing position={[0, 0.5, 0]} radius={1.8} color="#ff3366" speed={-1.2} />

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 3.5
        return (
          <Float key={i} speed={2 + i * 0.3} floatIntensity={1}>
            <mesh
              position={[Math.cos(angle) * r, Math.sin(i * 1.5) * 0.5, Math.sin(angle) * r]}
              rotation={[i, i * 0.5, 0]}
            >
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                emissive={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
                emissiveIntensity={2}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

// ===================== VERTICAL LIGHT BEAMS =====================
function LightBeams() {
  const beams = useMemo(() => {
    const configs = []
    const colors = ['#00ffff', '#ff00ff', '#00ff88', '#ff3366', '#6633ff']
    for (let i = 0; i < 15; i++) {
      configs.push({
        position: [(Math.random() - 0.5) * 30, 5, -10 + (Math.random() - 0.5) * 20],
        color: colors[Math.floor(Math.random() * colors.length)],
        height: 10 + Math.random() * 15,
      })
    }
    return configs
  }, [])

  return (
    <group>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position}>
          <cylinderGeometry args={[0.02, 0.3, beam.height, 6, 1, true]} />
          <meshBasicMaterial color={beam.color} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// ===================== FLYING VEHICLES =====================
function FlyingLight({ startX, y, z, speed, color, index }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * speed * 0.3 + index * 2) % 20 - 10
    ref.current.position.x = t
    ref.current.position.y = y + Math.sin(state.clock.elapsedTime + index) * 0.5
    ref.current.position.z = z
  })

  return (
    <mesh ref={ref} position={[startX, y, z]}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
    </mesh>
  )
}

function FlyingVehicles() {
  const paths = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      startX: -20 + Math.random() * 40,
      y: 5 + Math.random() * 10,
      z: -5 - Math.random() * 15,
      speed: 2 + Math.random() * 3,
      color: ['#00ffff', '#ff00ff', '#ff3366', '#00ff88'][Math.floor(Math.random() * 4)],
    }))
  }, [])

  return (
    <group>
      {paths.map((path, i) => (
        <FlyingLight key={i} {...path} index={i} />
      ))}
    </group>
  )
}

// ===================== NEON SIGNS =====================
function NeonSigns() {
  const signs = useMemo(() => [
    { text: 'CYBER', position: [-6, 8, -8], color: '#ff00ff' },
    { text: 'NEON', position: [5, 6, -10], color: '#00ffff' },
    { text: '2086', position: [0, 10, -15], color: '#ff3366' },
    { text: 'DECODE', position: [-8, 5, -12], color: '#00ff88' },
  ], [])

  return (
    <group>
      {signs.map((sign, i) => (
        <Float key={i} speed={1} floatIntensity={0.2}>
          <Text
            position={sign.position}
            fontSize={1.2}
            color={sign.color}
            fillOpacity={0.9}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            <meshStandardMaterial
              color={sign.color}
              emissive={sign.color}
              emissiveIntensity={3}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
            {sign.text}
          </Text>
        </Float>
      ))}
    </group>
  )
}

// ===================== MOUSE REACTIVE CAMERA =====================
function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const targetX = state.pointer.x * 2
    const targetY = state.pointer.y * 1.5

    mouse.current.x += (targetX - mouse.current.x) * 0.02
    mouse.current.y += (targetY - mouse.current.y) * 0.02

    state.camera.position.x = mouse.current.x
    state.camera.position.y = 2 + mouse.current.y
    state.camera.lookAt(0, 1, -5)
  })

  return null
}

// ===================== POST PROCESSING =====================
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.5} opacity={0.1} />
      <Vignette offset={0.3} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

// ===================== MAIN SCENE =====================
function Scene() {
  return (
    <>
      <fog attach="fog" args={['#050510', 5, 40]} />
      <CameraRig />

      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00ffff" distance={30} />
      <pointLight position={[-10, 5, -5]} intensity={1} color="#ff00ff" distance={25} />
      <pointLight position={[10, 5, -5]} intensity={1} color="#ff3366" distance={25} />
      <spotLight position={[0, 20, -10]} angle={0.5} penumbra={1} intensity={1} color="#6633ff" distance={50} />

      <NeonGrid />
      <CityCluster />
      <CentralHologram />
      <DataRain />
      <LightBeams />
      <FlyingVehicles />
      <NeonSigns />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      <PostProcessing />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
        target={[0, 1, -5]}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// ===================== HUD OVERLAY =====================
function HUDLine({ label, value, color, align = 'left' }) {
  return (
    <div className="hud-line" style={{ textAlign: align }}>
      <div className="hud-label">{label}</div>
      <div className="hud-value" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</div>
    </div>
  )
}

function HUDOverlay() {
  return (
    <div className="hud-overlay">
      <div className="scanlines" />

      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <div className="hud-top">
        <span>SECTOR 7-G // NEON DISTRICT</span>
      </div>

      <div className="hud-left">
        <HUDLine label="SYS.STATUS" value="ONLINE" color="#00ff88" />
        <HUDLine label="FREQ" value="47.3 GHz" color="#00ffff" />
        <HUDLine label="LAT" value="35.6762" color="#00ffff" />
        <HUDLine label="LON" value="139.6503" color="#00ffff" />
      </div>

      <div className="hud-right">
        <HUDLine label="CITY.POP" value="12,847,291" color="#ff00ff" align="right" />
        <HUDLine label="THREAT.LVL" value="MODERATE" color="#ff3366" align="right" />
        <HUDLine label="NET.LATENCY" value="2.4ms" color="#00ff88" align="right" />
        <HUDLine label="UPTIME" value="99.97%" color="#00ff88" align="right" />
      </div>

      <div className="hud-bottom">
        <div className="hud-title">CYBERPUNK</div>
        <div className="hud-subtitle">N E O N &nbsp; C I T Y</div>
        <div className="hud-hint">INTERACTIVE 3D EXPERIENCE // MOVE MOUSE TO EXPLORE</div>
      </div>

      <div className="glitch-bar" />
    </div>
  )
}

// ===================== EXPORTED COMPONENT =====================
export default function CyberpunkScene() {
  return (
    <div className="cyberpunk-wrapper">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 75, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      <HUDOverlay />
    </div>
  )
}