import { Center, Stack, Title } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { t } from "i18next";
import { AppHeaderContent } from "../shell/Header/Header";

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
