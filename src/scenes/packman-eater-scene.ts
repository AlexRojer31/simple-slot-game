import { Container, Text, Ticker } from "pixi.js";
import { StarComponent } from "../components/star-component";
import { PackmanComponent } from "../components/packman-component";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { Emitter } from "../core/event-emitter/event-emitter";
import { SetSceneEvent } from "../core/event-emitter/custom-events/set-scene-event";
import { LoadBandleEvent } from "../core/event-emitter/custom-events/load-bundle-event";
import { BandleLoadedEvent } from "../core/event-emitter/custom-events/bandle-loaded-event";

export class PackmanEaterScene extends Container implements IScene {
  private stars: StarComponent[] = [];
  private packman!: PackmanComponent;
  private loaderMsg!: Text;
  private ticker: Ticker = new Ticker();

  constructor() {
    super();
    Emitter().emit(
      LoadBandleEvent.NAME,
      new LoadBandleEvent({ bandleName: "backgrounds" }),
    );
    this.subscribes();
    this.eventMode = "static";
    this.hitArea = app().screen;

    this.generateStars();
    this.generatePackman();
    this.generatePreloadText();

    this.ticker.add(() => {
      this.animate();
    });
  }

  load(): void {
    app().stage.addChild(this);
    this.visible = true;
    this.ticker.start();
  }

  unload(): void {
    app().stage.removeChild(this);
    this.visible = false;
    this.ticker.stop();
  }

  private subscribes(): void {
    Emitter().addListener(BandleLoadedEvent.NAME, (e: BandleLoadedEvent) => {
      if (e.data.bandleName == "backgrounds") {
        setTimeout(() => {
          this.removeChild(this.loaderMsg);
          const loadedMessage = new Text({
            text: "Наелись? Погнали!",
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
          loadedMessage.cursor = "pointer";
          loadedMessage.on("pointertap", () => {
            Emitter().emit(
              SetSceneEvent.NAME,
              new SetSceneEvent({ sceneName: "LoadScene" }),
            );
          });
          this.addChild(loadedMessage);
        }, 0);
      }
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

  private generatePreloadText(): void {
    this.loaderMsg = new Text({
      text: "Пока мы загружаемся, отведайте звезды...",
      style: {
        fill: "#ffffff",
        fontSize: 36,
        fontFamily: "MyFont",
        wordWrap: true,
        wordWrapWidth: 220,
        align: "center",
      },
      anchor: 0.5,
      x: app().screen.width / 2,
      y: 100,
    });
    this.addChild(this.loaderMsg);
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
