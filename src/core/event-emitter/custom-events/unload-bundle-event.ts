interface IUnloadBandleEvent {
  bandleName: string;
}

export class UnloadBandleEvent {
  public static NAME: string = "unloadBandle";
  public data!: IUnloadBandleEvent;
  constructor(data: IUnloadBandleEvent) {
    this.data = data;
  }
}
