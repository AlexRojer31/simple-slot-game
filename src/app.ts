import { Application, Assets, AssetsBundle, AssetsManifest } from "pixi.js";
import { RunEventEmitter } from "./core/event-emitter/event-emitter";
import * as utils from "@pixi/utils";

let application: Application | null = null;

export function app(): Application {
  return application!;
}

export async function Run(): Promise<void> {
  application = new Application();
  await application.init({
    antialias: true,
    backgroundAlpha: 0,
    resizeTo: window,
  });
  document.getElementById("pixi-container")!.appendChild(application.canvas);

  const baseUrl = "assets";
  const response = await fetch(baseUrl + "/manifest.json");
  const manifest = (await response.json()) as AssetsManifest;
  if (!manifest.bundles) {
    throw new Error("[Assets] Invalid assets manifest");
  }
  const resolution = Math.min(
    utils.isMobile.any ? window.devicePixelRatio : 3,
    3,
  );

  await Assets.init({
    basePath: baseUrl,
    manifest,
    texturePreference: { resolution: [resolution, 1], format: ["webp", "png"] },
  });
  Assets.backgroundLoadBundle(
    manifest.bundles.map((b: AssetsBundle) => b.name),
  );

  RunEventEmitter();
}
