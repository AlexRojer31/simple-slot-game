import { Container } from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

// Class for handling the character Spine and its animations.
export class SpineBoy {
  public view!: Container;
  public spine!: Spine;
  constructor() {
    this.view = new Container();
    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });

    this.view.addChild(this.spine);
  }
}
