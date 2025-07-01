export const CUSTOM_EVENT = "customEvent";

export class CustomEvent extends Event {
  public data: string = "";
  constructor() {
    super("customEvent");
  }
}
