import React, { useState } from "react";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import SettingsInput from "./SettingsInput";
import LanguageSelect from "./LanguageSelect";
import { useTranslation } from "react-i18next";

export default function GeneralSettingsView() {
  const [t] = useTranslation();
  return (
    <>
      <Stack gap="xl" align="start">
        <SettingsInput
          label={t("settings.general.name")}
          description={t("settings.general.name-description")}
          settingsKey={"name"}
          inputType={"text"}
        />
        <LanguageSelect />
        <SettingsInput
          label={t("settings.general.enable-developer-mode")}
          description={t("settings.general.enable-developer-mode-description")}
          settingsKey="developerMode"
          inputType={"switch"}
        />
      </Stack>
    </>
  );
}
