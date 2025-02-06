import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  role: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  firstName,
  lastName,
  role,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
}: ProfileFormProps) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">{t("firstName")}</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder={t("firstName")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastName">{t("lastName")}</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder={t("lastName")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t("role")}</Label>
        <Input
          id="role"
          value={role}
          disabled
          className="bg-gray-100"
        />
      </div>

      <Button type="submit">{t("saveChanges")}</Button>
    </form>
  );
};