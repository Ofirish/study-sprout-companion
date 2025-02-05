
import { useState } from "react";
import { Assignment, Subject } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface AssignmentFormProps {
  onSubmit: (assignment: Omit<Assignment, "id" | "status">) => void;
}

export const AssignmentForm = ({ onSubmit }: AssignmentFormProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<Subject>("Other");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"homework" | "test">("homework");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      subject,
      due_date: new Date(dueDate).toISOString(), // Convert to ISO string and use due_date
      type,
      user_id: session?.user.id!, // Add user_id from session
    });

    setTitle("");
    setDescription("");
    setSubject("Other");
    setDueDate("");
    setType("homework");

    toast({
      title: "Success",
      description: "Assignment added successfully!",
    });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Math Chapter 5 Problems"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Complete problems 1-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "homework" | "test")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="homework">Homework</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </form>
    </Card>
  );
};
