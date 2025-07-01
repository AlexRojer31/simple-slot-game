import { Container } from "pixi.js";
import { StarComponent } from "../components/star-component";
import { PackmanComponent } from "../components/packman-component";
import { app } from "../app";

export class PackmanEaterScene extends Container {
  private stars: StarComponent[] = [];
  private packman!: PackmanComponent;

  constructor() {
    super();
    this.eventMode = "static";
    this.hitArea = app().screen;

    this.generateStars();
    this.generatePackman();

    app().ticker.add(() => {
      this.animate();
    });
  }

  private generatePackman(): void {
    this.packman = new PackmanComponent({
      x: app().screen.width / 2,
      y: app().screen.height / 2,
      width: 50,
      height: 50,
    });
    this.addChild(this.packman);
  }

  private generateStars(): void {
    const starCount = 30;
    for (let index = 0; index < starCount; index++) {
      const x =
        (index * Math.random() * app().screen.width) % app().screen.width;
      const y =
        (index * Math.random() * app().screen.height) % app().screen.height;
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
