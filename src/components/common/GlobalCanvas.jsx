import React from 'react';
import { Canvas } from '@react-three/fiber';
import ATScene from './ATScene';

const GlobalCanvas = () => (
  <div className="fixed inset-0 z-[1] pointer-events-none">
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: 6,
        toneMappingExposure: 1.0,
        premultipliedAlpha: false,
      }}
    >
      <ATScene />
    </Canvas>
  </div>
);

export default GlobalCanvas;