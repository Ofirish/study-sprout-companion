export type Language = "en" | "he";

export type TranslationKey =
  | "Math"
  | "Science"
  | "English"
  | "History"
  | "Other"
  | "homework"
  | "completed"
  | "hideCompleted"
  | "cancel"
  | "appTitle"
  | "appDescription"
  | "addAssignment"
  | "showAll"
  | "signOut"
  | "tabHomework"
  | "notStarted"
  | "inProgress"
  | "viewingAssignments"
  | "selectStudent"
  | "myAssignments"
  | "assignmentsFor";

export const translations: Record<TranslationKey, Record<Language, string>> = {
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
  homework: {
    en: "Homework",
    he: "שיעורי בית",
  },
  completed: {
    en: "Completed",
    he: "הושלם",
  },
  hideCompleted: {
    en: "Hide Completed",
    he: "הסתר הושלמו",
  },
  cancel: {
    en: "Cancel",
    he: "ביטול",
  },
  appTitle: {
    en: "My App",
    he: "היישום שלי",
  },
  appDescription: {
    en: "This is my app description.",
    he: "זו תיאור היישום שלי.",
  },
  addAssignment: {
    en: "Add Assignment",
    he: "הוסף מטלה",
  },
  showAll: {
    en: "Show All",
    he: "הצג הכל",
  },
  signOut: {
    en: "Sign Out",
    he: "התנתק",
  },
  tabHomework: {
    en: "Homework",
    he: "שיעורי בית",
  },
  notStarted: {
    en: "Not Started",
    he: "לא התחיל",
  },
  inProgress: {
    en: "In Progress",
    he: "בתהליך",
  },
  viewingAssignments: {
    en: "Viewing Assignments",
    he: "צפייה במטלות",
  },
  selectStudent: {
    en: "Select Student",
    he: "בחר תלמיד",
  },
  myAssignments: {
    en: "My Assignments",
    he: "המטלות שלי",
  },
  assignmentsFor: {
    en: "Assignments for",
    he: "מטלות עבור",
  },
};
