import React from "react";
import { Center, Stack, Title } from "@mantine/core";
import { AppHeaderContent } from "./Header/Header";

function TodayView({}: {}) {
  return (
    <Stack>
      <AppHeaderContent>
        <Title order={3}>
          <Center>Today</Center>
        </Title>
      </AppHeaderContent>
      The today view is a planned feature. Here you will be provided a feed of
      upcoming decks that need to be reviewed.
    </Stack>
  );
}

export default TodayView;
