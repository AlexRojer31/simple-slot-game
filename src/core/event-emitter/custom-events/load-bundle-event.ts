interface ILoadBandleEvent {
  bandleName: string;
}

export class LoadBandleEvent {
  public static NAME: string = "setScene";
  public data!: ILoadBandleEvent;
  constructor(data: ILoadBandleEvent) {
    this.data = data;
  }
}
