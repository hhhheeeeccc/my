/**
 * Generates a cryptographically secure random number between 0 and 1.
 * Falls back to Math.random() if crypto is not available.
 */
export const getSafeRandom = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
};

/**
 * Returns a random element from an array.
 */
export const getRandomElement = (array) => {
  if (!array || array.length === 0) return null;
  return array[Math.floor(getSafeRandom() * array.length)];
};
