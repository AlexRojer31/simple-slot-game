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
import { SpineBoyMoveEvent } from "../core/event-emitter/custom-events/spine-boy-move-event";
import { SpineBoyIdleEvent } from "../core/event-emitter/custom-events/spine-boy-idle-event";
import { SetSceneEvent } from "../core/event-emitter/custom-events/set-scene-event";

enum SPINE_STATE {
  idle = 0,
  move,
}
export class LoadScene extends Container implements IScene {
  private planet!: Sprite;
  private moon!: Sprite;
  private custle!: Sprite;
  private animateCustle: boolean = false;
  private animateCustleSteps: number = 0.4;
  private animateCustleDirection: number = 1;
  private ticker: Ticker = new Ticker();
  private movePlanet: boolean = false;
  private spineBoyState: number = SPINE_STATE.idle;
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

    this.custle = Sprite.from("custle");
    this.custle.anchor.set(0.5);
    this.custle.scale.set(0.4);
    this.custle.position.set(200, 300);
    this.custle.zIndex = 100;
    this.custle.visible = false;
    this.addChild(this.custle);

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
      if (e.data.bandleName == "common") {
        setTimeout(() => {
          this.animateCustle = true;

          // this.custle.tint = "red";
          // this.custle.cursor = "pointer";
          // this.custle.eventMode = "static";
          // this.custle.addEventListener("pointertap", () => {
          //   Emitter().emit(
          //     SetSceneEvent.NAME,
          //     new SetSceneEvent({ sceneName: "SlotScene" }),
          //   );
          // });
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

    Emitter().addListener(SpineBoyIdleEvent.NAME, () => {
      const catetX = this.custle.x + 50 - this.spineBoy.view.x;
      const catetY = this.custle.y - (this.spineBoy.view.y - 30);
      const range = Math.round(
        Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
      );
      if (range < 100) {
        this.custle.tint = "red";
        this.custle.cursor = "pointer";
        this.custle.eventMode = "static";
        this.custle.addEventListener("pointertap", () => {
          Emitter().emit(
            SetSceneEvent.NAME,
            new SetSceneEvent({ sceneName: "SlotScene" }),
          );
        });
      }
    });
  }

  private async generateSpineBoy(): Promise<void> {
    this.spineBoy = new SpineBoy();
    this.spineBoy.view.x = 50;
    this.spineBoy.view.y = 75;
    this.spineBoy.view.height = 90;
    this.spineBoy.view.width = 70;
    this.spineBoy.view.zIndex = 100;

    this.spineBoy.view.visible = false;
    this.addChild(this.spineBoy.view);
  }

  private animate(ticker: Ticker): void {
    this.moon.rotation += ticker.deltaTime / 180;

    if (this.spineBoyState == SPINE_STATE.move) {
      const stepX: number =
        this.spineBoy.view.x > this.spineBoy.nextX! ? -1 : 1;
      this.spineBoy.view.x += stepX;
      const stepY: number =
        this.spineBoy.view.y > this.spineBoy.nextY! ? -1 : 1;
      this.spineBoy.view.y += stepY;
      if (this.spineBoy.view.x != this.spineBoy.nextX) {
        this.spineBoy.view.position.set(
          this.spineBoy.view.x,
          this.spineBoy.view.position.y,
        );
      }
      if (this.spineBoy.view.y != this.spineBoy.nextY) {
        this.spineBoy.view.position.set(
          this.spineBoy.view.position.x,
          this.spineBoy.view.y,
        );
      }
      if (
        this.spineBoy.view.x + 5 > this.spineBoy.nextX &&
        this.spineBoy.view.x - 5 < this.spineBoy.nextX &&
        this.spineBoy.view.y + 5 > this.spineBoy.nextY &&
        this.spineBoy.view.y - 5 < this.spineBoy.nextY
      ) {
        Emitter().emit(
          SpineBoyIdleEvent.NAME,
          new SpineBoyIdleEvent({
            x: 0,
            y: 0,
          }),
        );
        this.spineBoyState = SPINE_STATE.idle;
      }
    }

    if (this.animateCustle) {
      if (this.animateCustleDirection > 0) {
        this.custle.scale.set(
          (this.animateCustleSteps += ticker.deltaTime / 1000),
        );
      }
      if (this.animateCustleDirection < 1) {
        this.custle.scale.set(
          (this.animateCustleSteps -= ticker.deltaTime / 1000),
        );
      }
      if (this.animateCustleSteps > 0.43) {
        this.animateCustleDirection = 0;
      }
      if (this.animateCustleSteps < 0.37) {
        this.animateCustleDirection = 1;
      }
    }

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
          this.spineBoy.spawn();
        }
      }
      // if (this.spineLoadCounter == 2) {
      //   this.removeChild(this.loadedMessage);
      //   this.generateHexField();
      //   this.movePlanet = false;
      //   this.spineBoy.view.visible = true;
      //   this.spineBoy.spawn();
      // }
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
    this.custle.visible = true;
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

    hexContainer.eventMode = "static";
    hexContainer.addEventListener("pointertap", () => {
      const catetX = hex.x + 50 - this.spineBoy.view.x;
      const catetY = hex.y - (this.spineBoy.view.y - 30);
      const range = Math.round(
        Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
      );
      if (50 < range && range < 100) {
        Emitter().emit(
          SpineBoyMoveEvent.NAME,
          new SpineBoyMoveEvent({
            x: hex.x + 50,
            y: hex.y + 30,
          }),
        );
        this.spineBoyState = SPINE_STATE.move;
      }
    });
    hexContainer.addEventListener("pointermove", () => {
      const catetX = hex.x + 50 - this.spineBoy.view.x;
      const catetY = hex.y - (this.spineBoy.view.y - 30);
      const range = Math.round(
        Math.sqrt(Math.pow(catetX, 2) + Math.pow(catetY, 2)),
      );
      if (50 < range && range < 100) {
        hexContainer.cursor = "pointer";
        hexContainer.alpha = 0.7;
      }
    });
    hexContainer.addEventListener("pointerout", () => {
      hexContainer.cursor = "auto";
      hexContainer.alpha = 1;
    });
    sprite.mask = hex;
    hexContainer.addChild(sprite, hex);
    hex.position.set(x, y);
    sprite.position.set(x, y - 45);
    this.addChild(hexContainer);
  }
}
