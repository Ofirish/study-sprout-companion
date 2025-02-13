import { general } from "./general";
import { actionTranslations } from "./actions";
import { statsTranslations } from "./stats";
import { tabTranslations } from "./tabs";
import { formTranslations } from "./form";
import { statusTranslations } from "./status";
import { subjectTranslations } from "./subjects";

export const translations = {
  ...general,
  ...actionTranslations,
  ...statsTranslations,
  ...tabTranslations,
  ...formTranslations,
  ...statusTranslations,
  ...subjectTranslations,
} as const;

export type Language = "en" | "he";
export type TranslationKey = keyof typeof translations;

export const hasTranslation = (key: string): key is TranslationKey => {
  return key in translations;
};

// Helper type to get all possible translation keys
export type AllTranslationKeys = keyof typeof translations;