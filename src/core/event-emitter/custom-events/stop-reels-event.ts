interface IStopReelsEvent {
  requiredSymbols: number[];
  isWin: boolean;
}
export class StopReelsEvent {
  public static NAME: string = "stopReelsEvent";
  public data!: IStopReelsEvent;
  constructor(data: IStopReelsEvent) {
    this.data = data;
  }
}
