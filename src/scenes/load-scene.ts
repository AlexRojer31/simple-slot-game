import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { app } from "../app";
import { Emitter } from "../core/event-emitter/event-emitter";
import { BundleLoadedEvent } from "../core/event-emitter/custom-events/bundle-loaded-event";

export class LoadScene extends Container {
  private mountain!: Sprite;
  private moon!: Sprite;
  private graphics!: Graphics;

  constructor() {
    super();
    this.loadFerst();
    const result: Promise<void> = this.loadSecond();
    result.then(() => {
      Emitter().emit(
        BundleLoadedEvent.NAME,
        new BundleLoadedEvent({ bandleName: "backgrounds" }),
      );

      this.addChild(this.graphics, this.mountain, this.moon);
      app().stage.addChild(this);
    });
  }

  private loadFerst(): void {
    const starCount = 50;
    this.graphics = new Graphics();
    for (let index = 0; index < starCount; index++) {
      const x = (index * 0.78695 * app().screen.width) % app().screen.width;
      const y = (index * 0.9382 * app().screen.height) % app().screen.height;
      const radius = 2 + Math.random() * 3;
      const rotation = Math.random() * Math.PI * 2;
      this.graphics
        .star(x, y, 5, radius, 0, rotation)
        .fill({ color: 0xffdf00, alpha: radius / 5 });
    }
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
