import { BetChangedEvent } from "../core/event-emitter/custom-events/bet-changed-event";
import { ChangeBetEvent } from "../core/event-emitter/custom-events/change-bet-event";
import { RunReelsEvent } from "../core/event-emitter/custom-events/run-reels-event";
import { StopReelsEvent } from "../core/event-emitter/custom-events/stop-reels-event";
import { Emitter } from "../core/event-emitter/event-emitter";

export class GameModel {
  public balance: number = Math.floor(Math.random() * 10000);
  public bets: number[] = [1, 2, 5, 10, 20, 50, 100];
  public currentBetIndex: number = 0;

  public moneyTxt: string = "Money всего: ";
  public betTxt: string = "Куррент Bet: ";

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

      Emitter().emit(BetChangedEvent.NAME);
    });

    Emitter().addListener(RunReelsEvent.NAME, () => {
      this.balance -= this.bets[this.currentBetIndex];

      Emitter().emit(BetChangedEvent.NAME);
    });

    Emitter().addListener(StopReelsEvent.NAME, () => {
      if (Math.round(Math.random() * 10) > 7) {
        this.balance += this.bets[this.currentBetIndex] * 5;
      }

      Emitter().emit(BetChangedEvent.NAME);
    });
  }
}
