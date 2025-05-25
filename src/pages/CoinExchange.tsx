import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Header from "@/components/coin-exchange/Header";
import SearchBar from "@/components/coin-exchange/SearchBar";
import ClockInOut from "@/components/coin-exchange/ClockInOut";
import PlatformTabs from "@/components/coin-exchange/PlatformTabs";
import CoinBalanceCard from "@/components/coin-exchange/CoinBalanceCard";
import AddNewCoinCard from "@/components/coin-exchange/AddNewCoinCard";
import RefreshDropdown from "@/components/coin-exchange/RefreshDropdown";
import TransactionHistory from "@/components/coin-exchange/TransactionHistory";
import ExchangeCoinModal from "@/components/coin-exchange/ExchangeCoinModal";
import LoadingOverlay from "@/components/coin-exchange/LoadingOverlay";
import {
  Platform,
  CoinBalance,
  Transaction,
  RefreshInterval,
  ExchangeFormData,
} from "@/types/coin-exchange";

// Mock data for initial state
const initialCoinBalances: CoinBalance[] = [
  {
    type: "BTC",
    balance: 0.45,
    currentRate: 62500,
    excessCoin: 0.2,
    change: { percentage: 2.3, isPositive: true },
  },
  {
    type: "USDT",
    balance: 1250.75,
    currentRate: 1.0,
    excessCoin: 500.0,
    change: { percentage: 0.01, isPositive: true },
  },
  {
    type: "ETH",
    balance: 3.2,
    currentRate: 3450.0,
    excessCoin: 1.5,
    change: { percentage: 1.2, isPositive: false },
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-05-12 14:30",
    platform: "Binance",
    coin: "BTC",
    type: "Buy",
    amount: 0.05,
    value: 1850000,
    status: "Completed",
  },
  {
    id: "2",
    date: "2025-05-09 09:15",
    platform: "Paxful",
    coin: "BTC",
    type: "Sell",
    amount: 0.02,
    value: 740000,
    status: "Completed",
  },
  {
    id: "3",
    date: "2025-05-05 16:45",
    platform: "Binance",
    coin: "ETH",
    type: "Buy",
    amount: 1.5,
    value: 3150000,
    status: "Completed",
  },
  {
    id: "4",
    date: "2025-05-05 11:20",
    platform: "KuCoin",
    coin: "USDT",
    type: "Buy",
    amount: 500,
    value: 500000,
    status: "Pending",
  },
  {
    id: "5",
    date: "2025-05-14 13:10",
    platform: "Paxful",
    coin: "BTC",
    type: "Sell",
    amount: 0.03,
    value: 1110000,
    status: "Failed",
  },
];

