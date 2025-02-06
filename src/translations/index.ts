import { generalTranslations } from "./general";
import { actionTranslations } from "./actions";
import { statsTranslations } from "./stats";
import { tabTranslations } from "./tabs";
import { formTranslations } from "./form";
import { statusTranslations } from "./status";
import { subjectTranslations } from "./subjects";

export const translations = {
  ...generalTranslations,
  ...actionTranslations,
  ...statsTranslations,
  ...tabTranslations,
  ...formTranslations,
  ...statusTranslations,
  ...subjectTranslations,
} as const;

// Type definitions
export type Language = "en" | "he";
export type TranslationKey = keyof typeof translations;

// Add a type guard to ensure translation exists
export const hasTranslation = (key: string): key is TranslationKey => {
  return key in translations;
};
