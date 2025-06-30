import {
  Application,
  Assets,
  AssetsBundle,
  AssetsManifest,
  Sprite,
  Spritesheet,
} from "pixi.js";
import * as utils from "@pixi/utils";

(async () => {
  const app = new Application();
  await app.init({
    antialias: true,
    backgroundAlpha: 0,
    resizeTo: window,
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

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

  const commonAssets = await Assets.loadBundle("common");
  const logo: Sprite = Sprite.from(commonAssets.logo);
  app.stage.addChild(logo);

  const texturesAssets = await Assets.loadBundle("textures");
  const snow: Sprite = Sprite.from(texturesAssets.water.textures.ice);
  snow.position.set(300, 0);
  snow.texture = texturesAssets.earth.textures.lava;
  app.stage.addChild(snow);
})();
