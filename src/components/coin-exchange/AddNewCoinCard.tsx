import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AddNewCoinCardProps {
  onClick: () => void;
}

const AddNewCoinCard: React.FC<AddNewCoinCardProps> = ({ onClick }) => {
  return (
    <Card
      className="w-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Plus className="w-8 h-8 text-gray-400" />
        <span className="mt-4 text-gray-500 font-medium text-sm">
          Add New Coin
        </span>
      </CardContent>
    </Card>
  );
};

export default AddNewCoinCard;
