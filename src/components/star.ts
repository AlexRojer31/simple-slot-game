import { Container, Graphics } from "pixi.js";

export class Star extends Container {
  private graphicStar!: Graphics;

  constructor(x: number, y: number) {
    super();
    const graphics = new Graphics();
    const radius = 2 + Math.random() * 3;
    const rotation = Math.random() * Math.PI * 2;

    graphics
      .star(x, y, 5, radius, 0, rotation)
      .fill({ color: 0xffdf00, alpha: radius / 5 });

    this.graphicStar = graphics;
    this.addChild(this.graphicStar);
  }
}
