"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Bell,
  ChevronDown,
  RefreshCw,
  Plus,
  Clock,
  Check,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { JSX } from "react/jsx-runtime"

// Types
type Coin = {
  id: string
  name: string
  symbol: string
  balance: number
  rate: number
  excessCoin: number
  change: number
  color: string
  icon: string
}

type Platform = "all" | "binance" | "payful" | "nexones" | "bybit" | "kucoin" | "other"

type TransactionStatus = "completed" | "pending" | "failed"

type Transaction = {
  id: string
  date: string
  time: string
  platform: Platform
  coin: string
  type: "buy" | "sell"
  amount: number
  value: number
  status: TransactionStatus
}

// Cryptocurrency Icons Component
const CryptoIcon = ({ symbol, className }: { symbol: string; className?: string }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    BTC: (
      <div className={`${className} bg-[#f7931a] rounded-full flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] fill-white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-1.135 2.784-2.806 3.092v.001l-.001.001c1.197.392 1.747 1.098 1.747 2.189 0 1.711-1.098 2.902-3.092 3.092v1.613h-1.613v-1.613h-1.306v1.613H8.884v-1.613H6.978v-1.306h.653c.392 0 .653-.261.653-.653V9.466c0-.392-.261-.653-.653-.653H6.978V7.507h1.906v-1.613h1.613v1.613h1.306v-1.613h1.613v1.613c1.994.19 3.092 1.381 3.092 3.092 0 .915-.392 1.711-1.135 2.189.915.392 1.381 1.197 1.381 2.189z" />
        </svg>
      </div>
    ),
    USDT: (
      <div className={`${className} bg-[#26A17B] rounded-full flex items-center justify-center`}>
        <svg viewBox="0 0 256 256" className="w-[12px] h-[12px] fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M128 0C57.308 0 0 57.308 0 128s57.308 128 128 128 128-57.308 128-128S198.692 0 128 0zm59.134 98.547v16.74c-13.287.6-27.414.946-42.053.982v35.187c-.043 5.867-7.742 10.614-17.283 10.614s-17.24-4.747-17.283-10.614v-35.18c-14.639-.037-28.766-.385-42.053-.985v-16.74c22.893.99 47.298 1.53 72.18 1.53s49.287-.54 72.18-1.53zM145.081 87.2v11.2h-34.16V87.2h34.16z" />
        </svg>
      </div>
    ),


    ETH: (
      <div className={`${className} bg-[#627eea] rounded-full flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] fill-white">
          <path d="M12 0L5.5 12.25L12 16.5L18.5 12.25L12 0ZM12 24L5.5 13.75L12 18L18.5 13.75L12 24Z" />
        </svg>
      </div>
    ),
  }

  return (
    iconMap[symbol] || (
      <div className={`${className} bg-gray-400 rounded-full flex items-center justify-center`}>
        <span className="text-white text-[10px] font-bold">{symbol[0]}</span>
      </div>
    )
  )
}

// Sample data
const coins: Coin[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    balance: 0.45,
    rate: 62500,
    excessCoin: 0.2,
    change: 2.3,
    color: "#f7931a",
    icon: "₿",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    balance: 1250.75,
    rate: 1,
    excessCoin: 500,
    change: 0.01,
    color: "#26a17b",
    icon: "₮",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: 3.2,
    rate: 3450,
    excessCoin: 1.5,
    change: 1.2,
    color: "#627eea",
    icon: "Ξ",
  },
]

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2025-05-12",
    time: "14:50",
    platform: "binance",
    coin: "BTC",
    type: "buy",
    amount: 0.05,
    value: 3350000,
    status: "completed",
  },
  {
    id: "2",
    date: "2025-05-09",
    time: "09:18",
    platform: "payful",
    coin: "BTC",
    type: "sell",
    amount: 0.02,
    value: 1120000,
    status: "completed",
  },
  {
    id: "3",
    date: "2025-05-08",
    time: "18:45",
    platform: "binance",
    coin: "ETH",
    type: "buy",
    amount: 1.0,
    value: 4150000,
    status: "completed",
  },
  {
    id: "4",
    date: "2025-05-05",
    time: "10:22",
    platform: "kucoin",
    coin: "USDT",
    type: "buy",
    amount: 500,
    value: 500000,
    status: "pending",
  },
  {
    id: "5",
    date: "2025-05-04",
    time: "13:10",
    platform: "payful",
    coin: "BTC",
    type: "sell",
    amount: 0.03,
    value: 1910000,
    status: "failed",
  },
]

const refreshIntervals = [
  { label: "Refresh Now", value: 0 },
  { label: "Every 1 min", value: 60000 },
  { label: "Every 3 min", value: 180000 },
  { label: "Every 5 min", value: 300000 },
  { label: "Every 10 min", value: 600000 },
]

export default function CryptoDashboard() {
  // State
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("all")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [capitalCoin, setCapitalCoin] = useState("")
  const [excessCoin, setExcessCoin] = useState(0)
  const [useMarketRate, setUseMarketRate] = useState(true)
  const [limitRate, setLimitRate] = useState("")
  const [clockedIn, setClockedIn] = useState(true)
  const [sessionTime, setSessionTime] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Filter transactions based on selected platform
  useEffect(() => {
    if (selectedPlatform === "all") {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter((t) => t.platform === selectedPlatform))
    }
  }, [selectedPlatform])

  // Handle refresh interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refreshData()
      }, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval])

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (clockedIn) {
      timer = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [clockedIn])

  // Format session time as HH:MM:SS
  const formatSessionTime = () => {
    const hours = Math.floor(sessionTime / 3600)
      .toString()
      .padStart(2, "0")
    const minutes = Math.floor((sessionTime % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const seconds = Math.floor(sessionTime % 60)
      .toString()
      .padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  // Refresh data
  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Handle coin exchange
  const handleExchangeCoin = (coin: Coin) => {
    setSelectedCoin(coin)
    setCapitalCoin(String(coin.balance - coin.excessCoin))
    setExcessCoin(coin.excessCoin)
    setExchangeModalOpen(true)
  }

  // Calculate excess coin based on capital input
  const calculateExcessCoin = (capital: string) => {
    if (!selectedCoin || capital === "") return 0

    const capitalValue = Number.parseFloat(capital)
    if (isNaN(capitalValue)) return 0

    return Math.max(0, selectedCoin.balance - capitalValue)
  }

  // Handle capital coin input change
  const handleCapitalCoinChange = (value: string) => {
    setCapitalCoin(value)
    setExcessCoin(calculateExcessCoin(value))
  }

  // Execute coin exchange
  const executeExchange = () => {
    // Simulate API call
    setTimeout(() => {
      setExchangeModalOpen(false)
    }, 500)
  }

  // Handle clock out
  const handleClockOut = () => {
    setClockedIn(false)
    // Simulate API call for attendance
    console.log("Clocked out after", formatSessionTime())
  }

  // Get platform badge color
  const getPlatformBadgeColor = (platform: Platform) => {
    switch (platform) {
      case "binance":
        return "bg-[#f0b90b]/20 text-[#f0b90b]"
      case "payful":
        return "bg-[#3b82f6]/20 text-[#3b82f6]"
      case "kucoin":
        return "bg-[#24d369]/20 text-[#24d369]"
      case "nexones":
        return "bg-[#8b5cf6]/20 text-[#8b5cf6]"
      case "bybit":
        return "bg-[#f7931a]/20 text-[#f7931a]"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Get status badge with icon
  const getStatusBadge = (status: TransactionStatus) => {
  const baseClass =
    "inline-flex items-center gap-[4px] text-[12px] px-[8px] py-[3px] rounded-full leading-none font-medium";

  switch (status) {
    case "completed":
      return (
        <span className={`${baseClass} bg-[#22c55e]/20 text-[#22c55e]`}>
          Completed
        </span>
      );
    case "pending":
      return (
        <span className={`${baseClass} bg-[#ca8a04]/20 text-[#ca8a04]`}>
          Pending
        </span>
      );
    case "failed":
      return (
        <span className={`${baseClass} bg-[#ef4444]/20 text-[#ef4444]`}>
          Failed
        </span>
      );
  }
};



  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#f6b10a] text-white h-[56px] px-[16px] flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-[24px] h-[24px] bg-white rounded-[4px] flex items-center justify-center mr-[8px]">
            <span className="text-[#f6b10a] font-bold text-[14px]">B</span>
          </div>
          <span className="font-bold text-[16px]">BIBUAIN</span>
        </div>
        <button className="text-white">
          <div className="space-y-[4px]">
            <div className="w-[20px] h-[2px] bg-white"></div>
            <div className="w-[20px] h-[2px] bg-white"></div>
            <div className="w-[20px] h-[2px] bg-white"></div>
          </div>
        </button>
      </header>

      {/* Search and User Info */}
      <div className="p-[16px] border-b border-[#e5e7eb]">
        <div className="relative mb-[16px]">
          <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-[16px] w-[16px]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[36px] pr-[12px] py-[8px] border border-[#e5e7eb] rounded-[4px] text-[14px]"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-[20px] h-[20px] mr-[8px]">
              <Clock className="h-[20px] w-[20px]" />
            </div>
            <span className="font-bold text-[14px]">{formatSessionTime()}</span>
            <span className="ml-[16px] text-[#6b7280] text-[14px]">{clockedIn ? "Break" : "Clocked Out"}</span>
          </div>

          <Button
            variant="outline"
            className="border-[#ff3b30] text-[#ff3b30] ml-[8px] text-[12px] px-[12px] py-[4px] h-[28px] rounded-[4px]"
            onClick={handleClockOut}
            disabled={!clockedIn}
          >
            Clock Out
          </Button>

<div className="flex items-center ml-auto">
  
  
  <div className="flex items-center gap-[8px]">
    {/* Avatar */}
    <div className="w-[32px] h-[32px] bg-[#f3f4f6] rounded-full flex items-center justify-center">
      <span className="text-[14px] font-medium text-[#6b7280]">AJ</span>
    </div>

    {/* Name and Role */}
    <div className="flex flex-col leading-tight">
      <span className="text-[14px] font-medium text-[#1f2937]">Alex Johnson</span>
      <span className="text-[12px] text-[#6b7280]">Admin</span>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-[16px]">
        <h2 className="text-[20px] font-bold mb-[16px]">Coin Exchange</h2>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={selectedPlatform}
          onValueChange={(value) => setSelectedPlatform(value as Platform)}
          className="mb-[24px]"
        >
          <TabsList className="grid grid-cols-7 mb-[16px] h-[36px] bg-transparent p-0 gap-[8px]">
            <TabsTrigger
              value="all"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              All Coins
            </TabsTrigger>
            <TabsTrigger
              value="binance"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              Binance
            </TabsTrigger>
            <TabsTrigger
              value="payful"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              Payful
            </TabsTrigger>
            <TabsTrigger
              value="nexones"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              Nexones
            </TabsTrigger>
            <TabsTrigger
              value="bybit"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              Bybit
            </TabsTrigger>
            <TabsTrigger
              value="kucoin"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              KuCoin
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="text-[14px] h-[36px] data-[state=active]:bg-[#f6b10a] data-[state=active]:text-white rounded-[4px] border border-[#e5e7eb] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              Other
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Coin Balances */}
        <div className="mb-[32px]">
          <div className="flex justify-between items-center mb-[16px]">
            <h2 className="text-[20px] font-bold">Coin Balances</h2>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-[8px] h-[32px] text-[14px] rounded-[4px] border-[#e5e7eb]"
                  >
                    {isRefreshing ? (
                      <RefreshCw className="h-[14px] w-[14px] mr-[4px] animate-spin" />
                    ) : (
                      <RefreshCw className="h-[14px] w-[14px] mr-[4px]" />
                    )}
                    Refresh
                    <ChevronDown className="h-[14px] w-[14px] ml-[4px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  {refreshIntervals.map((interval) => (
                    <DropdownMenuItem
                      key={interval.value}
                      onClick={() => {
                        setRefreshInterval(interval.value)
                        if (interval.value === 0) {
                          refreshData()
                        }
                      }}
                      className="text-[14px] cursor-pointer"
                    >
                      {interval.label}
                      {refreshInterval === interval.value && interval.value > 0 && (
                        <Check className="h-[14px] w-[14px] ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="h-[32px] text-[14px] rounded-[4px] border-[#e5e7eb]">
                <Plus className="h-[14px] w-[14px] mr-[4px]" />
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {/* Coin Cards */}
            {coins.map((coin) => (
              <Card
                key={coin.id}
                className="p-[16px] border border-[#e5e7eb] rounded-[8px] shadow-none cursor-pointer hover:border-[#f6b10a] transition-colors"
                onClick={() => handleExchangeCoin(coin)}
              >
                <div className="flex justify-between items-center mb-[12px]">
                  <div className="flex items-center">
                    <CryptoIcon symbol={coin.symbol} className="w-[20px] h-[20px] mr-[8px]" />
                    <span className="font-bold text-[16px]">{coin.symbol}</span>
                  </div>
                  <span className={`text-[14px] ${coin.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {coin.change >= 0 ? "+" : ""}
                    {coin.change}%
                  </span>
                </div>
                <div className="mb-[12px]">
                  <div className="text-[14px] text-[#6b7280]">Balance</div>
                  <div className="font-bold text-[18px]">
                    {coin.balance} {coin.symbol}
                  </div>
                </div>
                <div className="mb-[12px]">
                  <div className="text-[14px] text-[#6b7280]">Current Rate</div>
                  <div className="font-bold text-[16px]">US ${coin.rate.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[14px] text-[#f6b10a]">
                    Excess Coin: {coin.excessCoin} {coin.symbol}
                  </div>
                </div>
              </Card>
            ))}

            {/* Add New Coin Card */}
            <Card className="p-[16px] border border-[#e5e7eb] rounded-[8px] flex items-center justify-center shadow-none cursor-pointer hover:border-[#f6b10a] transition-colors">
              <div className="text-center">
                <div className="w-[40px] h-[40px] bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-[8px]">
                  <Plus className="h-[24px] w-[24px] text-[#9ca3af]" />
                </div>
                <div className="text-[14px] text-[#6b7280]">Add New Coin</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-[32px]">
          <h2 className="text-[20px] font-bold mb-[16px]">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[14px] text-[#6b7280]">
                  <th className="text-left p-[8px] font-medium">Date</th>
                  <th className="text-left p-[8px] font-medium">Platform</th>
                  <th className="text-left p-[8px] font-medium">Coin</th>
                  <th className="text-left p-[8px] font-medium">Type</th>
                  <th className="text-left p-[8px] font-medium">Amount</th>
                  <th className="text-left p-[8px] font-medium">Value (NGN)</th>
                  <th className="text-left p-[8px] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[#e5e7eb]">
                    <td className="p-[8px] text-[14px]">
                      <div>{transaction.date}</div>
                      <div className="text-[12px] text-[#6b7280]">{transaction.time}</div>
                    </td>
                    <td className="p-[8px]">
                      <span
                        className={`${getPlatformBadgeColor(transaction.platform)} text-[12px] px-[8px] py-[4px] rounded-[4px]`}
                      >
                        {transaction.platform.charAt(0).toUpperCase() + transaction.platform.slice(1)}
                      </span>
                    </td>
                    <td className="p-[8px] text-[14px]">{transaction.coin}</td>
                    <td
                      className={`p-[8px] text-[14px] ${
                        transaction.type === "buy" ? "text-[#22c55e]" : "text-[#ef4444]"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td className="p-[8px] text-[14px]">
                      {transaction.amount} {transaction.coin}
                    </td>
                    <td className="p-[8px] text-[14px]">₦{transaction.value.toLocaleString()}</td>
                    <td className="p-[8px]">{getStatusBadge(transaction.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exchange Coin Form */}
        <div>
          <h2 className="text-[20px] font-bold mb-[16px]">Exchange Coin</h2>
          <div className="border border-[#e5e7eb] rounded-[8px] p-[16px]">
            <div className="mb-[16px]">
              <label className="block text-[14px] font-medium mb-[8px]">From Coin</label>
              <div className="relative">
                <select className="w-full p-[8px] border border-[#e5e7eb] rounded-[4px] appearance-none text-[14px]">
                  <option>Select coin</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.symbol}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-[8px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-[#6b7280]" />
              </div>
            </div>

            <div className="mb-[16px]">
              <label className="block text-[14px] font-medium mb-[8px]">Amount</label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full p-[8px] border border-[#e5e7eb] rounded-[4px] text-[14px]"
              />
            </div>

            <div className="mb-[16px]">
              <label className="block text-[14px] font-medium mb-[8px]">Rate Option</label>
              <div className="border border-[#e5e7eb] rounded-[4px] p-[12px] flex items-center justify-between">
                <span className="text-[14px]">Market Rate</span>
                <Switch className="data-[state=checked]:bg-[#f6b10a]" />
                <span className="text-[14px]">Limit</span>
              </div>
            </div>

            <div className="mb-[16px]">
              <label className="block text-[14px] font-medium mb-[8px]">To Coin</label>
              <div className="relative">
                <select className="w-full p-[8px] border border-[#e5e7eb] rounded-[4px] appearance-none text-[14px]">
                  <option>Select coin</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.symbol}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-[8px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-[#6b7280]" />
              </div>
            </div>

            <div className="mb-[16px]">
              <label className="block text-[14px] font-medium mb-[8px]">Excess Coin</label>
              <div className="relative">
                <select className="w-full p-[8px] border border-[#e5e7eb] rounded-[4px] appearance-none text-[14px]">
                  <option>Select a coin</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.symbol}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-[8px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-[#6b7280]" />
              </div>
            </div>

            <Button className="w-full bg-[#f6b10a] hover:bg-[#f6b10a]/90 text-white h-[40px] rounded-[4px] text-[14px]">
              Execute Buy Trade
            </Button>
          </div>
        </div>
      </main>

      {/* Exchange Modal */}
      <Dialog open={exchangeModalOpen} onOpenChange={setExchangeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold flex items-center gap-[8px]">
              {selectedCoin && <CryptoIcon symbol={selectedCoin.symbol} className="w-[20px] h-[20px]" />}
              Exchange {selectedCoin?.symbol}
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6b7280]">
              Set your capital and excess coin amounts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-[16px] py-[16px]">
            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <Label htmlFor="total-coin" className="text-[14px] font-medium">
                  Total Coin
                </Label>
                <Input
                  id="total-coin"
                  value={selectedCoin?.balance || ""}
                  disabled
                  className="mt-[8px] text-[14px] p-[8px] border border-[#e5e7eb] rounded-[4px]"
                />
              </div>
              <div>
                <Label htmlFor="current-rate" className="text-[14px] font-medium">
                  Current Rate
                </Label>
                <Input
                  id="current-rate"
                  value={selectedCoin ? `$${selectedCoin.rate.toLocaleString()}` : ""}
                  disabled
                  className="mt-[8px] text-[14px] p-[8px] border border-[#e5e7eb] rounded-[4px]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="capital-coin" className="text-[14px] font-medium">
                Capital Coin
              </Label>
              <Input
                id="capital-coin"
                value={capitalCoin}
                onChange={(e) => handleCapitalCoinChange(e.target.value)}
                className="mt-[8px] text-[14px] p-[8px] border border-[#e5e7eb] rounded-[4px]"
              />
            </div>
            <div>
              <Label htmlFor="excess-coin" className="text-[14px] font-medium">
                Excess Coin
              </Label>
              <Input
                id="excess-coin"
                value={excessCoin}
                disabled
                className="mt-[8px] text-[14px] p-[8px] border border-[#e5e7eb] rounded-[4px]"
              />
            </div>
            <div>
              <Label className="text-[14px] font-medium mb-[8px] block">Rate Option</Label>
              <div className="border border-[#e5e7eb] rounded-[4px] p-[12px] flex items-center justify-between">
                <span className="text-[14px]">Market Rate</span>
                <Switch
                  checked={useMarketRate}
                  onCheckedChange={setUseMarketRate}
                  className="data-[state=checked]:bg-[#f6b10a]"
                />
                <span className="text-[14px]">Limit</span>
              </div>
            </div>
            {!useMarketRate && (
              <div>
                <Label htmlFor="limit-rate" className="text-[14px] font-medium">
                  Limit Rate
                </Label>
                <Input
                  id="limit-rate"
                  value={limitRate}
                  onChange={(e) => setLimitRate(e.target.value)}
                  placeholder="Enter limit rate"
                  className="mt-[8px] text-[14px] p-[8px] border border-[#e5e7eb] rounded-[4px]"
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-[8px]">
            <Button
              variant="outline"
              onClick={() => setExchangeModalOpen(false)}
              className="flex-1 h-[40px] rounded-[4px] text-[14px] border-[#e5e7eb]"
            >
              Cancel
            </Button>
            <Button
              onClick={executeExchange}
              className="flex-1 bg-[#f6b10a] hover:bg-[#f6b10a]/90 text-white h-[40px] rounded-[4px] text-[14px]"
            >
              Execute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
