import { Container, Ticker } from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";

export class SlotScene extends Container implements IScene {
  private ticker: Ticker = new Ticker();

  constructor() {
    super();
    this.subscribes();
    this.ticker.add(() => {
      this.animate();
    });
  }

  load(): void {
    app().stage.addChild(this);
    this.visible = true;
    this.ticker.start();
  }

  unload(): void {
    app().stage.removeChild(this);
    this.visible = false;
    this.ticker.stop();
  }

  private subscribes(): void {}

  private animate(): void {}
}
