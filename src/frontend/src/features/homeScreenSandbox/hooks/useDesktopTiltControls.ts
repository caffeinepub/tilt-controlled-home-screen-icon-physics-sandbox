import { useState, useCallback } from 'react';
import { type Vec2 } from '../physics/types';

interface DesktopTiltControls {
  gravity: Vec2;
  setGravity: (gravity: Vec2) => void;
  reset: () => void;
}

export function useDesktopTiltControls(): DesktopTiltControls {
  const [gravity, setGravity] = useState<Vec2>({ x: 0, y: 1 });

  const reset = useCallback(() => {
    setGravity({ x: 0, y: 1 });
  }, []);

  return {
    gravity,
    setGravity,
    reset,
  };
}
