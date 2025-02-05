
export type Subject = "Math" | "Science" | "English" | "History" | "Other";

export type AssignmentStatus = "Not Started" | "In Progress" | "Completed";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  dueDate: Date | string;
  status: AssignmentStatus;
  type: "homework" | "test";
  user_id: string;
  created_at?: string;
  updated_at?: string;
}
