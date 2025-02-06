import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FunModeControlsProps {
  onSignOut: () => void;
  showEmojiToggle: boolean;
  setShowEmojiToggle: (show: boolean) => void;
  enableEmojis: boolean;
  setEnableEmojis: (enable: boolean) => void;
  activeEmoji: string;
}

export const FunModeControls = ({
  onSignOut,
  showEmojiToggle,
  setShowEmojiToggle,
  enableEmojis,
  setEnableEmojis,
  activeEmoji,
}: FunModeControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Switch
          id="hide-completed"
          checked={enableEmojis}
          onCheckedChange={setEnableEmojis}
        />
        <Label htmlFor="hide-completed" className="text-sm">
          {t("hideCompleted")}
        </Label>
      </div>
      
      <div className="relative">
        <Button 
          variant="outline" 
          onClick={onSignOut}
          size="sm"
          className="w-auto group"
          onMouseEnter={() => setShowEmojiToggle(true)}
          onMouseLeave={() => setShowEmojiToggle(false)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
          <ChevronRight className={cn(
            "h-4 w-4 ml-2 transition-transform duration-200",
            showEmojiToggle ? "rotate-90" : ""
          )} />
        </Button>
        
        <div className={cn(
          "absolute left-0 -top-12 transition-all duration-200 opacity-0 pointer-events-none",
          showEmojiToggle && "opacity-100 pointer-events-auto"
        )}>
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
            <Switch
              id="enable-emojis"
              checked={enableEmojis}
              onCheckedChange={setEnableEmojis}
            />
            <Label htmlFor="enable-emojis" className="text-sm whitespace-nowrap">
              Fun Mode {activeEmoji}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};