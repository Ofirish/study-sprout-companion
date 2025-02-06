import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardHeader = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div dir={language === "he" ? "rtl" : "ltr"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("appTitle")}
          </h1>
          <p className="text-sm text-gray-600">
            {t("appDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};