interface ISpineBoyMoveEvent {
  x: number;
  y: number;
}

export class SpineBoyMoveEvent {
  public static NAME: string = "spineBoyMove";
  public data!: ISpineBoyMoveEvent;
  constructor(data: ISpineBoyMoveEvent) {
    this.data = data;
  }
}
