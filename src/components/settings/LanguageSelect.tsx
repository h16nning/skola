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
        if (value !== null) {
          setSetting("language", (value as SettingsValues["language"]) || "en");
          console.log("Language changed to", value);
          i18n.changeLanguage(value || "en");
        }
        return value;
      }}
      data={[
        { value: "de", label: "Deutsch (Incomplete)" },
        { value: "en", label: "English" },
        { value: "sv", label: "Svenska (Incomplete)" },
      ]}
    />
  );
}
