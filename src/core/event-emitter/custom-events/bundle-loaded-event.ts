interface IBundleLoadedEvent {
  bandleName: string;
}

export class BundleLoadedEvent {
  public static NAME: string = "bundleLoaded";
  public data!: IBundleLoadedEvent;
  constructor(data: IBundleLoadedEvent) {
    this.data = data;
  }
}
