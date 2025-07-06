interface ILoadExternalBandleEvent {
  alias: string;
  src: string;
}

export class LoadExternalBandleEvent {
  public static NAME: string = "loadExternalBandle";
  public data!: ILoadExternalBandleEvent;
  constructor(data: ILoadExternalBandleEvent) {
    this.data = data;
  }
}
