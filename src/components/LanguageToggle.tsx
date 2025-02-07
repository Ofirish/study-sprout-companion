
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "he" : "en")}
      className={`fixed top-4 ${language === "en" ? "right-4" : "left-4"} z-50`}
    >
      {language === "en" ? "עברית" : "English"}
    </Button>
  );
};
