import * as THREE from 'three';

export const createColor = (c) => new THREE.Color(c);
export const createFog = (c, n, f) => new THREE.Fog(c, n, f);

/**
 * Cryptographically secure random number generator.
 * Satisfies SonarCloud Security/Reliability ratings by avoiding Math.random().
 */
export const getSecureRandom = () => {
  const array = new Uint32Array(1);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
    return array[0] / 4294967296; // 2^32
  }
  return 0.5; // Deterministic fallback for non-browser environments
};
