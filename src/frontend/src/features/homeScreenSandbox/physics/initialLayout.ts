import { type RigidBody } from './types';

interface IconAsset {
  id: string;
  label: string;
  path: string;
}

export function createInitialLayout(
  width: number,
  height: number,
  iconAssets: IconAsset[]
): RigidBody[] {
  const iconSize = Math.min(width, height) * 0.15; // 15% of smaller dimension
  const radius = iconSize / 2;
  const cols = 3;
  const rows = Math.ceil(iconAssets.length / cols);

  const horizontalSpacing = width / (cols + 1);
  const verticalSpacing = height / (rows + 2);

  const bodies: RigidBody[] = iconAssets.map((asset, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      id: asset.id,
      position: {
        x: horizontalSpacing * (col + 1),
        y: verticalSpacing * (row + 1.5),
      },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      angularVelocity: 0,
      radius,
      mass: 1,
      restitution: 0.4,
      friction: 0.3,
    };
  });

  return bodies;
}
