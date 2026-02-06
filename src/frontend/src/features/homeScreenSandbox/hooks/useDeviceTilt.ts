import { useState, useEffect, useCallback } from 'react';
import { type Vec2 } from '../physics/types';

interface DeviceTiltState {
  gravity: Vec2;
  isAvailable: boolean;
  needsPermission: boolean;
  isPermissionGranted: boolean;
  isPermissionDenied: boolean;
  isRequesting: boolean;
  requestPermission: () => void;
}

export function useDeviceTilt(): DeviceTiltState {
  const [gravity, setGravity] = useState<Vec2>({ x: 0, y: 1 });
  const [isAvailable, setIsAvailable] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Check if DeviceOrientation is available
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasDeviceOrientation = 'DeviceOrientationEvent' in window;
    setIsAvailable(hasDeviceOrientation);

    // Check if permission is needed (iOS 13+)
    if (hasDeviceOrientation && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsPermission(true);
    } else if (hasDeviceOrientation) {
      // Permission not needed, start listening immediately
      setIsPermissionGranted(true);
    }
  }, []);

  // Request permission (iOS)
  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      return;
    }

    setIsRequesting(true);

    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === 'granted') {
        setIsPermissionGranted(true);
        setIsPermissionDenied(false);
      } else {
        setIsPermissionDenied(true);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setIsPermissionDenied(true);
    } finally {
      setIsRequesting(false);
    }
  }, []);

  // Listen to device orientation
  useEffect(() => {
    if (!isAvailable || !isPermissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta: front-to-back tilt (-180 to 180)
      // gamma: left-to-right tilt (-90 to 90)
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      // Normalize to [-1, 1] range
      // gamma controls x-axis (left/right)
      // beta controls y-axis (forward/back)
      const gx = Math.max(-1, Math.min(1, gamma / 45));
      const gy = Math.max(-1, Math.min(1, beta / 90));

      setGravity({ x: gx, y: gy });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isAvailable, isPermissionGranted]);

  return {
    gravity,
    isAvailable,
    needsPermission,
    isPermissionGranted,
    isPermissionDenied,
    isRequesting,
    requestPermission,
  };
}
