export class Point {
  #x: number;
  #y: number;

  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  clone(): Point {
    return new Point(this.#x, this.#y);
  }

  public static create(x: number, y: number): Point {
    return new Point(x, y);
  }

  public get x() {
    return this.#x;
  }

  public get y() {
    return this.#y;
  }

  public set_x(x: number) {
    this.#x = x;
  }

  public set_y(y: number) {
    this.#y = y;
  }

  public distance(point: Point): number {
    return Math.hypot(this.#x - point.x, this.#y - point.y);
  }

  public lerp(p: Point, t: number): Point {
    return new Point(
      this.#x + t * (p.x - this.#x),
      this.#y + t * (p.y - this.#y),
    );
  }
}
