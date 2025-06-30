import {
  Application,
  Assets,
  AssetsBundle,
  AssetsManifest,
  Graphics,
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

  const rect: Graphics = new Graphics()
    .rect(0, 0, 100, 100)
    .fill(0xff0000)
    .moveTo(50, 50)
    .lineTo(100, 0)
    .lineTo(100, 50)
    .lineTo(100, 100)
    .fill(0xffff00);
  rect.pivot.set(rect.width / 2, rect.height / 2);
  rect.position.set(app.screen.width / 2, app.screen.height / 2);
  rect.rotation = degInRad(0);
  app.stage.addChild(rect);

  window.addEventListener("click", (e: MouseEvent) => {
    const catetX = e.clientX - rect.x;
    const catetY = e.clientY - rect.y;
    const hipotenuza = Math.sqrt(catetX * catetX + catetY * catetY);
    const corner = Math.floor((Math.asin(catetY / hipotenuza) * 180) / Math.PI);
    let rotate = 0;
    if (catetX > 0) {
      rotate = 360 + corner > 360 ? 0 + corner : 360 + corner;
    } else {
      rotate = 180 - corner;
    }
    console.log((rect.rotation * 180) / Math.PI);
    rect.rotation = degInRad(rotate);
  });
  // const rad: number = Math.PI / 180;
  // const packman: Graphics = new Graphics()
  //   .arc(0, 0, 50, rad * 30, 320 * rad)
  //   .stroke({
  //     width: 100,
  //     color: 0xffff00,
  //   })
  //   .circle(-30, -30, 20)
  //   .fill({ color: 0x000000 })
  //   .cut();

  // packman.position.set(150);
  // app.stage.addChild(packman);
})();

function degInRad(deg: number): number {
  const rad: number = 180 / Math.PI;

  return deg / rad;
}
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
