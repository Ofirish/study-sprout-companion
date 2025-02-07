
export type Subject = "Math" | "Science" | "English" | "History" | "Other";

export type AssignmentStatus = "Not Started" | "In Progress" | "Completed";

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject: Subject;
  due_date: string;  // Changed from dueDate to match DB column
  status: AssignmentStatus;
  type: "homework" | "test";
  user_id: string;
  created_at?: string;
  updated_at?: string;
  archived: boolean;
}

