import React from "react";
import { SettingsValues, setSetting, useSetting } from "../../logic/Settings";
import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function LanguageSelect() {
  const [language] = useSetting("language");
  const [t, i18n] = useTranslation();

  return (
    <Select
      value={language}
      defaultValue={language}
      label={t("settings.general.language")}
      description={t("settings.general.language-description")}
      onChange={(value) => {
        setSetting("language", (value as SettingsValues["language"]) || "en");
        i18n.changeLanguage(value || "en");
      }}
      data={[
        { value: "de", label: "Deutsch" },
        { value: "en", label: "English" },
        { value: "sv", label: "Svenska" },
      ]}
    />
  );
}
