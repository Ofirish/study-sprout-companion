/**
 * translations/index.ts
 * Purpose: Centralizes all application translations in a maintainable structure.
 * Exports translations object used by the LanguageContext.
 */

export const translations = {
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
} as const;

export type Language = "en" | "he";
export type TranslationKey = keyof typeof translations;