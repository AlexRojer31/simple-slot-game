interface IBandleLoadedEvent {
  bandleName: string;
}

export class BandleLoadedEvent {
  public static NAME: string = "bandleLoaded";
  public data!: IBandleLoadedEvent;
  constructor(data: IBandleLoadedEvent) {
    this.data = data;
  }
}
