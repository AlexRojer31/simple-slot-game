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

  scene.on("pointerdown", newPack.animate, newPack);

  app.stage.addChild(scene);
  app.ticker.add(() => {
    newPack.eating();
  });

  // const packman: Graphics = new Graphics()
  //   .arc(0, 0, 50, degInRad(30), degInRad(320))
  //   .stroke({
  //     width: 100,
  //     color: 0xffff00,
  //   })
  //   .circle(-30, -30, 20)
  //   .fill({ color: 0x000000 })
  //   .cut();
  // packman.position.set(app.screen.width / 2, app.screen.height / 2);
  // app.stage.addChild(packman);

  // let rotate: number = 0;
  // const currentPoint: Point = new Point();
  // const pointToMove: Point = new Point();
  // const packmanStates: number[] = [];
  // window.addEventListener("click", move);

  // function move(e: MouseEvent) {
  //   const catetX = e.clientX - packman.x;
  //   const catetY = e.clientY - packman.y;
  //   const corner = Math.floor(
  //     (Math.asin(
  //       catetY / Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
  //     ) *
  //       180) /
  //       Math.PI,
  //   );
  //   if (catetX > 0) {
  //     rotate = 360 + corner > 360 ? 0 + corner : 360 + corner;
  //   } else {
  //     rotate = 180 - corner;
  //   }
  //   if (rotate == 360) {
  //     rotate = 0;
  //   }
  //   pointToMove.x = e.clientX;
  //   pointToMove.y = e.clientY;
  //   currentPoint.x = packman.x;
  //   currentPoint.y = packman.y;
  //   packmanStates.push(STATES.rotation);
  //   packmanStates.push(STATES.move);
  //   packmanStates.push(STATES.idle);
  //   window.removeEventListener("click", move);
  // }

  // let counter: number = 0;
  // app.ticker.add(() => {
  //   newPack.eating();
  //   if (counter > 100000) {
  //     counter = 0;
  //   } else {
  //     counter += 0.1;
  //   }

  //   packman
  //     .clear()
  //     .arc(
  //       0,
  //       0,
  //       50,
  //       degInRad(30 - Math.abs(Math.sin(counter) * 30)),
  //       degInRad(320 + Math.abs(Math.sin(counter) * 30)),
  //     )
  //     .stroke({
  //       width: 100,
  //       color: 0xffff00,
  //     })
  //     .circle(-30, -30, 20)
  //     .fill({ color: 0x000000 })
  //     .cut();

  //   if (packmanStates.length > 0) {
  //     switch (packmanStates[0]) {
  //       case STATES.idle: {
  //         window.addEventListener("click", move);
  //         packmanStates.shift();
  //         break;
  //       }
  //       case STATES.move: {
  //         const stepX: number = currentPoint.x > pointToMove.x ? -1 : 1;
  //         currentPoint.x += stepX;
  //         const stepY: number = currentPoint.y > pointToMove.y ? -1 : 1;
  //         currentPoint.y += stepY;
  //         if (currentPoint.x != pointToMove.x) {
  //           packman.position.set(currentPoint.x, packman.position.y);
  //         }
  //         if (currentPoint.y != pointToMove.y) {
  //           packman.position.set(packman.position.x, currentPoint.y);
  //         }
  //         if (
  //           packman.position.x + 10 > pointToMove.x &&
  //           packman.position.x - 10 < pointToMove.x &&
  //           packman.position.y + 10 > pointToMove.y &&
  //           packman.position.y - 10 < pointToMove.y
  //         ) {
  //           packmanStates.shift();
  //         }
  //         break;
  //       }
  //       case STATES.rotation: {
  //         const deg: number = (packman.rotation * 180) / Math.PI;
  //         if (deg > rotate) {
  //           packman.rotation = degInRad(deg - 1);
  //         }
  //         if (deg < rotate) {
  //           packman.rotation = degInRad(deg + 1);
  //         }
  //         if (deg + 1 > rotate && deg - 1 < rotate) {
  //           packmanStates.shift();
  //         }
  //       }
  //     }
  //   }
  // });
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
