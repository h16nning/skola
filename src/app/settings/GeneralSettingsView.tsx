import { Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";
import SettingsInput from "./SettingsInput";

export default function GeneralSettingsView() {
  const [t] = useTranslation();
  return (
    <Stack gap="xl" align="start">
      <SettingsInput
        label={t("settings.general.name")}
        description={t("settings.general.name-description")}
        settingsKey={"name"}
        inputType={"text"}
      />
      <LanguageSelect />
      <SettingsInput
        label={t("settings.general.show-shortcut-hints")}
        description={t("settings.general.show-shortcut-hints-description")}
        settingsKey="showShortcutHints"
        inputType={"checkbox"}
      />
      <SettingsInput
        label={t("settings.general.enable-developer-mode")}
        description={t("settings.general.enable-developer-mode-description")}
        settingsKey="developerMode"
        inputType={"checkbox"}
      />
    </Stack>
  );
}
