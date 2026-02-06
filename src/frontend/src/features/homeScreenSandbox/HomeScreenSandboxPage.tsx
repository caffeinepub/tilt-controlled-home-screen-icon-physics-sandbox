import { useEffect, useState } from 'react';
import { DeviceScreenFrame } from './components/DeviceScreenFrame';
import { IconPhysicsCanvas } from './components/IconPhysicsCanvas';
import { MotionPermissionPanel } from './components/MotionPermissionPanel';
import { SimulationControlsBar } from './components/SimulationControlsBar';
import { DesktopTiltControl } from './components/DesktopTiltControl';
import { useDeviceTilt } from './hooks/useDeviceTilt';
import { useDesktopTiltControls } from './hooks/useDesktopTiltControls';

export function HomeScreenSandboxPage() {
  const deviceTilt = useDeviceTilt();
  const desktopTilt = useDesktopTiltControls();
  const [resetTrigger, setResetTrigger] = useState(0);

  // Determine which tilt source to use
  const isUsingDeviceTilt = deviceTilt.isAvailable && deviceTilt.isPermissionGranted;
  const effectiveGravity = isUsingDeviceTilt ? deviceTilt.gravity : desktopTilt.gravity;

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
    desktopTilt.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md relative">
        {/* Permission panel for iOS/mobile devices */}
        {deviceTilt.needsPermission && !deviceTilt.isPermissionGranted && (
          <div className="mb-6">
            <MotionPermissionPanel
              onRequestPermission={deviceTilt.requestPermission}
              isRequesting={deviceTilt.isRequesting}
              isDenied={deviceTilt.isPermissionDenied}
            />
          </div>
        )}

        {/* Main simulation frame */}
        <DeviceScreenFrame>
          <IconPhysicsCanvas gravity={effectiveGravity} resetTrigger={resetTrigger} />
        </DeviceScreenFrame>

        {/* Controls overlay */}
        <div className="mt-6 space-y-4">
          <SimulationControlsBar
            onReset={handleReset}
            isUsingDeviceTilt={isUsingDeviceTilt}
          />

          {/* Desktop tilt control (only show when not using device tilt) */}
          {!isUsingDeviceTilt && (
            <DesktopTiltControl
              gravity={desktopTilt.gravity}
              onGravityChange={desktopTilt.setGravity}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          © 2026. Built with <span className="text-amber-600 dark:text-amber-400">♥</span> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
