import { Container, Graphics, Point } from "pixi.js";
import { Emitter } from "../core/event-emitter/event-emitter";
import { MustToBeEatingEvent } from "../core/event-emitter/custom-events/must-to-be-eating-event";

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

export class PackmanComponent extends Container {
  private graphicPackman!: Graphics;
  private eatingCounter: number = 0;
  private rotate: number = 0;
  private currentPoint: Point = new Point();
  private pointToMove: Point = new Point();
  private statesSteps: number[] = [];

  constructor(settings: IPackmanSettings) {
    super();
    const packman: Graphics = new Graphics()
      .arc(0, 0, 50, this.convertDegTorad(30), this.convertDegTorad(320))
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

    Emitter().addListener(MustToBeEatingEvent.NAME, this.mooveTo, this);
  }

  public mooveTo(e: MustToBeEatingEvent): void {
    this.pointToMove.x = e.data.x;
    this.pointToMove.y = e.data.y;
    this.currentPoint.x = this.x;
    this.currentPoint.y = this.y;
    this.rotate = this.calculateCorner(this.pointToMove, this.currentPoint);

    this.statesSteps.push(STATES.rotation);
    this.statesSteps.push(STATES.move);
    this.statesSteps.push(STATES.idle);
  }

  public contains(x: number, y: number): boolean {
    const isXInArea =
      x > this.x - this.width / 2 && x < this.x + this.width / 2;
    const isYInArea =
      y > this.y - this.height / 2 && y < this.y + this.height / 2;

    return isXInArea && isYInArea;
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
        this.convertDegTorad(30 - Math.abs(Math.sin(this.eatingCounter) * 30)),
        this.convertDegTorad(320 + Math.abs(Math.sin(this.eatingCounter) * 30)),
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

          Emitter().addListener(MustToBeEatingEvent.NAME, this.mooveTo, this);
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

          Emitter().removeListener(
            MustToBeEatingEvent.NAME,
            this.mooveTo,
            this,
          );
          break;
        }
        case STATES.rotation: {
          const deg: number = (this.graphicPackman.rotation * 180) / Math.PI;
          if (deg > this.rotate) {
            this.graphicPackman.rotation = this.convertDegTorad(deg - 1);
          }
          if (deg < this.rotate) {
            this.graphicPackman.rotation = this.convertDegTorad(deg + 1);
          }
          if (deg + 1 > this.rotate && deg - 1 < this.rotate) {
            this.statesSteps.shift();
          }

          Emitter().removeListener(
            MustToBeEatingEvent.NAME,
            this.mooveTo,
            this,
          );
        }
      }
    }
  }

  private convertDegTorad(deg: number): number {
    const rad: number = 180 / Math.PI;

    return deg / rad;
  }

  private calculateCorner(pointToMove: Point, currentPoint: Point): number {
    const catetX = pointToMove.x - currentPoint.x;
    const catetY = pointToMove.y - currentPoint.y;
    const corner = Math.floor(
      (Math.asin(
        catetY / Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
      ) *
        180) /
        Math.PI,
    );

    let rotateCorner: number = 0;
    if (catetX > 0) {
      rotateCorner = 360 + corner > 360 ? 0 + corner : 360 + corner;
    } else {
      rotateCorner = 180 - corner;
    }
    if (rotateCorner == 360) {
      rotateCorner = 0;
    }

    return rotateCorner;
  }
}
