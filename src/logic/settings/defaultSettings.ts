import { SettingsValues, SupportedLanguages } from "./Settings";

export const defaultSettings: SettingsValues = {
  language: SupportedLanguages.English,
  useVisualFeedback: true,
  developerMode: false,
  showShortcutHints: true,

  colorSchemePreference: "auto",
  showCognitivePrompts: true,

  useBubbleMenu: true,
  useToolbar: false,
  showSubAndSuperScriptOptionInEditor: true,
  showStrikethroughOptionInEditor: true,
  showHighlightOptionInEditor: true,
  showListOptionInEditor: true,
  showCodeOptionInEditor: true,
  showLinkOptionInEditor: true,

  learn_newToReviewRatio: 0.5,
  learn_sort: "creationDate",
  learn_enableHardAndEasy: true,
  globalScheduler_maximumInterval: 36500,
  globalScheduler_requestRetention: 0.9,
  globalScheduler_w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
    0.34, 1.26, 0.29, 2.61,
  ],
};
