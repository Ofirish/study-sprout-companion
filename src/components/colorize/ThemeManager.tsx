
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorTheme } from '@/contexts/ColorThemeContext';
import { Trash2 } from 'lucide-react';
import { COLORIZABLE_ELEMENTS } from './ColorPickerForm';

export function ThemeManager() {
  const [themeName, setThemeName] = useState('');
  const { themes, saveTheme, deleteTheme, applyTheme } = useColorTheme();

  const handleSaveTheme = async () => {
    if (!themeName) return;
    const colors = COLORIZABLE_ELEMENTS.map(element => ({
      element_selector: element.selector,
      color: getComputedStyle(document.documentElement)
        .getPropertyValue(`--${element.selector}`)
        .trim() || '#000000'
    }));
    await saveTheme(themeName, colors);
    setThemeName('');
  };

  const handleDeleteTheme = async (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteTheme(themeId);
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Theme</Label>
        <Select onValueChange={(themeId) => {
          const theme = themes.find(t => t.id === themeId);
          if (theme) {
            applyTheme(theme);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map(theme => (
              <SelectItem 
                key={theme.id} 
                value={theme.id}
                className="flex justify-between items-center group"
              >
                <span>{theme.theme_name}</span>
                {!theme.is_preset && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteTheme(theme.id, e)}
                    className="ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Save as new theme</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Theme name"
          />
          <Button 
            onClick={handleSaveTheme}
            style={{ backgroundColor: "var(--fixed-primary)", color: "white" }}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
