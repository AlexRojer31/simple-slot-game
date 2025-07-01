import { Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { DEG_TO_RAD, GET_CORNER } from "../utils/functions";

enum STATES {
  idle = 0,
  rotation,
  move,
}

interface IPackmanSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Packman extends Container {
  private graphicPackman!: Graphics;
  private eatingCounter: number = 0;
  private rotate: number = 0;
  private currentPoint: Point = new Point();
  private pointToMove: Point = new Point();
  private statesSteps: number[] = [];

  constructor(settings: IPackmanSettings) {
    super();
    const packman: Graphics = new Graphics()
      .arc(0, 0, 50, DEG_TO_RAD(30), DEG_TO_RAD(320))
      .stroke({
        width: 100,
        color: 0xffff00,
      })
      .circle(-30, -30, 20)
      .fill({ color: 0x000000 })
      .cut();
    this.position.set(settings.x, settings.y);
    this.graphicPackman = packman;
    this.addChild(this.graphicPackman);
    this.width = settings.width;
    this.height = settings.height;
    this.pivot.set(this.width / 2, this.height / 2);
  }

  public mooveTo(e: FederatedPointerEvent): void {
    this.pointToMove.x = e.clientX;
    this.pointToMove.y = e.clientY;
    this.currentPoint.x = this.x;
    this.currentPoint.y = this.y;
    this.rotate = GET_CORNER(this.pointToMove, this.currentPoint);

    this.statesSteps.push(STATES.rotation);
    this.statesSteps.push(STATES.move);
    this.statesSteps.push(STATES.idle);
  }

  public eating(): void {
    if (this.eatingCounter > 100000) {
      this.eatingCounter = 0;
    } else {
      this.eatingCounter += 0.1;
    }

    this.graphicPackman
      .clear()
      .arc(
        0,
        0,
        50,
        DEG_TO_RAD(30 - Math.abs(Math.sin(this.eatingCounter) * 30)),
        DEG_TO_RAD(320 + Math.abs(Math.sin(this.eatingCounter) * 30)),
      )
      .stroke({
        width: 100,
        color: 0xffff00,
      })
      .circle(-30, -30, 20)
      .fill({ color: 0x000000 })
      .cut();
  }

  public mooving(): void {
    if (this.statesSteps.length > 0) {
      switch (this.statesSteps[0]) {
        case STATES.idle: {
          this.statesSteps.shift();
          break;
        }
        case STATES.move: {
          const stepX: number =
            this.currentPoint.x > this.pointToMove.x ? -1 : 1;
          this.currentPoint.x += stepX;
          const stepY: number =
            this.currentPoint.y > this.pointToMove.y ? -1 : 1;
          this.currentPoint.y += stepY;
          if (this.currentPoint.x != this.pointToMove.x) {
            this.position.set(this.currentPoint.x, this.position.y);
          }
          if (this.currentPoint.y != this.pointToMove.y) {
            this.position.set(this.position.x, this.currentPoint.y);
          }
          if (
            this.position.x + 10 > this.pointToMove.x &&
            this.position.x - 10 < this.pointToMove.x &&
            this.position.y + 10 > this.pointToMove.y &&
            this.position.y - 10 < this.pointToMove.y
          ) {
            this.statesSteps.shift();
          }
          break;
        }
        case STATES.rotation: {
          const deg: number = (this.graphicPackman.rotation * 180) / Math.PI;
          if (deg > this.rotate) {
            this.graphicPackman.rotation = DEG_TO_RAD(deg - 1);
          }
          if (deg < this.rotate) {
            this.graphicPackman.rotation = DEG_TO_RAD(deg + 1);
          }
          if (deg + 1 > this.rotate && deg - 1 < this.rotate) {
            this.statesSteps.shift();
          }
        }
      }
    }
  }
}
