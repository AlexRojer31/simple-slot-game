import { Container } from "pixi.js";
import { ReelComponent } from "./reel-component";

export class ReelsComponent extends Container {
  private padding: number = 30;
  private reelss: ReelComponent[] = [];

  private reelWidth!: number;

  constructor() {
    super();

    this.generateReels(4);
    this.addChild(...this.reelss);
  }

  private generateReels(count: number): void {
    for (let i: number = 0; i < count; i++) {
      const reel = new ReelComponent(i, 3);
      this.reelss.push(reel);
      this.reelWidth = reel.width;
      reel.position.x = (this.reelWidth + this.padding) * i;
    }
  }

  public animate(): void {
    this.reelss.forEach((r: ReelComponent) => r.animate());
  }
}
