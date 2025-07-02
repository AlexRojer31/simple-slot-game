import { Container, Sprite } from "pixi.js";
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
    this.loadSecond();
    this.addChild(this.mountain, this.moon);
  }

  private loadSecond(): void {
    this.mountain = Sprite.from("mountain");
    this.mountain.width = app().screen.width;
    this.mountain.height = (app().screen.height * 2) / 3;
    this.mountain.position.set(0, 400);

    this.moon = Sprite.from("moon");
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
    app().stage.addChild(this);
    this.visible = true;
  }

  unload(): void {
    app().stage.removeChild(this);
    this.visible = false;
  }

  private subscribes(): void {}
}
