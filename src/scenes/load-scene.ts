import { Assets, Container, Sprite } from "pixi.js";
import { app } from "../app";
import { Emitter } from "../core/event-emitter/event-emitter";
import { BundleLoadedEvent } from "../core/event-emitter/custom-events/bundle-loaded-event";

export class LoadScene extends Container {
  private mountain!: Sprite;
  private moon!: Sprite;

  constructor() {
    super();
    const result: Promise<void> = this.loadSecond();
    result.then(() => {
      Emitter().emit(
        BundleLoadedEvent.NAME,
        new BundleLoadedEvent({ bandleName: "backgrounds" }),
      );

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
  }
}
