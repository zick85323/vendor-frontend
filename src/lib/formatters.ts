import { CoinType } from "@/types/coin-exchange";

/**
 * Format a number as currency with proper thousand separators
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  });

  return formatter.format(amount);
}

/**
 * Format a coin amount with the appropriate precision for each coin type
 * and thousand separators
 */
export function formatCoinAmount(amount: number, coinType: CoinType): string {
  const precision =
    {
      BTC: 8,
      ETH: 6,
      USDT: 2,
    }[coinType] || 2;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
    useGrouping: true, // Enables thousand separators
  });

  return `${formatter.format(amount)} ${coinType}`;
}

/**
 * Format a date string in a consistent format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Format a time duration in HH:MM:SS format
 */
export function formatDuration(
  hours: number,
  minutes: number,
  seconds: number,
): string {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Validate a number is within a specified range
 */
export function validateNumberInRange(
  value: number,
  min: number,
  max: number,
): boolean {
  return value >= min && value <= max;
}
