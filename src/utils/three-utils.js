import * as THREE from 'three';

export const createColor = (c) => new THREE.Color(c);
export const createFog = (c, n, f) => new THREE.Fog(c, n, f);
