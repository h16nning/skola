import React from "react";
import {
  SupportedLanguages,
  setSetting,
  useSetting,
} from "../../logic/Settings";
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
          setSetting("language", value as SupportedLanguages);
          i18n.changeLanguage(value);
          window.location.reload();
        }

        return value;
      }}
      data={[
        { value: SupportedLanguages.German, label: "Deutsch (Incomplete)" },
        { value: SupportedLanguages.English, label: "English" },
        { value: SupportedLanguages.Swedish, label: "Svenska (Incomplete)" },
      ]}
    />
  );
}
