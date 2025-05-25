import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CoinBalance } from "@/types/coin-exchange";
import CoinIcon from "./CoinIcon";
import { formatCurrency, formatCoinAmount } from "@/lib/formatters";

interface CoinBalanceCardProps {
  coin: CoinBalance;
  onExchangeCoin: (coin: CoinBalance) => void;
}

const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({
  coin,
  onExchangeCoin,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CoinIcon coin={coin.type} size={16} />
            <span className="font-bold text-base">{coin.type}</span>
          </div>
          <div
            className={`flex items-center text-sm ${coin.change.isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {coin.change.isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{coin.change.percentage.toFixed(1)}%</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-zinc-500">Balance</div>
          <div className="text-lg font-bold">
            {formatCoinAmount(coin.balance, coin.type)}
          </div>
        </div>

        <div>
          <div className="text-sm text-zinc-500">Current Rate</div>
          <div className="text-base font-medium">
            {formatCurrency(coin.currentRate, "USD")}
          </div>
        </div>

        <div className="text-sm text-amber-700 font-medium">
          Excess Coin: {formatCoinAmount(coin.excessCoin, coin.type)}
        </div>

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => onExchangeCoin(coin)}
        >
          Exchange Coin
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoinBalanceCard;
