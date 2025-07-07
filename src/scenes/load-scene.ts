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
import { LoadExternalBandleEvent } from "../core/event-emitter/custom-events/load-external-bundle-event";
import { SpineBoy } from "../components/spine-boy-component";

export class LoadScene extends Container implements IScene {
  private planet!: Sprite;
  private moon!: Sprite;
  private custle!: Sprite;
  private ticker: Ticker = new Ticker();
  private movePlanet: boolean = false;
  private loadedMessage!: Text;
  private planetScale: number = 1;
  private spineBoy!: SpineBoy;
  private spineLoadCounter: number = 0;

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
    Emitter().emit(
      LoadExternalBandleEvent.NAME,
      new LoadExternalBandleEvent({
        alias: "spineSkeleton",
        src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel",
      }),
    );
    Emitter().emit(
      LoadExternalBandleEvent.NAME,
      new LoadExternalBandleEvent({
        alias: "spineAtlas",
        src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas",
      }),
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
        }, 0);
      }
    });

    Emitter().addListener(BandleLoadedEvent.NAME, (e: BandleLoadedEvent) => {
      if (e.data.bandleName == "spineSkeleton") {
        this.spineLoadCounter++;
        if (this.spineLoadCounter == 2) {
          this.generateSpineBoy();
        }
      }
    });

    Emitter().addListener(BandleLoadedEvent.NAME, (e: BandleLoadedEvent) => {
      if (e.data.bandleName == "spineAtlas") {
        this.spineLoadCounter++;
        if (this.spineLoadCounter == 2) {
          this.generateSpineBoy();
        }
      }
    });
  }

  private async generateSpineBoy(): Promise<void> {
    this.spineBoy = new SpineBoy();
    this.spineBoy.view.x = 50;
    this.spineBoy.view.y = 70;
    this.spineBoy.spine.scale.set(0.1);
    this.spineBoy.view.zIndex = 100;

    this.spineBoy.view.visible = false;
    this.addChild(this.spineBoy.view);
  }

  private animate(ticker: Ticker): void {
    this.moon.rotation += ticker.deltaTime / 180;

    if (this.movePlanet) {
      this.planet.x -= ticker.deltaTime;
      this.planet.scale.set((this.planetScale += ticker.deltaTime / 200));
      if (this.planetScale > 1.5) {
        this.removeChild(this.loadedMessage);
      }
      if (this.planetScale > 4) {
        if (this.spineLoadCounter == 2) {
          this.generateHexField();
          this.movePlanet = false;
          this.spineBoy.view.visible = true;
        }
      }
    }
  }

  private async generateHexField(): Promise<void> {
    this.getHex(0, 45, "earth", "sand");
    this.getHex(152, 45, "earth", "sand");
    this.getHex(304, 45, "earth", "road");

    this.getHex(76, 90, "earth", "sand");
    this.getHex(228, 90, "earth", "road");
    this.getHex(380, 90, "earth", "road");

    this.getHex(152, 137, "earth", "dirt");
    this.getHex(304, 137, "earth", "lava");

    this.getHex(380, 182, "earth", "road");

    this.getHex(228, 274, "earth", "foothills");
    this.getHex(380, 274, "water", "swamp");

    this.getHex(304, 322, "earth", "grass");

    this.getHex(382, 365, "earth", "grass");

    this.getHex(228, 367, "earth", "foothills");

    this.getHex(306, 412, "earth", "grass");

    this.custle = Sprite.from("custle");
    this.custle.anchor.set(0.5);
    this.custle.scale.set(0.4);
    this.custle.position.set(200, 300);
    this.addChild(this.custle);
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
