interface IChangeBetEvent {
  isUp: boolean;
}

export class ChangeBetEvent {
  public static NAME: string = "changeBetEvent";
  public data!: IChangeBetEvent;
  constructor(data: IChangeBetEvent) {
    this.data = data;
  }
}
