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
        label={t("settings.learn.requestRetention")}
        settingsKey="globalScheduler_requestRetention"
        inputType="number"
      />
      <SettingsInput
        label={t("settings.learn.maximumInterval")}
        settingsKey="globalScheduler_maximumInterval"
        inputType="number"
      />
      <Text>{w.map((x) => x + ", ")}</Text>
    </Stack>
  );
}
