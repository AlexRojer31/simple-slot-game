import { Application } from "pixi.js";
import { INIT_EVENT_EMITTER } from "./core/event-emitter/event-emitter";

let instance: Application | null = null;

export function app(): Application {
  return instance!;
}

export function INIT_APP() {
  instance = new Application();
  INIT_EVENT_EMITTER();
}
