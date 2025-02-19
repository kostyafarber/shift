import { EntityId, Ident } from "@/lib/core/EntityId";
import { Point } from "@/lib/math/point";
import { Point2D } from "@/types/math";
import { CubicSegment, LineSegment, Segment } from "@/types/segments";

export type PointType = "onCurve" | "offCurve";
export class ContourPoint extends Point {
  #id: EntityId;
  #type: PointType;
  #smooth: boolean = false;

  constructor(x: number, y: number, pointType: PointType, parentId: Ident) {
    super(x, y);

    this.#type = pointType;
    this.#id = new EntityId(parentId);
  }

  static fromPoint2D(point: Point2D, pointType: PointType, parentId: Ident) {
    return new ContourPoint(point.x, point.y, pointType, parentId);
  }

  get id(): Ident {
    return this.#id.id;
  }

  get type(): PointType {
    return this.#type;
  }

  get smooth(): boolean {
    return this.#smooth;
  }
}

class SegmentIterator implements Iterator<Segment> {
  #points: ContourPoint[];
  #index: number = 0;

  public constructor(points: ContourPoint[]) {
    this.#points = points;
  }

  public next(): IteratorResult<Segment> {
    if (this.#points.length < 2) {
      return {
        done: true,
        value: {},
      };
    }

    if (this.#index >= this.#points.length - 1) {
      return {
        done: true,
        value: undefined,
      };
    }

    const p1 = this.#points[this.#index];
    const p2 = this.#points[this.#index + 1];

    if (p1.type === "onCurve" && p2.type === "onCurve") {
      const segment: LineSegment = {
        type: "line",
        anchor1: p1,
        anchor2: p2,
      };

      this.#index += 1;

      return {
        done: false,
        value: segment,
      };
    }

    if (p1.type === "onCurve" && p2.type === "offCurve") {
      const p3 = this.#points[this.#index + 2];
      const p4 = this.#points[this.#index + 3];

      const segment: CubicSegment = {
        type: "cubic",
        anchor1: p1,
        control1: p2,
        control2: p3,
        anchor2: p4,
      };

      this.#index += 3;

      return {
        done: false,
        value: segment,
      };
    }

    return {
      done: true,
      value: {},
    };
  }
}

export class Contour {
  #id: EntityId;
  #points: ContourPoint[] = [];
  #closed: boolean = false;

  constructor() {
    this.#id = new EntityId();
  }

  get points(): ContourPoint[] {
    return this.#points;
  }

  addPoint(point: Point2D): Ident {
    const p = ContourPoint.fromPoint2D(point, "onCurve", this.#id.id);
    this.#points.push(p);
    return p.id;
  }

  upgradeLineSegment(id: Ident): void {
    const index = this.#points.findIndex((p) => p.id === id);
    const p1 = this.#points[index];
    const p3 = this.#points[index + 1];

    const c1 = p1.lerp(p3, 1.0 / 3.0);
    const c2 = p1.lerp(p3, 2.0 / 3.0);

    const control1 = new ContourPoint(c1.x, c1.y, "offCurve", this.#id.id);
    const control2 = new ContourPoint(c2.x, c2.y, "offCurve", this.#id.id);

    this.#points.splice(index + 1, 0, control1, control2);
  }

  [Symbol.iterator](): Iterator<Segment> {
    return new SegmentIterator(this.#points);
  }

  segments(): Segment[] {
    return [...this];
  }

  get lastPoint(): ContourPoint {
    return this.#points[this.#points.length - 1];
  }

  get id(): Ident {
    return this.#id.id;
  }

  get closed(): boolean {
    return this.#closed;
  }

  close() {
    this.#points.pop();
    this.#closed = true;
  }
}
