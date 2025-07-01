import { Circle, Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { Emitter } from "../core/event-emitter/event-emitter";
import { MustToBeEatingEvent } from "../core/event-emitter/custom-events/must-to-be-eating-event";

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
    this.hitArea = new Circle(x, y, 10);
    this.on("pointerdown", (e: FederatedPointerEvent) => {
      this.canBeEated = true;

      Emitter().emit(
        MustToBeEatingEvent.NAME,
        new MustToBeEatingEvent({ x: e.x, y: e.y }),
      );
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
