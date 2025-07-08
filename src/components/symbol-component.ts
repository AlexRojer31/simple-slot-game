import { Container, Text } from "pixi.js";

export class SymbolComponent extends Container {
  private symbol!: Text;
  public canMove: boolean = true;

  constructor(later: string, size: number = 150) {
    super();

    this.symbol = new Text({
      text: later,
      style: {
        fill: "#ffffff",
        fontSize: size,
        fontFamily: "Georgia",
      },
    });
    this.symbol.anchor.set(0.5);
    this.addChild(this.symbol);
  }
}
