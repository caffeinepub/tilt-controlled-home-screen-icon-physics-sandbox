import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, AlertCircle } from 'lucide-react';

interface MotionPermissionPanelProps {
  onRequestPermission: () => void;
  isRequesting: boolean;
  isDenied: boolean;
}

export function MotionPermissionPanel({
  onRequestPermission,
  isRequesting,
  isDenied,
}: MotionPermissionPanelProps) {
  return (
    <Card className="border-amber-200 dark:border-amber-900/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Motion Access</CardTitle>
            <CardDescription>Enable device tilt to control the simulation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDenied ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Motion access was denied. You can still use desktop controls, or enable motion in your
              browser settings.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Tilt your device to make the app icons fall and roll around. We need your permission
              to access motion sensors.
            </p>
            <Button
              onClick={onRequestPermission}
              disabled={isRequesting}
              className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              {isRequesting ? 'Requesting...' : 'Enable Motion'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
