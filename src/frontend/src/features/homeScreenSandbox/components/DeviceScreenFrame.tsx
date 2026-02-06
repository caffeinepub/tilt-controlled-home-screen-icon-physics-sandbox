import { type ReactNode } from 'react';

interface DeviceScreenFrameProps {
  children: ReactNode;
}

export function DeviceScreenFrame({ children }: DeviceScreenFrameProps) {
  return (
    <div className="relative w-full aspect-[9/19.5] max-h-[calc(100vh-16rem)] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-800 dark:border-slate-700 bg-slate-900">
      {/* Wallpaper background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/wallpaper.dim_1170x2532.png)',
        }}
      />
      
      {/* Simulation canvas overlay */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
