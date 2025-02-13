
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/translations";
import type { Language, TranslationKey } from "@/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface CustomTranslation {
  translation_key: string;
  en: string;
  he: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [customTranslations, setCustomTranslations] = useState<CustomTranslation[]>([]);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user.id) {
      const fetchCustomTranslations = async () => {
        const { data } = await supabase
          .from("custom_translations")
          .select("*")
          .eq("user_id", session.user.id);

        if (data) {
          setCustomTranslations(data);
        }
      };

      fetchCustomTranslations();
    }
  }, [session]);

  const t = (key: TranslationKey): string => {
    const customTranslation = customTranslations.find(
      (t) => t.translation_key === key
    );

    if (customTranslation) {
      return customTranslation[language];
    }

    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
