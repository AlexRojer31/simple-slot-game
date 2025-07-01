import { EventEmitter } from "@pixi/utils";

let instance: EventEmitter | null = null;

export function Emitter(): EventEmitter {
  return instance!;
}

export function INIT_EVENT_EMITTER() {
  instance = new EventEmitter();
}
