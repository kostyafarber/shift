import { Circle } from "@/lib/math/circle";
import { Point } from "@/lib/math/point";
import { Rect } from "@/lib/math/rect";
import { Shape } from "@/lib/math/shape";
import { Triangle } from "@/lib/math/triangle";
import {
  DEFAULT_STYLES,
  GUIDE_STYLES,
  SELECTION_RECTANGLE_STYLES,
} from "@/lib/styles/style";
import { IPath, IRenderer } from "@/types/graphics";
import { HandleType } from "@/types/handle";

import { ContourNode } from "./ContourManager";

export class Painter {
  public drawMetrics(ctx: IRenderer, path: IPath) {
    ctx.setStyle(GUIDE_STYLES);
    ctx.stroke(path);
  }

  public drawInteractive(ctx: IRenderer, nodes: ContourNode[]): void {
    ctx.setStyle(DEFAULT_STYLES);
    for (const node of nodes) {
      ctx.stroke(node.renderPath);
    }
  }

  public drawSelectionRectangle(
    ctx: IRenderer,
    x: number,
    y: number,
    w: number,
    h: number,
  ): void {
    const rx = x;
    const ry = y;
    const rw = w;
    const rh = h;

    ctx.setStyle({
      ...SELECTION_RECTANGLE_STYLES,
      strokeStyle: "transparent",
    });
    ctx.fillRect(rx, ry, rw, rh);

    // Stroke second
    ctx.setStyle({
      ...SELECTION_RECTANGLE_STYLES,
      fillStyle: "transparent",
    });
    ctx.strokeRect(rx, ry, rw, rh);
  }
}

const handleShape = {
  corner: (p: Point) => new Rect(p.x, p.y, 5, 5),
  control: (p: Point) => new Circle(p.x, p.y, 2.5),
  smooth: (p: Point) => new Circle(p.x, p.y, 2.5),
  direction: (p: Point) =>
    new Triangle([
      new Point(p.x, p.y),
      new Point(p.x - 4, p.y + 6),
      new Point(p.x + 4, p.y + 6),
    ]),
};

export class Handle {
  #type: HandleType;
  #position: Point;
  #shape: Shape;

  constructor(position: Point, type: HandleType) {
    this.#position = position;
    this.#type = type;

    this.#shape = handleShape[type](position);
  }

  get selected(): boolean {
    return this.selected;
  }

  set selected(select: boolean) {
    this.selected = select;
  }

  get position(): Point {
    return this.#position;
  }

  set position(point: Point) {
    this.#position = point;
  }

  hit(p: Point): boolean {
    return this.#shape.hit(p);
  }

  draw(renderer: IRenderer): void {
    let rect;
    let circle;
    let triangle;

    switch (this.#type) {
      case "corner":
        rect = this.#shape as Rect;
        renderer.strokeRect(
          this.#position.x - rect.width / 2,
          this.#position.y - rect.height / 2,
          5,
          5,
        );
        break;

      case "smooth":
        circle = this.#shape as Circle;
        renderer.strokeCircle(
          this.#position.x,
          this.#position.y,
          circle.radius,
        );
        break;

      case "control":
        circle = this.#shape as Circle;
        renderer.strokeCircle(
          this.#position.x,
          this.#position.y,
          circle.radius,
        );
        break;

      case "direction":
        triangle = this.#shape as Triangle;

        renderer.beginPath();
        renderer.moveTo(triangle.vertices[0].x, triangle.vertices[0].x); // tip
        renderer.lineTo(triangle.vertices[1].x, triangle.vertices[1].x); // left
        renderer.lineTo(triangle.vertices[2].x, triangle.vertices[2].x); // left
        renderer.closePath();
        renderer.stroke();

        break;
      default:
        break;
    }
  }
}
