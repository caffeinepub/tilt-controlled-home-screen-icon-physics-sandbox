import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Move, Keyboard } from 'lucide-react';
import { type Vec2 } from '../physics/types';

interface DesktopTiltControlProps {
  gravity: Vec2;
  onGravityChange: (gravity: Vec2) => void;
}

export function DesktopTiltControl({ gravity, onGravityChange }: DesktopTiltControlProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse/touch drag
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateGravityFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateGravityFromPointer(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateGravityFromPointer = (e: React.PointerEvent) => {
    if (!padRef.current) return;

    const rect = padRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Map to gravity range [-1, 1]
    const gx = (x - 0.5) * 2;
    const gy = (y - 0.5) * 2;

    onGravityChange({ x: gx, y: gy });
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 0.1;
      let newGravity = { ...gravity };

      switch (e.key) {
        case 'ArrowLeft':
          newGravity.x = Math.max(-1, gravity.x - step);
          break;
        case 'ArrowRight':
          newGravity.x = Math.min(1, gravity.x + step);
          break;
        case 'ArrowUp':
          newGravity.y = Math.max(-1, gravity.y - step);
          break;
        case 'ArrowDown':
          newGravity.y = Math.min(1, gravity.y + step);
          break;
        default:
          return;
      }

      e.preventDefault();
      onGravityChange(newGravity);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gravity, onGravityChange]);

  // Calculate indicator position
  const indicatorX = ((gravity.x + 1) / 2) * 100;
  const indicatorY = ((gravity.y + 1) / 2) * 100;

  return (
    <Card className="border-teal-200 dark:border-teal-900/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
            <Move className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Tilt Control</CardTitle>
            <CardDescription>Drag or use arrow keys to tilt</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag pad */}
        <div
          ref={padRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-2 border-teal-300 dark:border-teal-700 cursor-crosshair touch-none"
        >
          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-teal-300 dark:bg-teal-700" />
            <div className="absolute w-px h-full bg-teal-300 dark:bg-teal-700" />
          </div>

          {/* Gravity indicator */}
          <div
            className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-teal-600 dark:bg-teal-400 shadow-lg border-2 border-white dark:border-slate-900 transition-all pointer-events-none"
            style={{
              left: `${indicatorX}%`,
              top: `${indicatorY}%`,
            }}
          />
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Keyboard className="w-4 h-4" />
          <span>Use arrow keys for precise control</span>
        </div>
      </CardContent>
    </Card>
  );
}
