export interface ITickerTapeItem {
  ticker: string;
  changePercent: number;
  direction: "up" | "down" | "neutral";
}
