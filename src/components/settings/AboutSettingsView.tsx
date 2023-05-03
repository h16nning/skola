import React from "react";
import { Anchor, Stack, Text } from "@mantine/core";

export default function AboutSettingsView() {
  return (
    <>
      <Stack spacing="xl" align="start">
        <Text size="sm">
          This program was made by Henning Thomas Flath, a student from Germany
          studying medicine. Skola is in early development. You may encounter
          bugs. If you do, I'd be very pleased if you reported them on the{" "}
          <Anchor href="https://www.github.com/h16nning/super-anki">
            git repository
          </Anchor>
          .
        </Text>
      </Stack>
    </>
  );
}
