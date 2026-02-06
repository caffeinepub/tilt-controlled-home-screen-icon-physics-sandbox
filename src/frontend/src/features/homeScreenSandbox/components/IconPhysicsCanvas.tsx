import { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '../physics/engine';
import { createInitialLayout } from '../physics/initialLayout';
import { type RigidBody, type Vec2 } from '../physics/types';
import { iconAssets } from '../iconAssets';

interface IconPhysicsCanvasProps {
  gravity: Vec2;
  resetTrigger: number;
}

export function IconPhysicsCanvas({ gravity, resetTrigger }: IconPhysicsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PhysicsEngine | null>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Load icon images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = iconAssets.map((asset) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imagesRef.current.set(asset.id, img);
            resolve();
          };
          img.onerror = reject;
          img.src = asset.path;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to load icon images:', error);
      }
    };

    loadImages();
  }, []);

  // Initialize physics engine
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Create initial layout
    const bodies = createInitialLayout(rect.width, rect.height, iconAssets);

    // Initialize physics engine
    engineRef.current = new PhysicsEngine(bodies, rect.width, rect.height);

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.033); // Cap at ~30fps
      lastTime = currentTime;

      if (engineRef.current) {
        engineRef.current.step(deltaTime, gravity);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw all bodies
        engineRef.current.bodies.forEach((body) => {
          const img = imagesRef.current.get(body.id);
          if (!img) return;

          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.rotation);

          // Draw icon with shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;

          ctx.drawImage(
            img,
            -body.radius,
            -body.radius,
            body.radius * 2,
            body.radius * 2
          );

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded, gravity]);

  // Handle reset
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current || resetTrigger === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newBodies = createInitialLayout(rect.width, rect.height, iconAssets);
    engineRef.current.bodies = newBodies;
  }, [resetTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
