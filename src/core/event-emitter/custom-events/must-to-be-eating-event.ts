interface IMustToBeEatingEvent {
  x: number;
  y: number;
}

export class MustToBeEatingEvent {
  public static NAME: string = "mustToBeEating";
  public data!: IMustToBeEatingEvent;
  constructor(data: IMustToBeEatingEvent) {
    this.data = data;
  }
}
