import AppState from "@/store/store";
import { IGraphicContext } from "@/types/graphics";
import { Point2D, Rect2D } from "@/types/math";
import { Tool } from "@/types/tool";
import { tools } from "@lib/tools/tools";

import { FrameHandler } from "./FrameHandler";
import { Painter } from "./Painter";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

export class Editor {
  #viewport: Viewport;
  #scene: Scene;
  #painter: Painter;
  #frameHandler: FrameHandler;

  #staticContext: IGraphicContext | null;
  #interactiveContext: IGraphicContext | null;

  constructor() {
    this.#viewport = new Viewport();
    this.#painter = new Painter();

    this.#scene = new Scene();
    this.#frameHandler = new FrameHandler();

    this.#scene;
    this.#frameHandler;

    this.#staticContext = null;
    this.#interactiveContext = null;
  }

  public setStaticContext(context: IGraphicContext) {
    this.#staticContext = context;

    this.#painter.setStaticGuides(this.#staticContext.getContext());
  }

  public setInteractiveContext(context: IGraphicContext) {
    this.#interactiveContext = context;
  }

  public activeTool(): Tool {
    const activeTool = AppState.getState().activeTool;
    const tool = tools.get(activeTool);
    if (!tool) {
      throw new Error(`Tool ${activeTool} not found`);
    }
    return tool.tool;
  }

  public setRect(rect: Rect2D) {
    this.#viewport.setRect(rect);
  }

  public getMousePosition(clientX?: number, clientY?: number): Point2D {
    if (clientX && clientY) {
      return this.#viewport.getMousePosition(clientX, clientY);
    }

    return this.#viewport.getMousePosition();
  }

  public setMousePosition(clientX: number, clientY: number): Point2D {
    return this.#viewport.setMousePosition(clientX, clientY);
  }

  public getUpmMousePosition(clientX?: number, clientY?: number): Point2D {
    if (clientX && clientY) {
      return this.#viewport.getUpmMousePosition(clientX, clientY);
    }

    return this.#viewport.getUpmMousePosition();
  }

  public setUpmMousePosition(clientX: number, clientY: number): Point2D {
    return this.#viewport.setUpmMousePosition(clientX, clientY);
  }

  public pan(dx: number, dy: number) {
    this.#viewport.pan(dx, dy);
  }

  public getPan(): Point2D {
    return { x: this.#viewport.panX, y: this.#viewport.panY };
  }

  public zoomIn(): void {
    this.#viewport.zoomIn();
  }

  public zoomOut(): void {
    this.#viewport.zoomOut();
  }

  public zoom(): number {
    return this.#viewport.zoom;
  }

  applyUserTransforms(): void {
    if (!this.#staticContext || !this.#interactiveContext) return;
    const ctx = this.#staticContext.getContext();

    const centrePoint = this.#viewport.getCentrePoint();

    ctx.translate(centrePoint.x, centrePoint.y);
    ctx.scale(this.#viewport.zoom, this.#viewport.zoom);
    ctx.translate(-centrePoint.x, -centrePoint.y);

    ctx.translate(this.#viewport.panX, this.#viewport.panY);
  }

  draw() {
    if (!this.#staticContext) return;
    const ctx = this.#staticContext.getContext();

    ctx.save(); // Save initial state
    ctx.clear();

    // 1. User view transformation matrix
    const center = this.#viewport.getCentrePoint();
    const zoom = this.#viewport.zoom;
    const { panX, panY } = this.#viewport;

    ctx.transform(
      zoom,
      0,
      0,
      zoom,
      panX + center.x * (1 - zoom),
      panY + center.y * (1 - zoom),
    );

    // 2. Transform to font coordinate space with single matrix
    ctx.transform(
      1,
      0,
      0,
      -1,
      this.#viewport.padding,
      this.#viewport.logicalHeight - this.#viewport.padding,
    );

    ctx.fillCircle(0, 0, 10);

    // 3. Draw in the fully transformed space
    this.#painter.drawStatic(ctx);
    this.#painter.drawInteractive(ctx);

    ctx.flush();
    ctx.restore(); // Return to original state
  }

  public requestRedraw() {
    this.#frameHandler.requestUpdate(() => this.draw());
  }

  public requestImmediateRedraw() {
    this.draw();
  }

  public cancelRedraw() {
    this.#frameHandler.cancelUpdate();
  }

  public destroy() {
    if (this.#staticContext) {
      this.#staticContext.destroy();
    }

    if (this.#interactiveContext) {
      this.#interactiveContext.destroy();
    }
  }
}
