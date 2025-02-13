
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorTheme } from '@/contexts/ColorThemeContext';

interface ColorPickerFormProps {
  selectedElement: string;
  onElementChange: (element: string) => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const COLORIZABLE_ELEMENTS = [
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

export function ColorPickerForm({ selectedElement, onElementChange, color, onColorChange }: ColorPickerFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Select Element</Label>
        <Select value={selectedElement} onValueChange={onElementChange}>
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
            onChange={(e) => onColorChange(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
    </>
  );
}
