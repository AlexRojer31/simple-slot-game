import { Assets, Container, Sprite } from "pixi.js";
import { app } from "../app";
import { Emitter } from "../core/event-emitter/event-emitter";
import { BundleLoadedEvent } from "../core/event-emitter/custom-events/bundle-loaded-event";
import { ShowLoadedSceneEvent } from "../core/event-emitter/custom-events/show-loaded-scene-event";

export class LoadScene extends Container {
  private mountain!: Sprite;
  private moon!: Sprite;

  constructor() {
    super();
    this.subscribes();
    const result: Promise<void> = this.loadSecond();
    result.then(() => {
      this.addChild(this.mountain, this.moon);

      Emitter().emit(
        BundleLoadedEvent.NAME,
        new BundleLoadedEvent({ bandleName: "backgrounds" }),
      );
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
  }

  private subscribes(): void {
    Emitter().addListener(ShowLoadedSceneEvent.NAME, () => {
      app().stage.addChild(this);
    });
  }
}
