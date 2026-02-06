import { useSetting } from "@/logic/settings/hooks/useSetting";
import { Badge } from "@/components/ui/Badge";
import { Stack } from "@/components/ui/Stack";
import { useTranslation } from "react-i18next";
import SettingsInput from "./SettingsInput";

export default function LearnSettingsView() {
  const [t] = useTranslation();

  const [w] = useSetting("globalScheduler_w");
  return (
    <Stack gap="xl" align="start">
      <SettingsInput
        label={t("settings.learn.enable-visual-feedback")}
        description={t("settings.learn.enable-visual-feedback-description")}
        settingsKey="useVisualFeedback"
        inputType="checkbox"
      />
      <SettingsInput
        label={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
            {t("settings.learn.show-cognitive-prompts")}
            <Badge color="primary" size="sm">
              Beta
            </Badge>
          </div>
        }
        description={t("settings.learn.show-cognitive-prompts-description")}
        settingsKey="showCognitivePrompts"
        inputType="checkbox"
      />
      <SettingsInput
        label={t("settings.learn.enableHardAndEasy")}
        description={t("settings.learn.enableHardAndEasyDescription")}
        settingsKey="learn_enableHardAndEasy"
        inputType="checkbox"
      />
      <SettingsInput
        label={t("settings.learn.requestRetention")}
        description={t("settings.learn.requestRetentionDescription")}
        settingsKey="globalScheduler_requestRetention"
        inputType="number"
      />
      <SettingsInput
        label={t("settings.learn.maximumInterval")}
        description={t("settings.learn.maximumIntervalDescription")}
        settingsKey="globalScheduler_maximumInterval"
        inputType="number"
      />
      <SettingsInput
        label={t("settings.learn.newToReviewRatio")}
        description={t("settings.learn.newToReviewRatioDescription")}
        settingsKey="learn_newToReviewRatio"
        inputType="number"
      />
      <p style={{ fontSize: "0.875rem", color: "var(--theme-neutral-600)" }}>
        {w.join(",")}
      </p>
    </Stack>
  );
}
