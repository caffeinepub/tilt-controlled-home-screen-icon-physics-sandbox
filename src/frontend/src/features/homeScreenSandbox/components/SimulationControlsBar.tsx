import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Smartphone, Monitor } from 'lucide-react';

interface SimulationControlsBarProps {
  onReset: () => void;
  isUsingDeviceTilt: boolean;
}

export function SimulationControlsBar({ onReset, isUsingDeviceTilt }: SimulationControlsBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-900/30 shadow-lg">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
        >
          {isUsingDeviceTilt ? (
            <>
              <Smartphone className="w-3 h-3 mr-1" />
              Device Tilt
            </>
          ) : (
            <>
              <Monitor className="w-3 h-3 mr-1" />
              Desktop Mode
            </>
          )}
        </Badge>
      </div>

      <Button
        onClick={onReset}
        size="sm"
        variant="outline"
        className="border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}
