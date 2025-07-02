interface ILoadBandleEvent {
  bandleName: string;
}

export class LoadBandleEvent {
  public static NAME: string = "loadBandle";
  public data!: ILoadBandleEvent;
  constructor(data: ILoadBandleEvent) {
    this.data = data;
  }
}
