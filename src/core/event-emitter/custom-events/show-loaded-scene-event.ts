interface IShowLoadedSceneEvent {
  isShow: boolean;
}

export class ShowLoadedSceneEvent {
  public static NAME: string = "showLoadedScene";
  public data!: IShowLoadedSceneEvent;
  constructor(data: IShowLoadedSceneEvent) {
    this.data = data;
  }
}
