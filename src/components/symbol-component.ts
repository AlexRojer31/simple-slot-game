import { Container, Text } from "pixi.js";

export class SymbolComponent extends Container {
  private symbol!: Text;
  public canMove: boolean = true;

  constructor(later: string) {
    super();

    this.symbol = new Text({
      text: later,
      style: {
        fill: "#ffffff",
        fontSize: 320,
        fontFamily: "Georgia",
      },
    });
    this.symbol.anchor.set(0.5);
    this.addChild(this.symbol);
  }
}
