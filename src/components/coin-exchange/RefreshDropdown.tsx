import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, ChevronDown, Loader2 } from "lucide-react";
import { RefreshInterval } from "@/types/coin-exchange";

interface RefreshDropdownProps {
  onRefresh: () => Promise<void>;
  onSelectInterval: (interval: RefreshInterval) => void;
}

const intervals: RefreshInterval[] = [
  "Refresh Now",
  "Every 1 minute",
  "Every 3 minutes",
  "Every 5 minutes",
  "Every 10 minutes",
];

const RefreshDropdown: React.FC<RefreshDropdownProps> = ({
  onRefresh,
  onSelectInterval,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectInterval = (interval: RefreshInterval) => {
    onSelectInterval(interval);
    if (interval === "Refresh Now") {
      handleRefresh();
    }
  };

  return (
    <>
      {/* Overlay loader shown while refreshing */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span className="text-sm font-medium">Refreshing data...</span>
          </div>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin text-amber-500" : ""}`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {intervals.map((interval) => (
            <DropdownMenuItem
              key={interval}
              onClick={() => handleSelectInterval(interval)}
              disabled={isRefreshing}
            >
              {interval}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RefreshDropdown;
