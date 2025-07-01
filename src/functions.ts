import { Point } from "pixi.js";

export function DEG_TO_RAD(deg: number): number {
  const rad: number = 180 / Math.PI;

  return deg / rad;
}

export function GET_CORNER(pointToMove: Point, currentPoint: Point): number {
  const catetX = pointToMove.x - currentPoint.x;
  const catetY = pointToMove.y - currentPoint.y;
  const corner = Math.floor(
    (Math.asin(catetY / Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2))) *
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
