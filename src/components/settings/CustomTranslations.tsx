
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CustomTranslation {
  id: string;
  translation_key: string;
  en: string;
  he: string;
}

interface TranslationGroup {
  title: string;
  description: string;
  keys: Array<{
    key: string;
    defaultEn: string;
    defaultHe: string;
  }>;
}

const translationGroups: TranslationGroup[] = [
  {
    title: "Dashboard Stats",
    description: "Labels for the dashboard statistics cards",
    keys: [
      { key: "total", defaultEn: "Total", defaultHe: "סה״כ" },
      { key: "done", defaultEn: "Done", defaultHe: "הושלם" },
      { key: "active", defaultEn: "Active", defaultHe: "פעיל" },
      { key: "new", defaultEn: "New", defaultHe: "חדש" },
    ],
  },
  {
    title: "Tabs",
    description: "Labels for the main navigation tabs",
    keys: [
      { key: "tabUpcoming", defaultEn: "Upcoming", defaultHe: "קרוב" },
      { key: "tabHomework", defaultEn: "Homework", defaultHe: "שיעורי בית" },
      { key: "tabTests", defaultEn: "Tests", defaultHe: "מבחנים" },
    ],
  },
  {
    title: "Subjects",
    description: "Labels for default subject types",
    keys: [
      { key: "Math", defaultEn: "Math", defaultHe: "מתמטיקה" },
      { key: "Science", defaultEn: "Science", defaultHe: "מדע" },
      { key: "English", defaultEn: "English", defaultHe: "אנגלית" },
      { key: "History", defaultEn: "History", defaultHe: "היסטוריה" },
    ],
  },
  {
    title: "Status",
    description: "Labels for assignment status",
    keys: [
      { key: "notStarted", defaultEn: "Not Started", defaultHe: "טרם התחיל" },
      { key: "inProgress", defaultEn: "In Progress", defaultHe: "בתהליך" },
      { key: "completed", defaultEn: "Completed", defaultHe: "הושלם" },
    ],
  },
  {
    title: "View Options",
    description: "Labels for view dropdown options",
    keys: [
      { key: "viewAll", defaultEn: "View All", defaultHe: "הצג הכל" },
      { key: "viewParent", defaultEn: "My View", defaultHe: "התצוגה שלי" },
      { key: "viewStudent", defaultEn: "Student View", defaultHe: "תצוגת תלמיד" },
    ],
  },
];

export const CustomTranslations = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [customTranslations, setCustomTranslations] = useState<CustomTranslation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomTranslations();
  }, [session]);

  const fetchCustomTranslations = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from("custom_translations")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCustomTranslations(data || []);
    setLoading(false);
  };

  const handleSaveTranslation = async (key: string, en: string, he: string) => {
    if (!session?.user.id) return;

    const existingTranslation = customTranslations.find(
      (t) => t.translation_key === key
    );

    const { error } = existingTranslation
      ? await supabase
          .from("custom_translations")
          .update({ en, he })
          .eq("id", existingTranslation.id)
      : await supabase
          .from("custom_translations")
          .insert([
            {
              user_id: session.user.id,
              translation_key: key,
              en,
              he,
            },
          ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Translation saved successfully",
    });

    fetchCustomTranslations();
  };

  const handleResetTranslation = async (key: string) => {
    if (!session?.user.id) return;

    const existingTranslation = customTranslations.find(
      (t) => t.translation_key === key
    );

    if (!existingTranslation) return;

    const { error } = await supabase
      .from("custom_translations")
      .delete()
      .eq("id", existingTranslation.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Translation reset to default",
    });

    fetchCustomTranslations();
  };

  const TranslationField = ({
    translationKey,
    defaultEn,
    defaultHe,
  }: {
    translationKey: string;
    defaultEn: string;
    defaultHe: string;
  }) => {
    const customTranslation = customTranslations.find(
      (t) => t.translation_key === translationKey
    );
    const [en, setEn] = useState(customTranslation?.en || defaultEn);
    const [he, setHe] = useState(customTranslation?.he || defaultHe);

    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{translationKey}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResetTranslation(translationKey)}
            disabled={!customTranslation}
          >
            Reset to Default
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>English</Label>
            <Input
              value={en}
              onChange={(e) => setEn(e.target.value)}
              placeholder={defaultEn}
            />
          </div>
          <div className="space-y-2">
            <Label>Hebrew</Label>
            <Input
              value={he}
              onChange={(e) => setHe(e.target.value)}
              placeholder={defaultHe}
              dir="rtl"
            />
          </div>
        </div>
        <Button
          onClick={() => handleSaveTranslation(translationKey, en, he)}
          className="w-full"
        >
          Save Changes
        </Button>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {language === "en" ? "Custom Labels" : "תוויות מותאמות אישית"}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {language === "en"
          ? "Customize the labels and text shown throughout your dashboard"
          : "התאם אישית את התוויות והטקסט המוצגים בלוח הבקרה שלך"}
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {translationGroups.map((group) => (
          <AccordionItem key={group.title} value={group.title}>
            <AccordionTrigger className="text-lg">
              {group.title}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {group.description}
              </p>
              {group.keys.map((key) => (
                <TranslationField
                  key={key.key}
                  translationKey={key.key}
                  defaultEn={key.defaultEn}
                  defaultHe={key.defaultHe}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};
