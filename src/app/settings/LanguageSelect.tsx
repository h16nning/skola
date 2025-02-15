import { useSetting } from "@/logic/settings/hooks/useSetting";
import { setSetting } from "@/logic/settings/setSetting";
import { Select } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { SupportedLanguages } from "../../logic/settings/Settings";

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
