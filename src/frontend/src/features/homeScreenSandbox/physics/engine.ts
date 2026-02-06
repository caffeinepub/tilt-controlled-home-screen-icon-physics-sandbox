import { type RigidBody, type Vec2, type WorldParams } from './types';

export class PhysicsEngine {
  bodies: RigidBody[];
  params: WorldParams;

  constructor(bodies: RigidBody[], width: number, height: number) {
    this.bodies = bodies;
    this.params = {
      width,
      height,
      gravityScale: 500,
      damping: 0.98,
      angularDamping: 0.95,
    };
  }

  step(deltaTime: number, gravity: Vec2) {
    // Apply gravity and integrate velocity
    this.bodies.forEach((body) => {
      // Apply gravity
      body.velocity.x += gravity.x * this.params.gravityScale * deltaTime;
      body.velocity.y += gravity.y * this.params.gravityScale * deltaTime;

      // Apply damping
      body.velocity.x *= this.params.damping;
      body.velocity.y *= this.params.damping;
      body.angularVelocity *= this.params.angularDamping;

      // Cap velocity to prevent instability
      const maxVelocity = 1000;
      const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
      if (speed > maxVelocity) {
        body.velocity.x = (body.velocity.x / speed) * maxVelocity;
        body.velocity.y = (body.velocity.y / speed) * maxVelocity;
      }

      // Integrate position
      body.position.x += body.velocity.x * deltaTime;
      body.position.y += body.velocity.y * deltaTime;
      body.rotation += body.angularVelocity * deltaTime;
    });

    // Resolve collisions with bounds
    this.bodies.forEach((body) => {
      this.resolveBoundsCollision(body);
    });

    // Resolve body-to-body collisions
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        this.resolveBodyCollision(this.bodies[i], this.bodies[j]);
      }
    }
  }

  private resolveBoundsCollision(body: RigidBody) {
    // Left wall
    if (body.position.x - body.radius < 0) {
      body.position.x = body.radius;
      body.velocity.x = Math.abs(body.velocity.x) * body.restitution;
      body.angularVelocity = -body.velocity.y / body.radius;
    }

    // Right wall
    if (body.position.x + body.radius > this.params.width) {
      body.position.x = this.params.width - body.radius;
      body.velocity.x = -Math.abs(body.velocity.x) * body.restitution;
      body.angularVelocity = -body.velocity.y / body.radius;
    }

    // Top wall
    if (body.position.y - body.radius < 0) {
      body.position.y = body.radius;
      body.velocity.y = Math.abs(body.velocity.y) * body.restitution;
      body.angularVelocity = body.velocity.x / body.radius;
    }

    // Bottom wall
    if (body.position.y + body.radius > this.params.height) {
      body.position.y = this.params.height - body.radius;
      body.velocity.y = -Math.abs(body.velocity.y) * body.restitution;
      body.angularVelocity = body.velocity.x / body.radius;
    }
  }

  private resolveBodyCollision(bodyA: RigidBody, bodyB: RigidBody) {
    const dx = bodyB.position.x - bodyA.position.x;
    const dy = bodyB.position.y - bodyA.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = bodyA.radius + bodyB.radius;

    if (distance < minDistance && distance > 0) {
      // Normalize collision vector
      const nx = dx / distance;
      const ny = dy / distance;

      // Separate bodies
      const overlap = minDistance - distance;
      const separationX = (nx * overlap) / 2;
      const separationY = (ny * overlap) / 2;

      bodyA.position.x -= separationX;
      bodyA.position.y -= separationY;
      bodyB.position.x += separationX;
      bodyB.position.y += separationY;

      // Calculate relative velocity
      const dvx = bodyB.velocity.x - bodyA.velocity.x;
      const dvy = bodyB.velocity.y - bodyA.velocity.y;
      const relativeVelocity = dvx * nx + dvy * ny;

      // Only resolve if bodies are moving towards each other
      if (relativeVelocity < 0) {
        const restitution = Math.min(bodyA.restitution, bodyB.restitution);
        const impulse = -(1 + restitution) * relativeVelocity;
        const totalMass = bodyA.mass + bodyB.mass;

        const impulseX = (impulse * nx) / totalMass;
        const impulseY = (impulse * ny) / totalMass;

        bodyA.velocity.x -= impulseX * bodyB.mass;
        bodyA.velocity.y -= impulseY * bodyB.mass;
        bodyB.velocity.x += impulseX * bodyA.mass;
        bodyB.velocity.y += impulseY * bodyA.mass;

        // Apply friction
        const tangentX = -ny;
        const tangentY = nx;
        const tangentVelocity = dvx * tangentX + dvy * tangentY;
        const friction = Math.min(bodyA.friction, bodyB.friction);
        const frictionImpulse = tangentVelocity * friction;

        bodyA.velocity.x += frictionImpulse * tangentX * bodyB.mass / totalMass;
        bodyA.velocity.y += frictionImpulse * tangentY * bodyB.mass / totalMass;
        bodyB.velocity.x -= frictionImpulse * tangentX * bodyA.mass / totalMass;
        bodyB.velocity.y -= frictionImpulse * tangentY * bodyA.mass / totalMass;

        // Update angular velocity
        bodyA.angularVelocity += impulseY / bodyA.radius;
        bodyB.angularVelocity -= impulseY / bodyB.radius;
      }
    }
  }
}
