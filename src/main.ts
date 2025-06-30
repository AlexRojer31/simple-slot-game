import {
  Application,
  Assets,
  AssetsManifest,
  Container,
  Graphics,
  Sprite,
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
  // const baseUrl = 'https://s3/my-bucket';

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

  await Assets.loadBundle("shared", onProgress);
  await Assets.loadBundle("textures"); // onProgress to feed the progress bar

  function onProgress(progress: number) {
    console.log(`Loading: ${Math.round(progress * 100)}%`);
  }
  // await Assets.loadBundle('load-screen');

  // load-screen assets loaded, show load screen

  // await Assets.loadBundle('ui');
  // await Assets.loadBundle('game-screen', onProgress);

  // game assets loaded, wait for player to hide load screen

  // Assets.unloadBundle('load-screen');

  const container = new Container();
  const singleSprite = Sprite.from("snow");
  container.addChild(singleSprite);
  app.stage.addChild(container);

  const maska = new Graphics().rect(0, 0, 100, 100).fill({ alpha: 0.3 });
  container.mask = maska;
  app.stage.addChild(maska);

  // const spritesheet = Assets.cache.get<Spritesheet>('skins');
  // const spritesheetSprite = new Sprite(spritesheet.textures['hat']);
})();
