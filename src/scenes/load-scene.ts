import { Assets, Container, Sprite } from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { Emitter } from "../core/event-emitter/event-emitter";
import { SetSceneEvent } from "../core/event-emitter/custom-events/set-scene-event";

export class LoadScene extends Container implements IScene {
  private mountain!: Sprite;
  private moon!: Sprite;

  constructor() {
    super();
    this.subscribes();
    const result: Promise<void> = this.loadSecond();
    result.then(() => {
      this.addChild(this.mountain, this.moon);
      app().stage.addChild(this);
    });
  }

  private async loadSecond(): Promise<void> {
    const commonAssets = await Assets.loadBundle("backgrounds");
    this.mountain = Sprite.from(commonAssets.mountain);
    this.mountain.width = app().screen.width;
    this.mountain.height = (app().screen.height * 2) / 3;
    this.mountain.position.set(0, 400);

    this.moon = Sprite.from(commonAssets.moon);
    this.moon.tint = 0xff0000;
    this.moon.position.set(30, 30);
    this.moon.eventMode = "static";
    this.moon.on("pointertap", () => {
      Emitter().emit(
        SetSceneEvent.NAME,
        new SetSceneEvent({ sceneName: "PackmanEaterScene" }),
      );
    });
  }

  load(): void {
    this.visible = true;
  }

  unload(): void {
    this.visible = false;
  }

  private subscribes(): void {}
}
