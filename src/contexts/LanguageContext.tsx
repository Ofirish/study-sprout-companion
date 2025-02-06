/**
 * LanguageContext.tsx
 * Purpose: Manages the application's language state and translations.
 * Provides language switching functionality and translation utilities.
 */
import React, { createContext, useContext, useState } from "react";

type Language = "en" | "he";

// Separate translations into a dedicated object for better maintainability
const translations = {
  // Navigation and general UI
  appTitle: {
    en: "All Your Homework Are Belong to Us",
    he: "All Your Homework Are Belong to Us - Heb",
  },
  appDescription: {
    en: "Keep track of all your assignments and tests in one place",
    he: "עקוב אחר כל המטלות והמבחנים שלך במקום אחד",
  },
  
  // Actions
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
  cancel: {
    en: "Cancel",
    he: "ביטול",
  },
  hideCompleted: {
    en: "Hide Completed",
    he: "הסתר משימות שהושלמו",
  },

  // Stats
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

  // Tabs
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

  // Form
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

  // Status
  notStarted: {
    en: "Not Started",
    he: "טרם התחיל",
  },
  inProgress: {
    en: "In Progress",
    he: "בתהליך",
  },
  completed: {
    en: "Completed",
    he: "הושלם",
  },

  // Subjects
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
};

type TranslationKey = keyof typeof translations;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: TranslationKey) => {
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