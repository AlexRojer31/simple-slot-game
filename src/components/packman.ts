import { Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { DEG_TO_RAD, GET_CORNER } from "../utils/functions";

// enum STATES {
//   idle = 0,
//   rotation,
//   move,
// }

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
  //   private packmanStates: number[] = [];

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

    this.graphicPackman.rotation = DEG_TO_RAD(this.rotate);
    this.position.set(this.pointToMove.x, this.pointToMove.y);
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

  public mooving(): void {}

  //   public move(e: MouseEvent) {
  //     const catetX = e.clientX - this.graphicPackman.x;
  //     const catetY = e.clientY - this.graphicPackman.y;
  //     const corner = Math.floor(
  //       (Math.asin(
  //         catetY / Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
  //       ) *
  //         180) /
  //         Math.PI,
  //     );
  //     if (catetX > 0) {
  //       this.rotate = 360 + corner > 360 ? 0 + corner : 360 + corner;
  //     } else {
  //       this.rotate = 180 - corner;
  //     }
  //     if (this.rotate == 360) {
  //       this.rotate = 0;
  //     }
  //     this.pointToMove.x = e.clientX;
  //     this.pointToMove.y = e.clientY;
  //     this.currentPoint.x = packman.x;
  //     this.currentPoint.y = packman.y;
  //     this.packmanStates.push(STATES.rotation);
  //     this.packmanStates.push(STATES.move);
  //     this.packmanStates.push(STATES.idle);
  //     window.removeEventListener("click", this.move);
  //   }

  //   public animateMove() {}
}
