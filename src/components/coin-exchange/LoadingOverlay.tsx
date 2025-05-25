import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Loading data...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
