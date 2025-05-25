import React from "react";
import { Transaction, Platform, CoinType } from "@/types/coin-exchange";
import { formatCurrency, formatCoinAmount } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: Transaction[];
  selectedPlatform: Platform;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  selectedPlatform,
}) => {
  // Filter transactions based on selected platform
  const filteredTransactions =
    selectedPlatform === "All Platform"
      ? transactions
      : transactions.filter((t) => t.platform === selectedPlatform);

  const getPlatformStyles = (platform: Platform) => {
    switch (platform) {
      case "Binance":
        return "bg-yellow-100 text-yellow-800";
      case "Paxful":
        return "bg-blue-100 text-blue-800";
      case "Noones":
        return "bg-purple-100 text-purple-800";
      case "Bybit":
        return "bg-indigo-100 text-indigo-800";
      case "KuCoin":
        return "bg-green-100 text-green-800";
      case "Other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusStyles = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      <div className="border rounded-t-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-white border-b text-sm text-zinc-500 font-medium p-4">
          <div>Date</div>
          <div>Platform</div>
          <div>Coin</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Value (₦)</div>
          <div>Status</div>
        </div>

        {/* Table Body */}
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-7 bg-white border-b p-4 text-sm"
            >
              <div>{transaction.date}</div>
              <div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    getPlatformStyles(transaction.platform),
                  )}
                >
                  {transaction.platform}
                </span>
              </div>
              <div>{transaction.coin}</div>
              <div
                className={
                  transaction.type === "Buy" ? "text-green-600" : "text-red-600"
                }
              >
                {transaction.type}
              </div>
              <div>
                {formatCoinAmount(transaction.amount, transaction.coin)}
              </div>
              <div>{formatCurrency(transaction.value, "NGN")}</div>
              <div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    getStatusStyles(transaction.status),
                  )}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
