import { ChangeBetEvent } from "../core/event-emitter/custom-events/change-bet-event";
import { Emitter } from "../core/event-emitter/event-emitter";

export class GameModel {
  public balance: number = Math.floor(Math.random() * 10000);
  public bets: number[] = [1, 2, 5, 10, 20, 50, 10];
  public currentBetIndex: number = 0;

  constructor() {
    this.subscribes();
  }

  private subscribes(): void {
    Emitter().addListener(ChangeBetEvent.NAME, (e: ChangeBetEvent) => {
      if (e.data.isUp) {
        if (this.currentBetIndex == this.bets.length - 1) {
          this.currentBetIndex = 0;
        } else {
          this.currentBetIndex++;
        }
      } else {
        if (this.currentBetIndex == 0) {
          this.currentBetIndex = this.bets.length - 1;
        } else {
          this.currentBetIndex--;
        }
      }

      console.log(this.currentBetIndex);
    });
  }
}
