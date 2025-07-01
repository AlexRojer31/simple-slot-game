interface ISetSceneEvent {
  sceneName: string;
}

export class SetSceneEvent {
  public static NAME: string = "setScene";
  public data!: ISetSceneEvent;
  constructor(data: ISetSceneEvent) {
    this.data = data;
  }
}
