
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
  // Page Elements
  { selector: 'background', name: 'Page Background' },
  { selector: 'foreground', name: 'Text Color' },
  
  // Primary Elements
  { selector: 'primary', name: 'Primary Button Background' },
  { selector: 'primary-foreground', name: 'Primary Button Text' },
  
  // Secondary Elements
  { selector: 'secondary', name: 'Secondary Button Background' },
  { selector: 'secondary-foreground', name: 'Secondary Button Text' },
  
  // Cards
  { selector: 'card', name: 'Card Background' },
  { selector: 'card-foreground', name: 'Card Text' },
  
  // Muted Elements (Tabs, Secondary Text)
  { selector: 'muted', name: 'Tab Background' },
  { selector: 'muted-foreground', name: 'Tab Text' },
  
  // Accent Elements (Selected State)
  { selector: 'accent', name: 'Selected Tab Background' },
  { selector: 'accent-foreground', name: 'Selected Tab Text' },
  
  // Destructive Elements
  { selector: 'destructive', name: 'Delete Button Background' },
  { selector: 'destructive-foreground', name: 'Delete Button Text' },
  
  // Form Elements
  { selector: 'border', name: 'Border Colors' },
  { selector: 'input', name: 'Input Background' },
  { selector: 'ring', name: 'Focus Ring' }
];

export function ColorPicker() {
  const [selectedElement, setSelectedElement] = useState(COLORIZABLE_ELEMENTS[0].selector);
  const [color, setColor] = useState('#000000');
  const [themeName, setThemeName] = useState('');
  const [previewColors, setPreviewColors] = useState<Record<string, string>>({});
  const { activeTheme, themes, saveTheme, deleteTheme, resetTheme, updateElementColor, applyTheme } = useColorTheme();

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
    setPreviewColors({});
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
  };

  const handleReset = () => {
    resetTheme();
    setPreviewColors({});
    setColor('#000000');
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
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
        className="w-full"
        style={{ backgroundColor: "var(--fixed-primary)", color: "white" }}
        disabled={Object.keys(previewColors).length === 0}
      >
        Apply Changes
      </Button>

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
                className="flex justify-between items-center"
              >
                <span>{theme.theme_name}</span>
                {!theme.is_preset && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteTheme(theme.id);
                    }}
                    className="ml-2 p-1 h-6 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Delete
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

      <Button 
        onClick={handleReset} 
        variant="outline" 
        className="w-full"
      >
        Reset to Default
      </Button>
    </div>
  );
}
