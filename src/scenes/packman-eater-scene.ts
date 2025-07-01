import { Application, Container } from "pixi.js";
import { StarComponent } from "../components/star-component";
import { PackmanComponent } from "../components/packman-component";

export class PackmanEaterScene extends Container {
  private stars: StarComponent[] = [];
  private packman!: PackmanComponent;
  private app!: Application;

  constructor(app: Application) {
    super();
    this.app = app;
    this.eventMode = "static";
    this.hitArea = app.screen;

    this.generateStars();
    this.generatePackman();

    this.app.ticker.add(() => {
      this.animate();
    });
  }

  private generatePackman(): void {
    this.packman = new PackmanComponent({
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
      width: 50,
      height: 50,
    });
    this.addChild(this.packman);
  }

  private generateStars(): void {
    const starCount = 30;
    for (let index = 0; index < starCount; index++) {
      const x =
        (index * Math.random() * this.app.screen.width) % this.app.screen.width;
      const y =
        (index * Math.random() * this.app.screen.height) %
        this.app.screen.height;
      const star = new StarComponent(x, y);
      this.stars.push(star);
      this.addChild(star);
    }
  }

  private animate(): void {
    this.packman.eating();
    this.packman.mooving();
    this.stars.forEach((s: StarComponent) => {
      if (this.packman.contains(s.getStarX(), s.getStarY())) {
        s.destroyStar();
      }
    });
  }
}
