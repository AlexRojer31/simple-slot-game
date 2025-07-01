import { EventEmitter } from "@pixi/utils";

let instance: EventEmitter | null = null;

export function Emitter(): EventEmitter {
  return instance!;
}

export function RunEventEmitter() {
  instance = new EventEmitter();
}
