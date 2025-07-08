import { Container, Ticker } from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { ReelsComponent } from "../components/reels-component";
import { SymbolComponent } from "../components/symbol-component";
import { Emitter } from "../core/event-emitter/event-emitter";
import { RunReelsEvent } from "../core/event-emitter/custom-events/run-reels-event";
import { StopReelsEvent } from "../core/event-emitter/custom-events/stop-reels-event";

export class SlotScene extends Container implements IScene {
  private ticker: Ticker = new Ticker();
  private reelsComponent: ReelsComponent = new ReelsComponent();

  constructor() {
    super();
    this.subscribes();
    this.ticker.add(() => {
      this.animate();
    });

    this.reelsComponent.position.set(
      app().screen.width / 2 - this.reelsComponent.width / 2,
      100,
    );

    const runBtn: SymbolComponent = new SymbolComponent("RUN", 90);
    runBtn.position.set(130, 100);
    runBtn.eventMode = "static";
    runBtn.cursor = "pointer";
    runBtn.on("pointertap", runReel);

    function runReel() {
      Emitter().emit(RunReelsEvent.NAME);
      runBtn.off("pointertap", runReel);

      setTimeout(() => {
        Emitter().emit(StopReelsEvent.NAME);
        runBtn.on("pointertap", runReel);
      }, Math.random() * 6000);
    }

    this.addChild(runBtn, this.reelsComponent);
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

  private animate(): void {
    this.reelsComponent.animate();
  }
}
