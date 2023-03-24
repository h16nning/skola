import { Anchor, Stack, Tabs } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CColorSchemeToggle from "./ColorSchemeToggle";
import {
  IconBraces,
  IconInfoCircle,
  IconPalette,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import GeneralSettingsView from "./GeneralSettingsView";
import { useSetting } from "../../logic/Settings";
import EditingSettingsView from "./EditingSettingsView";
import { useLocation } from "react-router-dom";

export default function SettingsView() {
  const [value, setValue] = useState("General");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/settings") {
      setValue("general");
    } else {
      setValue(location.pathname.split("/")[2]);
    }
  }, [location]);

  const developerMode = useSetting("developerMode");

  return (
    <Stack spacing="xl" w="600px">
      <Tabs
        orientation="horizontal"
        defaultValue="General"
        variant="pills"
        value={value}
      >
        <Tabs.List>
          <Tabs.Tab
            value="general"
            icon={<IconSettings />}
            onClick={() => setValue("general")}
          >
            General
          </Tabs.Tab>
          <Tabs.Tab
            value="appearance"
            icon={<IconPalette />}
            onClick={() => setValue("appearance")}
          >
            Appearance
          </Tabs.Tab>
          <Tabs.Tab
            value="editing"
            icon={<IconPencil />}
            onClick={() => setValue("editing")}
          >
            Editing
          </Tabs.Tab>
          <Tabs.Tab
            value="about"
            icon={<IconInfoCircle />}
            onClick={() => setValue("about")}
          >
            About
          </Tabs.Tab>
          {developerMode ? (
            <Tabs.Tab
              value="developer"
              icon={<IconBraces />}
              onClick={() => setValue("developer")}
            >
              Developer
            </Tabs.Tab>
          ) : null}
        </Tabs.List>{" "}
        <Tabs.Panel value="general">
          <GeneralSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="appearance">
          <CColorSchemeToggle />
        </Tabs.Panel>
        <Tabs.Panel value="editing">
          <EditingSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="about">
          This program was made by h16nning. It is in very early development.
          Please check out the{" "}
          <Anchor href="https://www.github.com/h16nning/super-anki">
            git repository
          </Anchor>
        </Tabs.Panel>
        <Tabs.Panel value="Developer">
          This is the developer tab. It will contain extra settings for
          developers.
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
