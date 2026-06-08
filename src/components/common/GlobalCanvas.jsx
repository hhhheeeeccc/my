import React from 'react';
import { Canvas } from '@react-three/fiber';
import Experience3D from './Experience3D';

const GlobalCanvas = () => (
  <div className="fixed inset-0 z-[5] pointer-events-none">
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        antialias: true,
        alpha: true, // Crucial for showing video behind 3D particles
        powerPreference: "high-performance"
      }}
    >
      <Experience3D />
    </Canvas>
  </div>
);

export default GlobalCanvas;
