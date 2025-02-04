import { create } from "zustand";

import { CanvasManager } from "../lib/editor/CanvasManager";
import { Scene } from "../lib/editor/Scene";
import { ToolName } from "../types/tool";

interface AppState {
  upm: number;
  padding: number;
  canvasContext: CanvasManager;
  scene: Scene;
  activeTool: ToolName;
  setActiveTool: (tool: ToolName) => void;
}

const AppState = create<AppState>()((set) => ({
  upm: 1000,
  padding: 100,
  canvasContext: new CanvasManager(),
  scene: new Scene(),
  activeTool: "select",
  setActiveTool: (tool: ToolName) => {
    set({ activeTool: tool });
    console.log(tool);
  },
}));

export default AppState;
