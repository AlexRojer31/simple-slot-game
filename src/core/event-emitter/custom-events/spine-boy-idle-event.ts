interface ISpineBoyIdleEvent {
  x: number;
  y: number;
}

export class SpineBoyIdleEvent {
  public static NAME: string = "spineBoyIdle";
  public data!: ISpineBoyIdleEvent;
  constructor(data: ISpineBoyIdleEvent) {
    this.data = data;
  }
}
