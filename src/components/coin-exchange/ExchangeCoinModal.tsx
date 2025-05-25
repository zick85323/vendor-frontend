import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowRightCircle } from "lucide-react";
import { CoinType, ExchangeFormData, CoinBalance } from "@/types/coin-exchange";
import {
  formatCurrency,
  formatCoinAmount,
  validateNumberInRange,
} from "@/lib/formatters";

interface ExchangeCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoin?: CoinBalance;
  coinBalances: CoinBalance[];
  onExecuteTrade: (formData: ExchangeFormData) => Promise<void>;
}

const ExchangeCoinModal: React.FC<ExchangeCoinModalProps> = ({
  isOpen,
  onClose,
  selectedCoin,
  coinBalances,
  onExecuteTrade,
}) => {
  const [formData, setFormData] = useState<ExchangeFormData>({
    fromCoin: "",
    toCoin: "",
    amount: 0,
    useMarketRate: true, // Default to market rate
    manualRate: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate input values
  const [errors, setErrors] = useState<{
    amount?: string;
    manualRate?: string;
  }>({});

  useEffect(() => {
    if (selectedCoin) {
      setFormData({
        ...formData,
        fromCoin: selectedCoin.type,
        amount: selectedCoin.excessCoin,
        manualRate: selectedCoin.currentRate,
      });
    }
  }, [selectedCoin]);

  // Toggle handler specifically for the rate option
  const handleToggleRateOption = (checked: boolean) => {
    console.log("Toggle changed to:", checked);
    const selectedCoinData = coinBalances.find(
      (coin) => coin.type === formData.fromCoin,
    );

    setFormData((prev) => ({
      ...prev,
      useMarketRate: checked,
      manualRate: selectedCoinData?.currentRate || prev.manualRate,
    }));
  };

  // General form field change handler
  const handleChange = (name: keyof ExchangeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onExecuteTrade(formData);
      onClose();
    } catch (error) {
      console.error("Failed to execute trade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form on change
  useEffect(() => {
    const newErrors: { amount?: string; manualRate?: string } = {};

    // Selected coin data for validation
    const selectedCoinData = coinBalances.find(
      (coin) => coin.type === formData.fromCoin,
    );

    if (formData.amount > 0) {
      // Check if amount exceeds available balance
      if (selectedCoinData && formData.amount > selectedCoinData.balance) {
        newErrors.amount = `Amount exceeds available balance of ${formatCoinAmount(selectedCoinData.balance, selectedCoinData.type)}`;
      }

      // Check if amount exceeds excess coin (for better UX)
      if (
        selectedCoinData &&
        formData.amount > selectedCoinData.excessCoin * 1.2
      ) {
        newErrors.amount = `Consider using amount closer to excess coin: ${formatCoinAmount(selectedCoinData.excessCoin, selectedCoinData.type)}`;
      }
    }

    // Validate manual rate if used
    if (!formData.useMarketRate && formData.manualRate) {
      const marketRate = selectedCoinData?.currentRate || 0;
      // Allow rate to be within 20% of market rate
      if (
        !validateNumberInRange(
          formData.manualRate,
          marketRate * 0.8,
          marketRate * 1.2,
        )
      ) {
        newErrors.manualRate = `Rate should be within 20% of market rate: ${formatCurrency(marketRate)}`;
      }
    }

    setErrors(newErrors);
  }, [formData, coinBalances]);

  const selectedCoinData = coinBalances.find(
    (coin) => coin.type === formData.fromCoin,
  );

  // Check if form is valid
  const isFormValid =
    formData.fromCoin !== "" &&
    formData.toCoin !== "" &&
    formData.amount > 0 &&
    Object.keys(errors).length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exchange Coin</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fromCoin">From Coin</Label>
            <Select
              value={formData.fromCoin}
              onValueChange={(value) => handleChange("fromCoin", value)}
            >
              <SelectTrigger id="fromCoin">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {coinBalances.map((coin) => (
                  <SelectItem key={coin.type} value={coin.type}>
                    {coin.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={formData.amount || ""}
                onChange={(e) =>
                  handleChange("amount", parseFloat(e.target.value) || 0)
                }
                className={
                  errors.amount
                    ? "border-red-300 focus-visible:ring-red-300"
                    : ""
                }
              />
              {errors.amount && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.amount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rate Option Toggle - Fixed Implementation */}
          <div className="grid gap-2">
            <Label>Rate Option</Label>
            <div className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
              <span
                className={`transition-colors duration-200 ${
                  formData.useMarketRate ? "font-medium text-amber-600" : ""
                }`}
              >
                Market Rate
              </span>
              <div className="mx-2">
                <Switch
                  checked={formData.useMarketRate}
                  onCheckedChange={handleToggleRateOption}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
              <span
                className={`transition-colors duration-200 ${
                  !formData.useMarketRate ? "font-medium text-amber-600" : ""
                }`}
              >
                Limit
              </span>
            </div>
            {formData.useMarketRate && selectedCoinData && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-amber-500"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 8V12L14 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>
                  Current market rate:{" "}
                  {formatCurrency(selectedCoinData.currentRate)}
                </span>
              </div>
            )}
          </div>

          {/* Manual Rate Input - Only show when not using market rate */}
          {!formData.useMarketRate && (
            <div className="grid gap-2 animate-fadeIn">
              <Label htmlFor="manualRate">Rate</Label>
              <div className="relative">
                <Input
                  id="manualRate"
                  type="number"
                  value={formData.manualRate || ""}
                  onChange={(e) =>
                    handleChange("manualRate", parseFloat(e.target.value) || 0)
                  }
                  className={
                    errors.manualRate
                      ? "border-red-300 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {errors.manualRate && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.manualRate}</span>
                  </div>
                )}
                {selectedCoinData && (
                  <div className="text-xs text-gray-500 mt-1">
                    Market rate: {formatCurrency(selectedCoinData.currentRate)}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="toCoin">To Coin</Label>
            <Select
              value={formData.toCoin}
              onValueChange={(value) => handleChange("toCoin", value)}
            >
              <SelectTrigger id="toCoin">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {coinBalances
                  .filter((coin) => coin.type !== formData.fromCoin)
                  .map((coin) => (
                    <SelectItem key={coin.type} value={coin.type}>
                      {coin.type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCoinData && (
            <div className="grid gap-2">
              <Label>Excess Coin</Label>
              <div className="border p-3 rounded-md bg-gray-50">
                {formatCoinAmount(
                  selectedCoinData.excessCoin,
                  selectedCoinData.type,
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !isFormValid}
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-600 transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Execute Sell Trade</span>
                <ArrowRightCircle className="h-4 w-4" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExchangeCoinModal;
