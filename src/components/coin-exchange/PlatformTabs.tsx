import React from "react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/coin-exchange";

interface PlatformTabsProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
}

const platformList: Platform[] = [
  "All Platform",
  "Binance",
  "Paxful",
  "Noones",
  "Bybit",
  "KuCoin",
  "Other",
];

const PlatformTabs: React.FC<PlatformTabsProps> = ({
  selectedPlatform,
  onSelectPlatform,
}) => {
  return (
    <div className="flex items-center bg-zinc-100 p-1 rounded-md overflow-x-auto">
      {platformList.map((platform) => (
        <button
          key={platform}
          onClick={() => onSelectPlatform(platform)}
          className={cn(
            "px-4 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
            selectedPlatform === platform
              ? "bg-amber-500 text-white"
              : "text-zinc-500 hover:bg-zinc-200",
          )}
        >
          {platform}
        </button>
      ))}
    </div>
  );
};

export default PlatformTabs;
