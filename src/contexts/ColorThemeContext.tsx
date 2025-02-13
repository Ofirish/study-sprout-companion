
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface ElementColor {
  element_selector: string;
  color: string;
}

interface Theme {
  id: string;
  theme_name: string;
  is_preset: boolean;
  colors: ElementColor[];
}

interface ColorThemeContextType {
  activeTheme: Theme | null;
  setActiveTheme: (theme: Theme | null) => void;
  themes: Theme[];
  saveTheme: (themeName: string, colors: ElementColor[]) => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  resetTheme: () => void;
  updateElementColor: (selector: string, color: string) => void;
  applyTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      loadThemes();
    }
  }, [session?.user]);

  const loadThemes = async () => {
    try {
      const { data: themesData, error: themesError } = await supabase
        .from('user_color_themes')
        .select('*')
        .or(`user_id.eq.${session?.user.id},is_preset.eq.true`);

      if (themesError) throw themesError;

      const themes: Theme[] = [];
      for (const theme of themesData) {
        const { data: colorsData, error: colorsError } = await supabase
          .from('element_colors')
          .select('*')
          .eq('theme_id', theme.id);

        if (colorsError) throw colorsError;

        themes.push({
          id: theme.id,
          theme_name: theme.theme_name,
          is_preset: theme.is_preset,
          colors: colorsData.map(({ element_selector, color }) => ({
            element_selector,
            color
          }))
        });
      }

      setThemes(themes);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error loading themes",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const applyTheme = (theme: Theme) => {
    theme.colors.forEach(({ element_selector, color }) => {
      updateElementColor(element_selector, color);
    });
    setActiveTheme(theme);
  };

  const deleteTheme = async (themeId: string) => {
    if (!session?.user) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_color_themes')
        .delete()
        .eq('id', themeId)
        .eq('user_id', session.user.id)
        .single();

      if (deleteError) throw deleteError;

      await loadThemes();
      
      toast({
        title: "Theme deleted",
        description: "The theme has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting theme",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveTheme = async (themeName: string, colors: ElementColor[]) => {
    if (!session?.user) return;

    try {
      const { data: theme, error: themeError } = await supabase
        .from('user_color_themes')
        .insert([{ theme_name: themeName, user_id: session.user.id }])
        .select()
        .single();

      if (themeError) throw themeError;

      const colorInserts = colors.map(color => ({
        theme_id: theme.id,
        element_selector: color.element_selector,
        color: color.color
      }));

      const { error: colorsError } = await supabase
        .from('element_colors')
        .insert(colorInserts);

      if (colorsError) throw colorsError;

      await loadThemes();
      
      toast({
        title: "Theme saved",
        description: "Your theme has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving theme",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetTheme = () => {
    setActiveTheme(null);
    document.documentElement.style.cssText = "";
  };

  const updateElementColor = (selector: string, color: string) => {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h *= 60;
    }

    document.documentElement.style.setProperty(
      `--${selector}`,
      `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`
    );
  };

  return (
    <ColorThemeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        themes,
        saveTheme,
        deleteTheme,
        resetTheme,
        updateElementColor,
        applyTheme,
        isLoading
      }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
