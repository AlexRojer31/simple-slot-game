import { Container, Graphics } from "pixi.js";
import { SymbolComponent } from "./symbol-component";

enum ANIMATIONS_STATE {
  idle = 0,
  rotate,
}
export class ReelComponent extends Container {
  private currentState: number = ANIMATIONS_STATE.idle;
  private modifySpeed: number = 1;
  private symbolsInReel: number = 3;
  private padding: number = 30;
  private symbols: SymbolComponent[] = [];
  private defaultSpeed: number = Math.round(
    10 * Math.random() * 3 + Math.random() * this.modifySpeed,
  );

  private symbolHeight!: number;
  private symbolWidth!: number;

  constructor(modifySpeed: number = 1, symbolsInReel: number = 3) {
    super();
    this.modifySpeed = modifySpeed;
    this.symbolsInReel = symbolsInReel;
    this.generateSymbols(6, "ПРИВЕТЫ");
  }

  private generateSymbols(count: number, str: string): void {
    const symbolsContainer: Container = new Container();
    for (let i: number = 0; i < count; i++) {
      const symbol: SymbolComponent = new SymbolComponent(str[i], 220);
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
    }
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
}
