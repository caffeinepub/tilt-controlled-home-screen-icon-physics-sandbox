export interface Vec2 {
  x: number;
  y: number;
}

export interface RigidBody {
  id: string;
  position: Vec2;
  velocity: Vec2;
  rotation: number;
  angularVelocity: number;
  radius: number;
  mass: number;
  restitution: number;
  friction: number;
}

export interface WorldParams {
  width: number;
  height: number;
  gravityScale: number;
  damping: number;
  angularDamping: number;
}
