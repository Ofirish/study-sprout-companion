
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FlyingName } from "./FlyingName";

export const DashboardHeader = () => {
  const { t } = useLanguage();
  const { session } = useAuth();
  const [userName, setUserName] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [showFlyingName, setShowFlyingName] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();
      
      if (data && !error) {
        const fullName = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(' ');
        setUserName(fullName || t("guest"));
      }
    };

    fetchUserProfile();
  }, [session?.user?.id, t]);

  const handleNameClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setShowFlyingName(true);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <>
      {showFlyingName && (
        <FlyingName
          name={userName}
          onClose={() => setShowFlyingName(false)}
        />
      )}
      <div className="flex flex-col gap-2 mb-8">
        <div 
          className="text-sm text-muted-foreground cursor-pointer select-none"
          onClick={handleNameClick}
        >
          {t("welcome")}, {userName}
        </div>
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
    </>
  );
};
