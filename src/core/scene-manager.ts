import { LoadScene } from "../scenes/load-scene";
import { PackmanEaterScene } from "../scenes/packman-eater-scene";
import { SetSceneEvent } from "./event-emitter/custom-events/set-scene-event";
import { Emitter } from "./event-emitter/event-emitter";

export interface IScene {
  load(): void;
  unload(): void;
}

export function RunSceneManager(): void {
  new SceneManager();
}

class SceneManager {
  private scenes: Map<string, IScene> = new Map();
  private currentScene: IScene | null = null;

  constructor() {
    this.subscribes();
  }

  private subscribes(): void {
    Emitter().addListener(SetSceneEvent.NAME, (e: SetSceneEvent) => {
      switch (e.data.sceneName) {
        case "PackmanEaterScene": {
          this.currentScene?.unload();
          if (this.scenes.has(e.data.sceneName)) {
            this.scenes.get(e.data.sceneName)!.load();
          } else {
            this.scenes.set(e.data.sceneName, new PackmanEaterScene());
            this.scenes.get(e.data.sceneName)!.load();
          }
          this.currentScene = this.scenes.get(e.data.sceneName)!;
          break;
        }
        case "LoadScene": {
          this.currentScene?.unload();
          if (this.scenes.has(e.data.sceneName)) {
            this.scenes.get(e.data.sceneName)!.load();
          } else {
            this.scenes.set(e.data.sceneName, new LoadScene());
            this.scenes.get(e.data.sceneName)!.load();
          }
          this.currentScene = this.scenes.get(e.data.sceneName)!;
          break;
        }
      }
    });
  }
}
