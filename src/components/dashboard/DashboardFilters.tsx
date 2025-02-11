
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

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
  selectedStudentId?: string;
  setSelectedStudentId?: (id: string | undefined) => void;
  students?: Student[];
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
  selectedStudentId,
  setSelectedStudentId,
  students = [],
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

  const filters = !showOnlyBottomControls && (
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
            {viewMode === "parent" && (
              selectedStudentId 
                ? `${students.find(s => s.id === selectedStudentId)?.first_name} ${students.find(s => s.id === selectedStudentId)?.last_name}`
                : t("viewParent")
            )}
            {viewMode === "student" && t("viewStudent")}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem onClick={() => setViewMode("all")}>
          {t("viewAll")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          setViewMode("parent");
          setSelectedStudentId?.(undefined);
        }}>
          {t("viewParent")}
        </DropdownMenuItem>
        {viewMode === "parent" && students.map(student => (
          <DropdownMenuItem
            key={student.id}
            onClick={() => setSelectedStudentId?.(student.id)}
            className="pl-6"
          >
            {student.first_name} {student.last_name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setViewMode("student")}>
          {t("viewStudent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (showOnlyBottomControls) {
    return (
      <div className="flex justify-between items-center">
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
