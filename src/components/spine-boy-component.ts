import { Container } from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Emitter } from "../core/event-emitter/event-emitter";
import { SpineBoyMoveEvent } from "../core/event-emitter/custom-events/spine-boy-move-event";
import { SpineBoyIdleEvent } from "../core/event-emitter/custom-events/spine-boy-idle-event";

export class SpineBoy {
  public view!: Container;
  public directionalView!: Container;
  public spine!: Spine;
  public nextX: number = 50;
  public nextY: number = 75;
  constructor() {
    this.view = new Container();
    this.directionalView = new Container();
    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });

    this.directionalView.addChild(this.spine);
    this.view.addChild(this.directionalView);
    Emitter().addListener(SpineBoyMoveEvent.NAME, (e: SpineBoyMoveEvent) => {
      this.nextX = e.data.x;
      this.nextY = e.data.y;
      this.spine.state.setAnimation(0, "walk", true);
      this.directionalView.scale.x = this.nextX < this.view.x ? -1 : 1;
    });
    Emitter().addListener(SpineBoyIdleEvent.NAME, () => {
      this.spine.state.setAnimation(0, "idle", true);
    });
  }

  spawn() {
    this.spine.state.setAnimation(0, "portal");
  }
}
