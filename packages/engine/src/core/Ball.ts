import { Vector3D } from './Vector3';

export class Ball {
  public position: Vector3D = { x: 0, y: 0.35, z: 0 };
  public velocity: Vector3D = { x: 0, y: 0, z: 0 };
  public radius: number = 0.35;

  public reset(): void {
    this.position = { x: 0, y: 0.35, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
  }
}