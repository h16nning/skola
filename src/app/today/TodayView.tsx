import { Center, Stack, Title } from "@mantine/core";
import { t } from "i18next";
import React from "react";
import { AppHeaderContent } from "../shell/Header/Header";
import { useDocumentTitle } from "@mantine/hooks";

function TodayView({}: {}) {
  useDocumentTitle(`${t("today.title")} | Skola`);
  return (
    <Stack>
      <AppHeaderContent>
        <Title order={3}>
          <Center>{t("today.title")}</Center>
        </Title>
      </AppHeaderContent>
      The today view is a planned feature. Here you will be provided a feed of
      upcoming decks that need to be reviewed.
    </Stack>
  );
}

export default TodayView;
