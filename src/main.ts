import { PackmanEaterScene } from "./scenes/packman-eater-scene";
import { Run } from "./app";
import { LoadScene } from "./scenes/load-scene";

(async () => {
  await Run();

  new PackmanEaterScene();
  new LoadScene();
})();

// async function testLoads(app: Application): Promise<void> {
//   const texturesAssets = await Assets.loadBundle("textures");
//   const snow: Sprite = Sprite.from(texturesAssets.water.textures.ice);
//   snow.position.set(300, 0);
//   snow.texture = texturesAssets.earth.textures.lava;
//   app.stage.addChild(snow);
// }
