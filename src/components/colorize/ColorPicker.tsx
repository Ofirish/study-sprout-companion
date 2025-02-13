
import { useState, useEffect } from 'react';
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

const COLORIZABLE_ELEMENTS = [
  { selector: 'primary-button', name: 'Primary Button' },
  { selector: 'secondary-button', name: 'Secondary Button' },
  // Add more elements as needed
];

export function ColorPicker() {
  const [selectedElement, setSelectedElement] = useState(COLORIZABLE_ELEMENTS[0].selector);
  const [color, setColor] = useState('#000000');
  const [themeName, setThemeName] = useState('');
  const { activeTheme, themes, saveTheme, resetTheme, updateElementColor } = useColorTheme();

  useEffect(() => {
    if (activeTheme) {
      const elementColor = activeTheme.colors.find(c => c.element_selector === selectedElement);
      if (elementColor) {
        setColor(elementColor.color);
      }
    }
  }, [selectedElement, activeTheme]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateElementColor(selectedElement, newColor);
  };

  const handleSaveTheme = async () => {
    if (!themeName) return;
    const colors = COLORIZABLE_ELEMENTS.map(element => ({
      element_selector: element.selector,
      color: getComputedStyle(document.documentElement)
        .getPropertyValue(`--${element.selector}-color`)
        .trim() || '#000000'
    }));
    await saveTheme(themeName, colors);
    setThemeName('');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Select Element</Label>
        <Select value={selectedElement} onValueChange={setSelectedElement}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLORIZABLE_ELEMENTS.map(element => (
              <SelectItem key={element.selector} value={element.selector}>
                {element.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <Select onValueChange={(themeId) => {
          const theme = themes.find(t => t.id === themeId);
          if (theme) {
            theme.colors.forEach(({ element_selector, color }) => {
              updateElementColor(element_selector, color);
            });
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map(theme => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.theme_name}
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
          <Button onClick={handleSaveTheme}>Save</Button>
        </div>
      </div>

      <Button onClick={resetTheme} variant="outline" className="w-full">
        Reset to Default
      </Button>
    </div>
  );
}
