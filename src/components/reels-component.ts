import { Container } from "pixi.js";
import { ReelComponent } from "./reel-component";

export class ReelsComponent extends Container {
  private padding: number = 30;
  private reels: ReelComponent[] = [];

  private reelWidth!: number;

  constructor() {
    super();

    this.generateReels(6);
    this.addChild(...this.reels);
  }

  private generateReels(count: number): void {
    for (let i: number = 0; i < count; i++) {
      const reel = new ReelComponent(i, i, 4);
      this.reels.push(reel);
      this.reelWidth = reel.width;
      reel.position.x = (this.reelWidth + this.padding) * i;
    }
  }

  public animate(): void {
    this.reels.forEach((r: ReelComponent) => r.animate());
  }
}
