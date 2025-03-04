export interface SwapRateResult {
  receivedAmount: number;
  fee: {
    asset: string;
    amount: number;
    usd: number;
  };
  rateUsed: number;
}