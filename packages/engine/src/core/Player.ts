import { Vector3D } from './Vector3';

export class Goalkeeper {
  public position: Vector3D = { x: 0, y: 0.9, z: -13.8 };
  public targetX: number = 0;

  public updateAI(ballZ: number, dt: number): void {
    // Ball কাছাকাছি আসলে Goal Keeper ডিফেন্ডের চেষ্টা করবে
    if (ballZ < -5 && ballZ > -14) {
      this.position.x += (this.targetX - this.position.x) * (dt * 5);
    }
  }

  public predictShot(targetX: number): void {
    this.targetX = Math.max(-3, Math.min(3, targetX));
  }

  public reset(): void {
    this.position = { x: 0, y: 0.9, z: -13.8 };
    this.targetX = 0;
  }
}