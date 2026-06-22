import React from 'react';
import { Canvas } from '@react-three/fiber';
import Experience3D from './Experience3D';

const GlobalCanvas = () => (
  <div
    className="fixed inset-0 pointer-events-none"
    style={{
      zIndex: 50,
      mixBlendMode: 'screen',
    }}
  >
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: 6, // ACESFilmicToneMapping
        toneMappingExposure: 1.2,
      }}
    >
      <Experience3D />
    </Canvas>
  </div>
);

export default GlobalCanvas;