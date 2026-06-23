import * as THREE from 'three';

export const createColor = (c) => new THREE.Color(c);
export const createFog = (c, n, f) => new THREE.Fog(c, n, f);

// Secure random helper for consistency and reliability
export const getSecureRandom = () => {
  const array = new Uint32Array(1);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
};
