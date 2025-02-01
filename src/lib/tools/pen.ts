import { Tool, ToolName } from "../../types/tool";

export class Pen implements Tool {
  public readonly name: ToolName = "pen";

  onMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {}

  onMouseUp(e: React.MouseEvent<HTMLCanvasElement>): void {}

  onMouseMove(e: React.MouseEvent<HTMLCanvasElement>): void {}
}
