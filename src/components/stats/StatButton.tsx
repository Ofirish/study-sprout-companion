
/**
 * StatButton.tsx
 * Purpose: Reusable button component for displaying assignment statistics
 * 
 * Used by:
 * - src/components/StatsCard.tsx
 */

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { FilterValue, getFilterButtonStyle } from "@/utils/filterUtils";

interface StatButtonProps {
  icon: LucideIcon;
  count: number;
  label: string;
  filterValue: FilterValue;
  onClick: (filter: FilterValue) => void;
  iconColor: string;
}

export const StatButton = ({ 
  icon: Icon,
  count,
  label,
  filterValue,
  onClick,
  iconColor
}: StatButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(filterValue)}
      className={getFilterButtonStyle(filterValue)}
    >
      <div className={`text-xl sm:text-2xl font-bold ${iconColor} flex items-center gap-2`}>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        {count}
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </Button>
  );
};
