import { Container, Graphics } from "pixi.js";
import { SymbolComponent } from "./symbol-component";

export class ReelComponent extends Container {
  private padding: number = 50;
  private symbols: SymbolComponent[] = [];

  private containerMask!: Graphics;
  private symbolsContainer!: Container;
  private symbol1!: SymbolComponent;
  private symbol2!: SymbolComponent;
  private symbol3!: SymbolComponent;
  private symbol4!: SymbolComponent;
  private symbol5!: SymbolComponent;
  private symbol6!: SymbolComponent;
  private symbolHeight!: number;
  private symbolWidth!: number;

  constructor() {
    super();

    this.symbolsContainer = new Container();
    this.symbol1 = new SymbolComponent("А");
    this.symbol2 = new SymbolComponent("Б");
    this.symbol3 = new SymbolComponent("В");
    this.symbol4 = new SymbolComponent("Г");
    this.symbol5 = new SymbolComponent("Д");
    this.symbol6 = new SymbolComponent("Е");
    this.symbols.push(this.symbol1);
    this.symbols.push(this.symbol2);
    this.symbols.push(this.symbol3);
    this.symbols.push(this.symbol4);
    this.symbols.push(this.symbol5);
    this.symbols.push(this.symbol6);

    this.symbolWidth = this.symbol1.width;
    this.symbolHeight = this.symbol1.height;
    const calculateHeight: number = this.symbolHeight - this.padding;
    this.symbol2.position.y = calculateHeight;
    this.symbol3.position.y = calculateHeight * 2;
    this.symbol4.position.y = calculateHeight * 3;
    this.symbol5.position.y = calculateHeight * 4;
    this.symbol6.position.y = calculateHeight * 5;
    this.symbolsContainer.position.x = this.symbolWidth / 2 + this.padding;
    this.symbolsContainer.position.y = this.symbolHeight / 2 - this.padding;

    this.containerMask = new Graphics()
      .rect(
        0,
        0,
        this.symbolWidth + this.padding,
        this.symbolHeight * 3 - 3 * this.padding,
      )
      .fill(0x000000);
    this.symbolsContainer.mask = this.containerMask;

    this.symbolsContainer.addChild(...this.symbols);
    this.addChild(this.containerMask, this.symbolsContainer);
  }
}
