import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Spritesheet,
  Text,
  Ticker,
} from "pixi.js";
import { app } from "../app";
import { IScene } from "../core/scene-manager";
import { Emitter } from "../core/event-emitter/event-emitter";
import { LoadBandleEvent } from "../core/event-emitter/custom-events/load-bundle-event";
import { BandleLoadedEvent } from "../core/event-emitter/custom-events/bandle-loaded-event";

export class LoadScene extends Container implements IScene {
  private planet!: Sprite;
  private moon!: Sprite;
  private ticker: Ticker = new Ticker();
  private movePlanet: boolean = false;
  private loadedMessage!: Text;
  private planetScale: number = 1;

  constructor() {
    super();
    Emitter().emit(
      LoadBandleEvent.NAME,
      new LoadBandleEvent({ bandleName: "common" }),
    );
    Emitter().emit(
      LoadBandleEvent.NAME,
      new LoadBandleEvent({ bandleName: "textures" }),
    );
    this.subscribes();
    this.loadSecond();
    this.addChild(this.moon, this.planet);

    this.ticker.add((ticker: Ticker) => {
      this.animate(ticker);
    });
  }

  private loadSecond(): void {
    this.planet = Sprite.from("planet");
    this.planet.anchor.set(0.5);
    this.planet.position.set(app().screen.width / 2, app().screen.height / 2);

    this.moon = Sprite.from("moon");
    this.moon.tint = 0xff0000;
    this.moon.rotation = 2;
    this.moon.anchor.set(0.5);
    this.moon.position.set(100, 100);

    this.loadedMessage = new Text({
      text: "До слота еще надо добраться...",
      style: {
        fill: "#ffffff",
        fontSize: 36,
        fontFamily: "MyFont",
        wordWrap: true,
        wordWrapWidth: 220,
      },
      x: app().screen.width - 230,
      y: 20,
    });
    this.loadedMessage.zIndex = 100;
    this.addChild(this.loadedMessage);
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
      if (e.data.bandleName == "textures") {
        setTimeout(() => {
          this.movePlanet = true;
        }, 3000);
      }
    });
  }

  private animate(ticker: Ticker): void {
    this.moon.rotation += ticker.deltaTime / 180;

    if (this.movePlanet) {
      this.planet.scale.set((this.planetScale += ticker.deltaTime / 200));
      console.log(this.planetScale);
      if (this.planetScale > 1.5) {
        this.removeChild(this.loadedMessage);
      }
      if (this.planetScale > 4) {
        this.movePlanet = false;
        this.generateHexField();
      }
    }
  }

  private async generateHexField(): Promise<void> {
    this.getHex(50, app().screen.height - 45, "earth", "sand");
    this.getHex(202, app().screen.height - 45, "earth", "sand");
    this.getHex(354, app().screen.height - 45, "earth", "dirt");

    this.getHex(126, app().screen.height - 90, "earth", "sand");
    this.getHex(278, app().screen.height - 90, "earth", "dirt");
    this.getHex(430, app().screen.height - 90, "earth", "lava");

    this.getHex(354, app().screen.height - 137, "earth", "lava");

    this.getHex(430, app().screen.height - 182, "earth", "road");

    this.getHex(430, app().screen.height - 274, "water", "swamp");

    this.getHex(508, app().screen.height - 318, "water", "sea");

    this.getHex(508, app().screen.height - 412, "earth", "grass");

    this.getHex(586, app().screen.height - 364, "earth", "foothills");

    this.getHex(586, app().screen.height - 458, "earth", "snow");
  }

  private async getHex(
    x: number,
    y: number,
    ground: string = "water",
    type: string = "ice",
  ): Promise<void> {
    const hexContainer = new Container();
    const sprite: Sprite = Sprite.from(
      Assets.get<Spritesheet>(ground).textures[type],
    );
    sprite.width = 100;
    sprite.height = 90;
    const hex: Graphics = new Graphics()
      .moveTo(0, 0)
      .lineTo(25, -45)
      .lineTo(75, -45)
      .lineTo(100, 0)
      .lineTo(75, 45)
      .lineTo(25, 45)
      .fill("green");

    sprite.mask = hex;
    hexContainer.addChild(sprite, hex);
    hex.position.set(x, y);
    sprite.position.set(x, y - 45);
    this.addChild(hexContainer);
  }
}
