
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
  { selector: 'background', name: 'Page Background' },
  { selector: 'foreground', name: 'Text Color' },
  { selector: 'primary', name: 'Primary Color' },
  { selector: 'primary-foreground', name: 'Primary Text' },
  { selector: 'secondary', name: 'Secondary Color' },
  { selector: 'secondary-foreground', name: 'Secondary Text' },
  { selector: 'card', name: 'Card Background' },
  { selector: 'card-foreground', name: 'Card Text' },
  { selector: 'muted', name: 'Muted Background' },
  { selector: 'muted-foreground', name: 'Muted Text' },
  { selector: 'accent', name: 'Accent Color' },
  { selector: 'accent-foreground', name: 'Accent Text' },
  { selector: 'destructive', name: 'Destructive Color' },
  { selector: 'destructive-foreground', name: 'Destructive Text' },
  { selector: 'border', name: 'Border Color' },
  { selector: 'input', name: 'Input Border' },
  { selector: 'ring', name: 'Focus Ring' },
];

export function ColorPicker() {
  const [selectedElement, setSelectedElement] = useState(COLORIZABLE_ELEMENTS[0].selector);
  const [color, setColor] = useState('#000000');
  const [themeName, setThemeName] = useState('');
  const [previewColors, setPreviewColors] = useState<Record<string, string>>({});
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
    setPreviewColors(prev => ({
      ...prev,
      [selectedElement]: newColor
    }));
  };

  const handleApplyColors = () => {
    Object.entries(previewColors).forEach(([selector, color]) => {
      updateElementColor(selector, color);
    });
  };

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
    setPreviewColors({});
  };

  const handleReset = () => {
    resetTheme();
    setPreviewColors({});
    setColor('#000000');
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

      <Button 
        onClick={handleApplyColors} 
        className="w-full bg-primary"
        disabled={Object.keys(previewColors).length === 0}
      >
        Apply Changes
      </Button>

      <div className="space-y-2">
        <Label>Theme</Label>
        <Select onValueChange={(themeId) => {
          const theme = themes.find(t => t.id === themeId);
          if (theme) {
            const newPreviewColors: Record<string, string> = {};
            theme.colors.forEach(({ element_selector, color }) => {
              newPreviewColors[element_selector] = color;
            });
            setPreviewColors(newPreviewColors);
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

      <Button onClick={handleReset} variant="outline" className="w-full">
        Reset to Default
      </Button>
    </div>
  );
}
