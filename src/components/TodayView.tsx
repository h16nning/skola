import React from "react";
import { Center, Stack, Title } from "@mantine/core";
import { AppHeaderContent } from "./Header/Header";
import { t } from "i18next";

function TodayView({}: {}) {
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
