import { Container, Graphics } from "pixi.js";
import { CustomEvent } from "../events/custom-event";

export class StarComponent extends Container {
  private graphicStar!: Graphics;
  private starX: number = 0;
  private starY: number = 0;
  private canBeEated: boolean = false;

  constructor(x: number, y: number) {
    super();
    this.starX = x;
    this.starY = y;

    const graphics = new Graphics();
    const radius = 3 + Math.random() * 5;
    const rotation = Math.random() * Math.PI * 2;

    graphics
      .star(this.starX, this.starY, 5, radius, 0, rotation)
      .fill({ color: 0xffdf00, alpha: radius / 5 });

    this.graphicStar = graphics;
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", () => {
      this.canBeEated = true;
      const event: CustomEvent = new CustomEvent();
      event.data = "asdsadsadasdasd asd asd ad sa ";
      window.dispatchEvent(event);
      graphics
        .clear()
        .star(this.starX, this.starY, 5, radius + 3, 0, rotation)
        .fill({ color: 0xffdf00, alpha: radius / 5 });
    });
    this.addChild(this.graphicStar);
  }

  public getStarX(): number {
    return this.starX;
  }

  public getStarY(): number {
    return this.starY;
  }

  public destroyStar(): void {
    if (this.canBeEated) {
      this.graphicStar.destroy();
    }
  }
}
