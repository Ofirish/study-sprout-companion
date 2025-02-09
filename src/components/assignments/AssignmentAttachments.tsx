
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface AssignmentAttachmentsProps {
  assignmentId: string;
  canEdit?: boolean;
}

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string | null;
}

export const AssignmentAttachments = ({ assignmentId, canEdit = false }: AssignmentAttachmentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${assignmentId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignment-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('assignment_attachments')
        .insert({
          assignment_id: assignmentId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
        });

      if (dbError) throw dbError;

      toast({
        title: t("success"),
        description: t("fileUploaded"),
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("error"),
        description: t("uploadError"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchAttachments = async () => {
    if (!assignmentId) return;
    
    const { data, error } = await supabase
      .from('assignment_attachments')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (!error && data) {
      setAttachments(data);
    }
  };

  const handleDelete = async (attachmentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assignment-attachments')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('assignment_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      toast({
        title: t("success"),
        description: t("fileDeleted"),
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: t("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    }
  };

  // Fetch attachments on component mount and when assignmentId changes
  useEffect(() => {
    fetchAttachments();
  }, [assignmentId]);

  return (
    <div className="mt-4">
      {canEdit && (
        <div className="mb-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? t("uploading") : t("addAttachment")}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4" />
                <a
                  href={`${supabase.storage.from('assignment-attachments').getPublicUrl(attachment.file_path).data.publicUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {attachment.file_name}
                </a>
              </div>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id, attachment.file_path)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
