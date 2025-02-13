
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardHeader = () => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
          setUserName(fullName);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  return (
    <div className="flex flex-col gap-2 mb-8">
      {userName && (
        <p className="text-sm text-muted-foreground">
          {language === "en" ? "Welcome" : "ברוך הבא"}, {userName}
        </p>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <Link to="/settings">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {t("settings")}
          </Button>
        </Link>
      </div>
    </div>
  );
};
