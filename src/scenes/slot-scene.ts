import { Container, Ticker } from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { ReelsComponent } from "../components/reels-component";
import { SymbolComponent } from "../components/symbol-component";
import { Emitter } from "../core/event-emitter/event-emitter";
import { RunReelsEvent } from "../core/event-emitter/custom-events/run-reels-event";
import { StopReelsEvent } from "../core/event-emitter/custom-events/stop-reels-event";
import { GameModel } from "../data-models/game-model";
import { ChangeBetEvent } from "../core/event-emitter/custom-events/change-bet-event";
import { BetChangedEvent } from "../core/event-emitter/custom-events/bet-changed-event";

enum SCENE_STATE {
  idle = 0,
  changingBet,
  running,
  win,
  loss,
}
export class SlotScene extends Container implements IScene {
  private ticker: Ticker = new Ticker();
  private gameModel: GameModel = new GameModel();
  private reelsComponent: ReelsComponent = new ReelsComponent();
  private currentState: number = SCENE_STATE.idle;

  private moneyNow!: SymbolComponent;
  private currentBet!: SymbolComponent;

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
    runBtn.position.set(100, 100);
    runBtn.eventMode = "static";
    runBtn.cursor = "pointer";
    runBtn.on("pointertap", () => {
      if (this.currentState == SCENE_STATE.idle) {
        Emitter().emit(RunReelsEvent.NAME);
        this.currentState = SCENE_STATE.running;

        setTimeout(() => {
          Emitter().emit(StopReelsEvent.NAME);
        }, Math.random() * 6000);
      }
    });

    this.moneyNow = new SymbolComponent(
      this.gameModel.moneyTxt + this.gameModel.balance,
      36,
    );
    this.moneyNow.position.set(150, 200);

    this.currentBet = new SymbolComponent(
      this.gameModel.betTxt +
        this.gameModel.bets[this.gameModel.currentBetIndex],
      36,
    );
    this.currentBet.position.set(120, 250);

    const up: SymbolComponent = new SymbolComponent("UP", 90);
    up.position.set(60, 330);
    up.eventMode = "static";
    up.cursor = "pointer";
    up.on("pointertap", () => {
      Emitter().emit(ChangeBetEvent.NAME, new ChangeBetEvent({ isUp: true }));
      this.currentState = SCENE_STATE.changingBet;
    });

    const down: SymbolComponent = new SymbolComponent("DOWN", 50);
    down.position.set(80, 400);
    down.eventMode = "static";
    down.cursor = "pointer";
    down.on("pointertap", () => {
      Emitter().emit(ChangeBetEvent.NAME, new ChangeBetEvent({ isUp: false }));
      this.currentState = SCENE_STATE.changingBet;
    });

    this.addChild(
      runBtn,
      this.moneyNow,
      this.currentBet,
      up,
      down,
      this.reelsComponent,
    );
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

  private subscribes(): void {
    Emitter().addListener(BetChangedEvent.NAME, () => {
      this.moneyNow.setText(this.gameModel.moneyTxt + this.gameModel.balance);
      this.currentBet.setText(
        this.gameModel.betTxt +
          this.gameModel.bets[this.gameModel.currentBetIndex],
      );
      this.currentState = SCENE_STATE.idle;
    });
  }

  private animate(): void {
    this.reelsComponent.animate();
  }
}
