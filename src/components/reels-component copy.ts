import { Container } from "pixi.js";
import { ReelComponent } from "./reel-component";

export class ReelsComponent extends Container {
  private padding: number = 30;
  private reelss: ReelComponent[] = [];

  private reel1!: ReelComponent;
  private reel2!: ReelComponent;
  private reel3!: ReelComponent;
  private reelWidth!: number;

  constructor() {
    super();

    this.reel1 = new ReelComponent();
    this.reelss.push(this.reel1);
    this.reelWidth = this.reel1.width;

    this.reel2 = new ReelComponent();
    this.reelss.push(this.reel2);
    this.reel2.position.x = this.reelWidth + this.padding;

    this.reel3 = new ReelComponent();
    this.reelss.push(this.reel3);
    this.reel3.position.x = 2 * (this.reelWidth + this.padding);

    this.addChild(...this.reelss);
  }
}
