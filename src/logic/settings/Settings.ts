export type Settings<T extends keyof SettingsValues> = {
  key: T;
  value: SettingsValues[T];
};

export enum SupportedLanguages {
  English = "en",
  German = "de",
  Swedish = "sv",
}

export interface SettingsValues {
  name?: string;
  language: SupportedLanguages;
  useVisualFeedback: boolean;
  developerMode: boolean;
  showShortcutHints: boolean;

  colorSchemePreference: "light" | "dark" | "auto";

  useBubbleMenu: boolean;
  useToolbar: boolean;
  showSubAndSuperScriptOptionInEditor: boolean;
  showStrikethroughOptionInEditor: boolean;
  showHighlightOptionInEditor: boolean;
  showListOptionInEditor: boolean;
  showCodeOptionInEditor: boolean;
  showLinkOptionInEditor: boolean;

  learn_newToReviewRatio: number;
  learn_sort: "creationDate" | "dueDate";

  globalScheduler_maximumInterval: number;
  globalScheduler_requestRetention: number;
  globalScheduler_w: number[];
}
