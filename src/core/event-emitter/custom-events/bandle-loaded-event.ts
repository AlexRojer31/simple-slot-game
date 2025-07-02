interface IBandleLoadedEvent {
  bandleName: string;
}

export class BandleLoadedEvent {
  public static NAME: string = "setScene";
  public data!: IBandleLoadedEvent;
  constructor(data: IBandleLoadedEvent) {
    this.data = data;
  }
}
