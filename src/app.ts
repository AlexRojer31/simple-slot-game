import {
  Application,
  Assets,
  AssetsBundle,
  AssetsManifest,
  Graphics,
} from "pixi.js";
import { Emitter, RunEventEmitter } from "./core/event-emitter/event-emitter";
import * as utils from "@pixi/utils";
import { RunSceneManager } from "./core/scene-manager";
import { SetSceneEvent } from "./core/event-emitter/custom-events/set-scene-event";
import { RunBandleLoader } from "./core/bandle-loader";

let application: Application | null = null;

export function app(): Application {
  return application!;
}

export async function Run(): Promise<void> {
  application = new Application();
  await init(application);
  await loadBandles();

  RunEventEmitter();
  RunSceneManager();
  RunBandleLoader();

  Emitter().emit(
    SetSceneEvent.NAME,
    new SetSceneEvent({ sceneName: "PackmanEaterScene" }),
  );

  loadTestComponent(application);
}

async function init(application: Application): Promise<void> {
  await application.init({
    antialias: true,
    backgroundAlpha: 0,
    resizeTo: window,
  });
  document.getElementById("pixi-container")!.appendChild(application.canvas);
}

async function loadBandles(): Promise<void> {
  const baseUrl = "assets";
  const resolution = Math.min(
    utils.isMobile.any ? window.devicePixelRatio : 3,
    3,
  );
  const response = await fetch(baseUrl + "/manifest.json");
  const manifest = (await response.json()) as AssetsManifest;
  if (!manifest.bundles) {
    throw new Error("[Assets] Invalid assets manifest");
  }

  await Assets.init({
    basePath: baseUrl,
    manifest,
    texturePreference: { resolution: [resolution, 1], format: ["webp", "png"] },
  });
  Assets.backgroundLoadBundle(
    manifest.bundles.map((b: AssetsBundle) => b.name),
  );
}

async function loadTestComponent(application: Application): Promise<void> {
  const hex: Graphics = new Graphics()
    .rect(0, 0, 100, 100)
    .fill({ color: "red" });
  application.stage.addChild(hex);
}
