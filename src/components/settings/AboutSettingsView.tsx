import React from "react";
import { Anchor, Stack, Text } from "@mantine/core";
import { t } from "i18next";

export default function AboutSettingsView() {
  return (
    <Stack gap="xl" align="start">
      <Text size="sm">{t("settings.about.description")}</Text>
      <Anchor href="https://www.github.com/h16nning/super-anki">
        Link to Git Repository
      </Anchor>
    </Stack>
  );
}
