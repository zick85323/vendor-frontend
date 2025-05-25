export type Platform =
  | "All Platform"
  | "Binance"
  | "Paxful"
  | "Noones"
  | "Bybit"
  | "KuCoin"
  | "Other";

export type CoinType = "BTC" | "USDT" | "ETH";

export type TransactionType = "Buy" | "Sell";

export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface CoinBalance {
  type: CoinType;
  balance: number;
  currentRate: number;
  excessCoin: number;
  change: {
    percentage: number;
    isPositive: boolean;
  };
}

export interface Transaction {
  id: string;
  date: string;
  platform: Platform;
  coin: CoinType;
  type: TransactionType;
  amount: number;
  value: number;
  status: TransactionStatus;
}

export type RefreshInterval =
  | "Refresh Now"
  | "Every 1 minute"
  | "Every 3 minutes"
  | "Every 5 minutes"
  | "Every 10 minutes";

export interface ExchangeFormData {
  fromCoin: CoinType | "";
  toCoin: CoinType | "";
  amount: number;
  useMarketRate: boolean;
  manualRate?: number;
}
