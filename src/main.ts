import { Run } from "./app";

Run().catch((e) => console.log(e));

// async function testLoads(app: Application): Promise<void> {
//   const texturesAssets = await Assets.loadBundle("textures");
//   const snow: Sprite = Sprite.from(texturesAssets.water.textures.ice);
//   snow.position.set(300, 0);
//   snow.texture = texturesAssets.earth.textures.lava;
//   app.stage.addChild(snow);
// }
