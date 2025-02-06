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
  | "assignmentsFor"
  | "formRequired"
  | "formSuccess"
  | "formTitle"
  | "formDescription"
  | "formSubject"
  | "formType"
  | "formHomework"
  | "formTest"
  | "formDueDate"
  | "formSubmit"
  | "tabUpcoming"
  | "tabTests"
  | "noUpcoming"
  | "noHomework"
  | "noTests"
  | "total"
  | "done"
  | "active"
  | "new";

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
  formRequired: {
    en: "Please fill in all required fields",
    he: "נא למלא את כל השדות הנדרשים",
  },
  formSuccess: {
    en: "Assignment added successfully",
    he: "המטלה נוספה בהצלחה",
  },
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
    he: "נושא",
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
  formDueDate: {
    en: "Due Date",
    he: "תאריך יעד",
  },
  formSubmit: {
    en: "Add Assignment",
    he: "הוסף מטלה",
  },
  tabUpcoming: {
    en: "Upcoming",
    he: "קרוב",
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
  total: {
    en: "Total",
    he: "סך הכל",
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
};
