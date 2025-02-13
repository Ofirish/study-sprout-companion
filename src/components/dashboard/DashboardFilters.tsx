
import { Button } from "@/components/ui/button";
import { Users, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DashboardFiltersProps {
  statusFilter: "all" | "completed" | "in_progress" | "not_started";
  setStatusFilter: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
  viewMode: "all" | "student" | "parent";
  setViewMode: (mode: "all" | "student" | "parent") => void;
  hideCompleted: boolean;
  setHideCompleted: (hide: boolean) => void;
  hasStudents: boolean;
  funMode: boolean;
  showOnlyBottomControls?: boolean;
}

export const DashboardFilters = ({
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  hideCompleted,
  setHideCompleted,
  hasStudents,
  funMode,
  showOnlyBottomControls = false,
}: DashboardFiltersProps) => {
  const { t } = useLanguage();

  const filters = (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Switch
        id="hide-completed"
        checked={hideCompleted}
        onCheckedChange={setHideCompleted}
      />
      <Label htmlFor="hide-completed" className="text-sm">
        {t("hideCompleted")}
      </Label>
    </div>
  );

  const userMenu = hasStudents && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span>
            {viewMode === "all" && t("viewAll")}
            {viewMode === "parent" && t("viewParent")}
            {viewMode === "student" && t("viewStudent")}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem onClick={() => setViewMode("all")}>
          {t("viewAll")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setViewMode("parent")}>
          {t("viewParent")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setViewMode("student")}>
          {t("viewStudent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (showOnlyBottomControls) {
    return null; // Don't render anything at the bottom since we removed the sign out button
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {filters}
        {userMenu}
      </div>
    </div>
  );
};
