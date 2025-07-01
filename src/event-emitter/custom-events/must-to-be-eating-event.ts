interface IMustToBeEatingEvent {
  x: number;
  y: number;
}

export class MustToBeEatingEvent {
  public static NAME: string = "nustToBeEating";
  public data!: IMustToBeEatingEvent;
  constructor(data: IMustToBeEatingEvent) {
    this.data = data;
  }
}
