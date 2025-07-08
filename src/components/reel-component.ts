import { Container } from "pixi.js";
import { SymbolComponent } from "./symbol-component";

export class ReelComponent extends Container {
  private padding: number = 50;

  private symbolsContainer!: Container;
  private symbol1!: Container;
  private symbol2!: Container;
  private symbol3!: Container;
  private symbol4!: Container;
  private symbol5!: Container;
  private symbol6!: Container;
  private symboHeight!: number;
  private symboWidth!: number;

  constructor() {
    super();

    this.symbolsContainer = new Container("А");
    this.symbol1 = new SymbolComponent("А");
    this.symbol2 = new SymbolComponent("Б");
    this.symbol3 = new SymbolComponent("В");
    this.symbol4 = new SymbolComponent("Г");
    this.symbol5 = new SymbolComponent("Д");
    this.symbol6 = new SymbolComponent("Е");

    this.symboWidth = this.symbol1.width;
    this.symboHeight = this.symbol1.height;
    const calculateHeight: number = this.symboHeight - this.padding;
    this.symbol2.position.y = calculateHeight;
    this.symbol3.position.y = calculateHeight * 2;
    this.symbol4.position.y = calculateHeight * 3;
    this.symbol5.position.y = calculateHeight * 4;
    this.symbol6.position.y = calculateHeight * 5;
    this.symbolsContainer.position.x = this.symboWidth / 2 + this.padding;
    this.symbolsContainer.position.y = this.symboHeight / 2 - this.padding;

    this.symbolsContainer.addChild(
      this.symbol1,
      this.symbol2,
      this.symbol3,
      this.symbol4,
      this.symbol5,
      this.symbol6,
    );

    this.addChild(this.symbolsContainer);
  }
}
