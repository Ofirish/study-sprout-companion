/**
 * LanguageContext.tsx
 * Purpose: Manages the application's language state and translations.
 * Provides language switching functionality and translation utilities.
 */
import React, { createContext, useContext, useState } from "react";
import { translations, Language, TranslationKey, hasTranslation } from "@/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: TranslationKey): string => {
    if (!hasTranslation(key)) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};