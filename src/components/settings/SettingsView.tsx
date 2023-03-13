import { Stack, Center, Tabs, Anchor } from "@mantine/core";
import React from "react";
import CColorSchemeToggle from "./ColorSchemeToggle";
import {
  IconBraces,
  IconInfoCircle,
  IconPalette,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

export default function SettingsView() {
  return (
    <Center pt="md" pr="md">
      <Stack spacing="xl" w="600px">
        <Tabs orientation="horizontal" defaultValue="General">
          <Tabs.List>
            <Tabs.Tab value="General" icon={<IconSettings />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="Appearance" icon={<IconPalette />}>
              Appearance
            </Tabs.Tab>
            <Tabs.Tab value="Account" icon={<IconUser />}>
              Account
            </Tabs.Tab>
            <Tabs.Tab value="About" icon={<IconInfoCircle />}>
              About
            </Tabs.Tab>
            <Tabs.Tab value="Developer" icon={<IconBraces />}>
              Developer
            </Tabs.Tab>
          </Tabs.List>{" "}
          <Tabs.Panel value="General">General</Tabs.Panel>
          <Tabs.Panel value="Appearance">
            <CColorSchemeToggle />
          </Tabs.Panel>
          <Tabs.Panel value="Account">Change your accont settings</Tabs.Panel>
          <Tabs.Panel value="About">
            This program was made by h16nning. It is in very early development.
            Please check out the{" "}
            <Anchor href="https://www.github.com/h16nning/super-anki">
              git repository
            </Anchor>
            .
          </Tabs.Panel>
          <Tabs.Panel value="Developer">
            This is the developer tab. It will contain extra settings for
            developers.
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Center>
  );
}
