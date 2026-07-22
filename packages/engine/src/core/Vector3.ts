export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export class Vector3Utils {
  // ১. ভেক্টর তৈরি
  public static create(x = 0, y = 0, z = 0): Vector3D {
    return { x, y, z };
  }

  // ২. ভেক্টর যোগ (Addition)
  public static add(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  // ৩. ভেক্টর বিয়োগ (Subtraction)
  public static sub(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  // ৪. স্কেলার গুণন (Multiply by Scalar / Speed Scale)
  public static multiplyScalar(v: Vector3D, scalar: number): Vector3D {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  }

  // ৫. ভেক্টরের দৈর্ঘ্য/ম্যাগনিটিউড (Magnitude / Speed)
  public static magnitude(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  // ৬. ভেক্টর নরমাললাইজ (Direction Vector - 1 unit length)
  public static normalize(v: Vector3D): Vector3D {
    const mag = this.magnitude(v);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return this.multiplyScalar(v, 1 / mag);
  }

  // ৭. দুটি বিন্দুর ভেতরের দূরত্ব (Distance - Collision Detection-এর জন্য)
  public static distance(a: Vector3D, b: Vector3D): number {
    return this.magnitude(this.sub(a, b));
  }

  // ৮. লিনিয়ার ইন্টারপোলেশন (Linear Interpolation)
  public static lerp(start: Vector3D, end: Vector3D, alpha: number): Vector3D {
    return {
      x: start.x + (end.x - start.x) * alpha,
      y: start.y + (end.y - start.y) * alpha,
      z: start.z + (end.z - start.z) * alpha,
    };
  }

  // ৯. ভেক্টর ক্লোন (Copying vector without reference mutation)
  public static clone(v: Vector3D): Vector3D {
    return { x: v.x, y: v.y, z: v.z };
  }
}