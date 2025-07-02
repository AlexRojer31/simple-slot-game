import { Assets } from "pixi.js";
import { LoadBandleEvent } from "./event-emitter/custom-events/load-bundle-event";
import { Emitter } from "./event-emitter/event-emitter";
import { BandleLoadedEvent } from "./event-emitter/custom-events/bandle-loaded-event";

export function RunBandleLoader(): void {
  new BandleLoader();
}

export class BandleLoader {
  constructor() {
    this.subscribes();
  }

  private subscribes(): void {
    Emitter().addListener(LoadBandleEvent.NAME, (e: LoadBandleEvent) => {
      this.load(e.data.bandleName).then(() => {
        Emitter().emit(
          BandleLoadedEvent.NAME,
          new BandleLoadedEvent({ bandleName: e.data.bandleName }),
        );
      });
    });

    Emitter().addListener(LoadBandleEvent.NAME, (e: LoadBandleEvent) => {
      this.unload(e.data.bandleName);
    });
  }

  private async load(bandleName: string): Promise<boolean> {
    return await Assets.loadBundle(bandleName);
  }

  private async unload(bandleName: string): Promise<void> {
    return await Assets.unloadBundle(bandleName);
  }
}
