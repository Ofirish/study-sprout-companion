import { Button } from "@/components/ui/button";
import { Users, ChevronDown, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
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
  onViewModeChange: (mode: "all" | "student" | "parent") => void;
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
  onViewModeChange,
}: DashboardFiltersProps) => {
  const { t } = useLanguage();
  const { signOut, refreshToken } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      if (error.message.includes("refresh_token_not_found")) {
        await refreshToken();
      } else {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewModeChange = (mode: "all" | "student" | "parent") => {
    setViewMode(mode);
    onViewModeChange(mode);

    // Update the URL search params to reflect the current filter
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('filter', mode);
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  };

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
        <DropdownMenuItem onClick={() => handleViewModeChange("all")}>
          {t("viewAll")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleViewModeChange("parent")}>
          {t("viewParent")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleViewModeChange("student")}>
          {t("viewStudent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (showOnlyBottomControls) {
    return (
      <div className="flex justify-between items-center">
        {filters}
        <Button 
          variant="outline" 
          onClick={handleSignOut} 
          size="sm"
          className="w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </Button>
      </div>
    );
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
