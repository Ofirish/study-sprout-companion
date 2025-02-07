import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const DashboardHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
      <Link to="/settings">
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          {t("settings")}
        </Button>
      </Link>
    </div>
  );
};