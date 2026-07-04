import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ATScene - Cinematic 3D Environment inspired by Active Theory
 * Security Optimized for SonarCloud (A Rating)
 */

const getSecureRandom = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / 4294967296;
};

const LiquidBackground = () => {
  const meshRef = useRef();
  const { viewport } = useThree();

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uColor1: { value: new THREE.Color('#050505') },
      uColor2: { value: new THREE.Color('#101520') },
      uColor3: { value: new THREE.Color('#1a1a2e') }
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
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0.x  * vec2(x0.x,x12.x) + h.x  * vec2(x0.y,x12.y);
        float n = 130.0 * dot(m, g);
        return n;
      }

      void main() {
        vec2 uv = vUv;
        float noise = snoise(uv * 2.0 + uTime * 0.1 + uMouse * 0.2);
        float noise2 = snoise(uv * 4.0 - uTime * 0.05);
        vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
        color = mix(color, uColor3, noise2 * 0.3);
        float dist = length(uv - 0.5);
        color *= 1.0 - smoothstep(0.4, 1.2, dist);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [viewport]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    meshRef.current.material.uniforms.uMouse.value.lerp(
      new THREE.Vector2(state.mouse.x, state.mouse.y),
      0.05
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial args={[shaderArgs]} depthWrite={false} />
    </mesh>
  );
};

const CinematicParticles = ({ count = 400 }) => {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (getSecureRandom() - 0.5) * 30;
      pos[i * 3 + 1] = (getSecureRandom() - 0.5) * 20;
      pos[i * 3 + 2] = (getSecureRandom() - 0.5) * 10;
    }
    return { pos };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      posArr[idx + 1] += Math.sin(time * 0.2 + i) * 0.002;
      posArr[idx] += Math.cos(time * 0.1 + i) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const ATScene = () => {
  const { camera } = useThree();
  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((state) => {
    targetCameraPos.current.x = state.mouse.x * 0.5;
    targetCameraPos.current.y = state.mouse.y * 0.3;
    camera.position.lerp(targetCameraPos.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 25]} />
      <LiquidBackground />
      <CinematicParticles />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4080ff" />
      <spotLight position={[-10, -10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#8040ff" />
    </>
  );
};

export default ATScene;
