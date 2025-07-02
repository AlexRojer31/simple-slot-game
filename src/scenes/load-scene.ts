import { Container, Sprite } from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { Emitter } from "../core/event-emitter/event-emitter";
import { SetSceneEvent } from "../core/event-emitter/custom-events/set-scene-event";

export class LoadScene extends Container implements IScene {
  private planet!: Sprite;
  private mountain!: Sprite;
  private moon!: Sprite;

  constructor() {
    super();
    this.subscribes();
    this.loadSecond();
    this.addChild(this.mountain, this.moon, this.planet);
  }

  private loadSecond(): void {
    this.planet = Sprite.from("planet");
    this.planet.position.set(app().screen.width / 2, 200);
    this.planet.scale.set(2);
    this.planet.position.set(-100, 50);
    this.planet.rotation = 5 / (180 / Math.PI);

    this.mountain = Sprite.from("mountain");
    this.mountain.position.set(650, 150);

    this.moon = Sprite.from("moon");
    this.moon.tint = 0xff0000;
    this.moon.position.set(50, 50);
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
