import * as THREE from 'three';

export const lerpScale = (current, target, stretch = 1, alpha = 0.1) => {
  current.set(
    THREE.MathUtils.lerp(current.x, target, alpha),
    THREE.MathUtils.lerp(current.y, target * stretch, alpha),
    THREE.MathUtils.lerp(current.z, target, alpha)
  );
};

export const getVelocityFactor = (velocity) => Math.min(Math.abs(velocity / 1000), 1);
