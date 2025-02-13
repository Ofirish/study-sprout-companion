
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useColorTheme } from '@/contexts/ColorThemeContext';
import { ColorPickerForm } from './ColorPickerForm';
import { ThemeManager } from './ThemeManager';

export function ColorPicker() {
  const [selectedElement, setSelectedElement] = useState('background');
  const [color, setColor] = useState('#000000');
  const { activeTheme, resetTheme, updateElementColor } = useColorTheme();

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

  const handleReset = () => {
    resetTheme();
    setColor('#000000');
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
      <ColorPickerForm
        selectedElement={selectedElement}
        onElementChange={setSelectedElement}
        color={color}
        onColorChange={handleColorChange}
      />
      
      <ThemeManager />

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
