import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface DashboardActionsProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const DashboardActions = ({ showForm, setShowForm }: DashboardActionsProps) => {
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

  return (
    <div className="flex justify-between items-center gap-4 mb-4">
      <Button 
        onClick={() => setShowForm(!showForm)}
        size="sm"
        className="w-auto text-sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {showForm ? t("cancel") : t("addAssignment")}
      </Button>

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
};