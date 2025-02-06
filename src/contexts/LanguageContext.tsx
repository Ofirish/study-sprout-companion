import React, { createContext, useContext, useState } from "react";

type Language = "en" | "he";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
};

const translations = {
  total: {
    en: "Total",
    he: "סה״כ",
  },
  done: {
    en: "Done",
    he: "הושלם",
  },
  active: {
    en: "Active",
    he: "פעיל",
  },
  new: {
    en: "New",
    he: "חדש",
  },
  appTitle: {
    en: "Study Sprout",
    he: "ניצן הלמידה",
  },
  appDescription: {
    en: "Keep track of all your assignments and tests in one place",
    he: "עקוב אחר כל המטלות והמבחנים שלך במקום אחד",
  },
  addAssignment: {
    en: "Add Assignment",
    he: "הוסף מטלה",
  },
  showAll: {
    en: "Show All Assignments",
    he: "הצג את כל המטלות",
  },
  signOut: {
    en: "Sign Out",
    he: "התנתק",
  },
  upcoming: {
    en: "Upcoming",
    he: "קרוב",
  },
  homework: {
    en: "Homework",
    he: "שיעורי בית",
  },
  tests: {
    en: "Tests",
    he: "מבחנים",
  },
  
  // Form translations
  formTitle: {
    en: "Title",
    he: "כותרת",
  },
  formDescription: {
    en: "Description",
    he: "תיאור",
  },
  formSubject: {
    en: "Subject",
    he: "מקצוע",
  },
  formDueDate: {
    en: "Due Date",
    he: "תאריך יעד",
  },
  formType: {
    en: "Type",
    he: "סוג",
  },
  formHomework: {
    en: "Homework",
    he: "שיעורי בית",
  },
  formTest: {
    en: "Test",
    he: "מבחן",
  },
  formSubmit: {
    en: "Add Assignment",
    he: "הוסף מטלה",
  },
  formRequired: {
    en: "Please fill in all required fields",
    he: "נא למלא את כל השדות הנדרשים",
  },
  formSuccess: {
    en: "Assignment added successfully!",
    he: "המטלה נוספה בהצלחה!",
  },

  // Subject translations
  Math: {
    en: "Math",
    he: "מתמטיקה",
  },
  Science: {
    en: "Science",
    he: "מדע",
  },
  English: {
    en: "English",
    he: "אנגלית",
  },
  History: {
    en: "History",
    he: "היסטוריה",
  },
  Other: {
    en: "Other",
    he: "אחר",
  },

  // Tab translations
  tabUpcoming: {
    en: "Upcoming",
    he: "קרוב",
  },
  tabHomework: {
    en: "Homework",
    he: "שיעורי בית",
  },
  tabTests: {
    en: "Tests",
    he: "מבחנים",
  },
  noUpcoming: {
    en: "No upcoming assignments",
    he: "אין מטלות קרובות",
  },
  noHomework: {
    en: "No homework assignments",
    he: "אין שיעורי בית",
  },
  noTests: {
    en: "No tests",
    he: "אין מבחנים",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof typeof translations) => {
    return translations[key][language];
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