const CoinExchange: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("All Platform");
  const [coinBalances, setCoinBalances] =
    useState<CoinBalance[]>(initialCoinBalances);
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinBalance | undefined>(
    undefined,
  );
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [isClockActive, setIsClockActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle refresh data
  const refreshData = useCallback(async () => {
    // This would typically be an API call
    console.log("Refreshing data...");
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: slightly modify the data to simulate fresh data
      setCoinBalances((prev) =>
        prev.map((coin) => ({
          ...coin,
          currentRate: coin.currentRate * (1 + (Math.random() * 0.02 - 0.01)),
          change: {
            percentage: Math.random() * 3,
            isPositive: Math.random() > 0.3,
          },
        })),
      );
    } finally {
      // Add a small delay before hiding the loader for better UX
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsLoading(false);
    }

    return Promise.resolve();
  }, []);

  // Handle interval selection
  const handleSelectInterval = useCallback(
    (interval: RefreshInterval) => {
      // Clear any existing interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }

      // If not just refreshing now, set a new interval
      if (interval !== "Refresh Now") {
        const minutes = parseInt(interval.split(" ")[1]);
        const milliseconds = minutes * 60 * 1000;

        const newInterval = setInterval(() => {
          refreshData();
        }, milliseconds);

        setRefreshInterval(newInterval);
      }
    },
    [refreshData, refreshInterval],
  );

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const handleExchangeCoin = (coin: CoinBalance) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleAddNewCoin = () => {
    // For a real app, this would open a modal to add a new coin
    console.log("Add new coin clicked");
  };

  const handleExecuteTrade = async (formData: ExchangeFormData) => {
    console.log("Executing trade:", formData);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update balances (simplified for demo)
      setCoinBalances((prev) =>
        prev.map((coin) => {
          if (coin.type === formData.fromCoin) {
            return {
              ...coin,
              balance: coin.balance - formData.amount,
              excessCoin: Math.max(0, coin.excessCoin - formData.amount),
            };
          }
          return coin;
        }),
      );

      // Add new transaction (simplified for demo)
      const newTransaction: Transaction = {
        id: (transactions.length + 1).toString(),
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        platform: "Binance", // Would come from form in real app
        coin: formData.fromCoin as "BTC" | "USDT" | "ETH",
        type: "Sell",
        amount: formData.amount,
        value:
          formData.amount *
          (formData.useMarketRate
            ? coinBalances.find((c) => c.type === formData.fromCoin)
                ?.currentRate || 0
            : formData.manualRate || 0) *
          1000, // Converting to NGN for demo
        status: "Completed",
      };

      setTransactions((prev) => [newTransaction, ...prev]);
    } finally {
      setIsLoading(false);
    }

    return Promise.resolve();
  };

  const [isClockedOut, setIsClockedOut] = useState(false);

  const handleClockOut = () => {
    setIsClockActive(false);
    setIsClockedOut(true);

    // In a real app, this would make an API call to log the work time
    const logoutData = {
      timestamp: new Date().toISOString(),
      sessionComplete: true,
      // You would include the actual session duration from the timer
    };

    console.log("Clocking out...", logoutData);
  };

  const handleClockIn = () => {
    setIsClockActive(true);
    setIsClockedOut(false);

    // In a real app, this would make an API call to start a new session
    const loginData = {
      timestamp: new Date().toISOString(),
      sessionStart: true,
    };

    console.log("Clocking in...", loginData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userName="Alex Johnson" role="Admin" />

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} message="Refreshing data..." />

      <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search..."
        />

        {/* User Info and Clock */}
        <div className="flex justify-between items-center mt-4">
          <ClockInOut
            isActive={isClockActive}
            onClockOut={handleClockOut}
            onClockIn={handleClockIn}
          />

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium">Alex Johnson</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mt-4 text-gray-900">
          Coin Exchange
        </h1>

        {/* Platform Tabs */}
        <div className="mt-6">
          <PlatformTabs
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
          />
        </div>

        {/* Coin Balances Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Coin Balances</h2>
            <div className="flex gap-2">
              <RefreshDropdown
                onRefresh={refreshData}
                onSelectInterval={handleSelectInterval}
              />
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          {/* Coin Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {coinBalances.map((coin) => (
              <CoinBalanceCard
                key={coin.type}
                coin={coin}
                onExchangeCoin={handleExchangeCoin}
              />
            ))}
            <AddNewCoinCard onClick={handleAddNewCoin} />
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-6">
          <TransactionHistory
            transactions={transactions}
            selectedPlatform={selectedPlatform}
          />
        </div>

        {/* Exchange Coin Form */}
        <div className="mt-6 mb-12">
          <h2 className="text-xl font-semibold text-black mb-6">
            Exchange Coin
          </h2>
          <Card className="p-4">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    From Coin
                  </label>
                  <div className="flex justify-between items-center border rounded-lg p-3 bg-white">
                    <span className="text-gray-700">Select coin</span>
                    <svg
                      width="12"
                      height="6"
                      viewBox="0 0 12 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L6 5L11 1"
                        stroke="#71717A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 bg-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rate Option
                </label>
                <div className="flex justify-between items-center border rounded-lg p-3 bg-white">
                  <span className="rate-market text-amber-600 font-medium">
                    Market Rate
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const toggle =
                        e.currentTarget.querySelector(".toggle-knob");
                      const isActive =
                        toggle?.classList.contains("translate-x-3");

                      if (toggle) {
                        if (isActive) {
                          toggle.classList.remove("translate-x-3");
                          toggle.classList.add("translate-x-0");
                          e.currentTarget
                            .querySelector(".toggle-bg")
                            ?.classList.remove("bg-gray-300");
                          e.currentTarget
                            .querySelector(".toggle-bg")
                            ?.classList.add("bg-amber-500");
                          e.currentTarget.parentElement
                            ?.querySelector(".rate-market")
                            ?.classList.add("text-amber-600", "font-medium");
                          e.currentTarget.parentElement
                            ?.querySelector(".rate-limit")
                            ?.classList.remove("text-amber-600", "font-medium");
                        } else {
                          toggle.classList.remove("translate-x-0");
                          toggle.classList.add("translate-x-3");
                          e.currentTarget
                            .querySelector(".toggle-bg")
                            ?.classList.remove("bg-amber-500");
                          e.currentTarget
                            .querySelector(".toggle-bg")
                            ?.classList.add("bg-gray-300");
                          e.currentTarget.parentElement
                            ?.querySelector(".rate-market")
                            ?.classList.remove("text-amber-600", "font-medium");
                          e.currentTarget.parentElement
                            ?.querySelector(".rate-limit")
                            ?.classList.add("text-amber-600", "font-medium");
                        }
                      }
                    }}
                    className="w-10 h-5 flex items-center bg-amber-500 rounded-full px-1 toggle-bg transition-colors duration-300"
                  >
                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md transform translate-x-0 transition-transform duration-300 toggle-knob"></div>
                  </button>
                  <span className="rate-limit">Limit</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  To Coin
                </label>
                <div className="flex justify-between items-center border rounded-lg p-3 bg-white">
                  <span className="text-gray-700">Select coin</span>
                  <svg
                    width="12"
                    height="6"
                    viewBox="0 0 12 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L6 5L11 1"
                      stroke="#71717A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Excess Coin
                </label>
                <div className="border rounded-lg p-3 bg-white">
                  Select a coin
                </div>
              </div>

              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                Execute Sell Trade
              </Button>
            </form>
          </Card>
        </div>

        {/* Exchange Coin Modal */}
        <ExchangeCoinModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCoin={selectedCoin}
          coinBalances={coinBalances}
          onExecuteTrade={handleExecuteTrade}
        />
      </main>
    </div>
  );
};

export default CoinExchange;
