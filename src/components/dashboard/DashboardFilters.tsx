
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
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (showOnlyBottomControls) {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="hide-completed-bottom"
            checked={hideCompleted}
            onCheckedChange={setHideCompleted}
          />
          <Label htmlFor="hide-completed-bottom" className="text-sm">
            {t("hideCompleted")}
          </Label>
        </div>

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
      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          onClick={() => setStatusFilter("all")}
          size="sm"
          className={`text-sm sm:w-32 ${statusFilter === "all" ? "bg-primary text-white hover:bg-primary/90" : ""} ${
            funMode ? "rainbow-text" : ""
          }`}
        >
          Show All
        </Button>

        {hasStudents && (
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
        )}
      </div>
    </div>
  );
};
