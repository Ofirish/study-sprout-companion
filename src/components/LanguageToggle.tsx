
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "he" : "en")}
      className={`${
        isMobile ? "fixed top-2 right-2 z-50" : "fixed top-4 right-4 z-50"
      }`}
    >
      {language === "en" ? "עברית" : "English"}
    </Button>
  );
};
