import { StopReelsEvent } from "./event-emitter/custom-events/stop-reels-event";

interface ISlotResult {
  requiredSymbols: number[];
  isWin: boolean;
}

class ResultFetchManager {
  private results: ISlotResult[] = [
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
    {
      requiredSymbols: [1, 0, 4, 5, 3, 5],
      isWin: false,
    },
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
    {
      requiredSymbols: [3, 3, 2, 5, 4, 1],
      isWin: false,
    },
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
    {
      requiredSymbols: [1, 3, 5, 2, 4, 5],
      isWin: false,
    },
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
    {
      requiredSymbols: [3, 1, 3, 2, 1, 5],
      isWin: false,
    },
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
    {
      requiredSymbols: [0, 1, 2, 3, 4, 5],
      isWin: true,
    },
  ];

  public async getResult(): Promise<StopReelsEvent> {
    return new StopReelsEvent(this.results[Math.floor(Math.random() * 10) + 1]);
  }
}

export function resultFetchManager(): ResultFetchManager {
  return new ResultFetchManager();
}
