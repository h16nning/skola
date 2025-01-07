import { Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../logic/Settings";
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
      <Text>{w.join(",")}</Text>
    </Stack>
  );
}
