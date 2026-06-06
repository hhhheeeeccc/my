import { useCallback } from 'react';

export const useUIFocus = () => {
  const setFocus = useCallback((focus, click = false) => {
    const event = new CustomEvent('ui-focus', { detail: { focus, click } });
    window.dispatchEvent(event);
  }, []);

  return setFocus;
};
