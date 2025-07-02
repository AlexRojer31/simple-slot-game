import { Container, Text, Ticker } from "pixi.js";
import { StarComponent } from "../components/star-component";
import { PackmanComponent } from "../components/packman-component";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { Emitter } from "../core/event-emitter/event-emitter";
import { SetSceneEvent } from "../core/event-emitter/custom-events/set-scene-event";

export class PackmanEaterScene extends Container implements IScene {
  private stars: StarComponent[] = [];
  private packman!: PackmanComponent;
  private ticker: Ticker = new Ticker();

  constructor() {
    super();
    this.subscribes();
    this.eventMode = "static";
    this.hitArea = app().screen;

    this.generateStars();
    this.generatePackman();

    const loadedMessage = new Text({
      text: "Загрузить другую сцену",
      style: {
        fill: "#ffffff",
        fontSize: 36,
        fontFamily: "MyFont",
      },
      anchor: 0.5,
      x: app().screen.width / 2,
      y: 100,
    });
    loadedMessage.eventMode = "static";
    loadedMessage.on("pointertap", () => {
      Emitter().emit(
        SetSceneEvent.NAME,
        new SetSceneEvent({ sceneName: "LoadScene" }),
      );
    });
    this.addChild(loadedMessage);

    app().stage.addChild(this);

    this.ticker.add(() => {
      this.animate();
    });
  }

  load(): void {
    this.visible = true;
    this.ticker.start();
  }

  unload(): void {
    this.visible = false;
    this.ticker.stop();
  }

  private subscribes(): void {}

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
