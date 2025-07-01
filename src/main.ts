import {
  Application,
  Assets,
  AssetsBundle,
  AssetsManifest,
  Container,
} from "pixi.js";
import * as utils from "@pixi/utils";
import { Star } from "./components/star";
import { Packman } from "./components/packman";

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

  const scene: Container = new Container();
  scene.hitArea = app.screen;
  scene.eventMode = "static";

  const starCount = 30;
  for (let index = 0; index < starCount; index++) {
    const x = (index * Math.random() * app.screen.width) % app.screen.width;
    const y = (index * Math.random() * app.screen.height) % app.screen.height;
    const star = new Star(x, y);
    scene.addChild(star);
  }

  const newPack: Packman = new Packman({
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    width: 50,
    height: 50,
  });
  scene.addChild(newPack);

  scene.on("pointerdown", newPack.mooveTo, newPack);

  app.stage.addChild(scene);
  app.ticker.add(() => {
    newPack.eating();
    newPack.mooving();
  });
})();

// async function testLoads(app: Application): void {
//   const starCount = 50;
//   const graphics = new Graphics();
//   for (let index = 0; index < starCount; index++) {
//     const x = (index * 0.78695 * app.screen.width) % app.screen.width;
//     const y = (index * 0.9382 * app.screen.height) % app.screen.height;
//     const radius = 2 + Math.random() * 3;
//     const rotation = Math.random() * Math.PI * 2;

//     graphics
//       .star(x, y, 5, radius, 0, rotation)
//       .fill({ color: 0xffdf00, alpha: radius / 5 });
//   }

//   app.stage.addChild(graphics);

//   const commonAssets = await Assets.loadBundle("backgrounds");
//   const mountain: Sprite = Sprite.from(commonAssets.mountain);
//   mountain.width = app.screen.width;
//   mountain.height = (app.screen.height * 2) / 3;
//   mountain.position.set(0, 400);
//   app.stage.addChild(mountain);

//   const moon: Sprite = Sprite.from(commonAssets.moon);
//   moon.tint = 0xff0000;
//   moon.position.set(30, 30);
//   app.stage.addChild(moon);

//   const texturesAssets = await Assets.loadBundle("textures");
//   const snow: Sprite = Sprite.from(texturesAssets.water.textures.ice);
//   snow.position.set(300, 0);
//   snow.texture = texturesAssets.earth.textures.lava;
//   app.stage.addChild(snow);
// }
