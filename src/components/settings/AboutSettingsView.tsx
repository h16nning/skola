import React from "react";
import { Anchor, Stack, Text } from "@mantine/core";

export default function AboutSettingsView() {
  return (
    <>
      <Stack gap="xl" align="start">
        <Text size="sm">
          This program was made by a student from Germany studying medicine.
          Skola is in early development. You may encounter bugs. If you do, I'd
          be very pleased if you reported them on the{" "}
          <Anchor href="https://www.github.com/h16nning/super-anki">
            git repository
          </Anchor>
          .
        </Text>
        <Text size="sm">
          Henning Flath
          <br />
          skola.cards@gmail.com
          <br />
          Rudolf-Harbig-Weg 2b
          <br />
          48149 Münster
          <br />
          Deutschland
          <br />
        </Text>
      </Stack>
    </>
  );
}
