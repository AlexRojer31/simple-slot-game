import { Assets } from "pixi.js";
import { LoadBandleEvent } from "./event-emitter/custom-events/load-bundle-event";
import { Emitter } from "./event-emitter/event-emitter";
import { BandleLoadedEvent } from "./event-emitter/custom-events/bandle-loaded-event";
import { UnloadBandleEvent } from "./event-emitter/custom-events/unload-bundle-event";

export function RunBandleLoader(): void {
  new BandleLoader();
}

enum BANDLE_STATES {
  loaded = 0,
  unloaded,
}

export class BandleLoader {
  private loadedBandles: Map<string, BANDLE_STATES> = new Map();

  constructor() {
    this.subscribes();
  }

  private subscribes(): void {
    Emitter().addListener(LoadBandleEvent.NAME, (e: LoadBandleEvent) => {
      this.load(e.data.bandleName).then((result: boolean) => {
        if (result) {
          Emitter().emit(
            BandleLoadedEvent.NAME,
            new BandleLoadedEvent({ bandleName: e.data.bandleName }),
          );
        }
      });
    });

    Emitter().addListener(UnloadBandleEvent.NAME, (e: UnloadBandleEvent) => {
      this.unload(e.data.bandleName);
    });
  }

  private async load(bandleName: string): Promise<boolean> {
    if (
      this.loadedBandles.has(bandleName) &&
      this.loadedBandles.get(bandleName) === BANDLE_STATES.loaded
    ) {
      return true;
    }
    const asset = await Assets.loadBundle(bandleName);
    if (asset) {
      this.loadedBandles.set(bandleName, BANDLE_STATES.loaded);
      return true;
    }

    return false;
  }

  private async unload(bandleName: string): Promise<void> {
    if (this.loadedBandles.get(bandleName) === BANDLE_STATES.unloaded) {
      return;
    }

    if (this.loadedBandles.get(bandleName) === BANDLE_STATES.loaded) {
      this.loadedBandles.set(bandleName, BANDLE_STATES.unloaded);
    }
    return await Assets.unloadBundle(bandleName);
  }
}
