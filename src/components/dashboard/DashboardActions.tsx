
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardActionsProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const DashboardActions = ({ showForm, setShowForm }: DashboardActionsProps) => {
  const { t } = useLanguage();

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
    </div>
  );
};
