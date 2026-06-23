import { useCallback } from 'react';
import { useUIFocus } from './useUIFocus';

export const useSectionInteraction = () => {
  const setFocus = useUIFocus();

  const onEnter = useCallback(() => setFocus(true), [setFocus]);
  const onLeave = useCallback(() => setFocus(false), [setFocus]);
  const onClick = useCallback(() => setFocus(true, true), [setFocus]);

  return { onEnter, onLeave, onClick };
};
