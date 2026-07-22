import { Vector3D } from './Vector3';

export class PhysicsEngine {
  private gravity: number = -9.82;

  public calculateKickForce(swipe: { deltaX: number; deltaY: number; duration: number }): Vector3D {
    const duration = Math.max(swipe.duration, 0.05);
    const absDeltaY = Math.abs(swipe.deltaY);
    const speed = Math.min(absDeltaY / duration, 1500);

    return {
      x: swipe.deltaX * 0.035,
      y: Math.min(absDeltaY * 0.035, 12),
      z: -Math.min(speed * 0.025, 28)
    };
  }

  public step(pos: Vector3D, vel: Vector3D, dt: number): { nextPos: Vector3D; nextVel: Vector3D } {
    const nextVel = {
      x: vel.x,
      y: vel.y + this.gravity * dt,
      z: vel.z
    };

    const nextPos = {
      x: pos.x + vel.x * dt,
      y: Math.max(0, pos.y + vel.y * dt),
      z: pos.z + vel.z * dt
    };

    return { nextPos, nextVel };
  }
}