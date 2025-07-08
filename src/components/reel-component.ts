import { Container, Graphics } from "pixi.js";
import { SymbolComponent } from "./symbol-component";
import { RunReelsEvent } from "../core/event-emitter/custom-events/run-reels-event";
import { Emitter } from "../core/event-emitter/event-emitter";
import { StopReelsEvent } from "../core/event-emitter/custom-events/stop-reels-event";

enum ANIMATIONS_STATE {
  idle = 0,
  rotate,
  slow,
  toLine,
}
export class ReelComponent extends Container {
  private reelNumber: number = 0;
  private requiredSymbol: number = 0;
  private currentState: number = ANIMATIONS_STATE.idle;
  private modifySpeed: number = 1;
  private symbolsInReel: number = 3;
  private padding: number = 15;
  private symbols: SymbolComponent[] = [];
  private defaultSpeed: number = Math.round(
    10 * Math.random() * 3 + Math.random() * this.modifySpeed,
  );
  private slowlySpeed: number = this.defaultSpeed;

  private symbolHeight!: number;
  private symbolWidth!: number;

  constructor(
    reelNumber: number = 0,
    modifySpeed: number = 1,
    symbolsInReel: number = 3,
  ) {
    super();
    this.reelNumber = reelNumber;
    this.modifySpeed = modifySpeed;
    this.symbolsInReel = symbolsInReel;
    this.generateSymbols(6, "ПРИВЕТЫ");
    this.subscribes();
  }

  private generateSymbols(count: number, str: string): void {
    const symbolsContainer: Container = new Container();
    for (let i: number = 0; i < count; i++) {
      const symbol: SymbolComponent = new SymbolComponent(str[i], 130);
      this.symbols.push(symbol);
      this.symbolWidth = symbol.width;
      this.symbolHeight = symbol.height;
      symbol.position.y = (this.symbolHeight - this.padding) * i;
    }
    symbolsContainer.position.x = this.symbolWidth / 2 + this.padding;
    symbolsContainer.position.y = this.symbolHeight / 2 - this.padding;

    const containerMask: Graphics = new Graphics()
      .rect(
        0,
        0,
        this.symbolWidth + this.padding,
        this.symbolHeight * this.symbolsInReel -
          this.symbolsInReel * this.padding,
      )
      .fill(0x000000);
    symbolsContainer.mask = containerMask;

    symbolsContainer.addChild(...this.symbols);
    this.addChild(containerMask, symbolsContainer);
  }

  public animate(): void {
    switch (this.currentState) {
      case ANIMATIONS_STATE.idle:
        break;
      case ANIMATIONS_STATE.rotate:
        this.rotate();
        break;
      case ANIMATIONS_STATE.slow:
        this.slow();
        break;
    }
  }

  public slow(): void {
    this.symbols.forEach((s: SymbolComponent, i: number) => {
      if (
        i == this.requiredSymbol &&
        s.position.y ==
          (this.symbolWidth + this.padding,
          this.symbolHeight * this.symbolsInReel -
            this.symbolsInReel * this.padding) /
            2
      ) {
        this.currentState = ANIMATIONS_STATE.idle;
        this.slowlySpeed = this.defaultSpeed;
        return;
      }
    });
    this.symbols.forEach((s: SymbolComponent, i: number) => {
      const nextS: number = i == this.symbols.length - 1 ? 0 : i + 1;
      if (this.symbols[nextS].position.y > -this.padding / 2) {
        s.canMove = true;
      }
      if (s.canMove) {
        s.position.y += this.slowlySpeed;
        if (this.slowlySpeed > 1) {
          this.slowlySpeed -= 0.01;
        } else {
          this.slowlySpeed = 1;
        }
      }
      if (
        s.position.y >
        this.symbolHeight * this.symbolsInReel -
          this.symbolsInReel * this.padding
      ) {
        s.position.y = -this.symbolHeight + this.padding;
        s.canMove = false;
      }
    });
  }

  public rotate(): void {
    this.symbols.forEach((s: SymbolComponent, i: number) => {
      const nextS: number = i == this.symbols.length - 1 ? 0 : i + 1;
      if (this.symbols[nextS].position.y > -this.padding / 2) {
        s.canMove = true;
      }
      if (s.canMove) {
        s.position.y += this.defaultSpeed;
      }
      if (
        s.position.y >
        this.symbolHeight * this.symbolsInReel -
          this.symbolsInReel * this.padding
      ) {
        s.position.y = -this.symbolHeight + this.padding;
        s.canMove = false;
      }
    });
  }

  private subscribes(): void {
    Emitter().addListener(RunReelsEvent.NAME, () => {
      this.currentState = ANIMATIONS_STATE.rotate;
    });

    Emitter().addListener(StopReelsEvent.NAME, (e: StopReelsEvent) => {
      this.requiredSymbol = e.data.requiredSymbols[this.reelNumber];
      this.currentState = ANIMATIONS_STATE.slow;
    });
  }
}
