import { ActionIcon, Group, Stack, Tabs } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CColorSchemeToggle from "./ColorSchemeToggle";
import {
  IconBraces,
  IconChevronLeft,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import GeneralSettingsView from "./GeneralSettingsView";
import { useSetting } from "../../logic/Settings";
import EditingSettingsView from "./EditingSettingsView";
import { useLocation, useNavigate } from "react-router-dom";
import AboutSettingsView from "./AboutSettingsView";
import DatabaseSettingsView from "./DatabaseSettingsView";

export default function SettingsView() {
  const [value, setValue] = useState("General");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/settings") {
      setValue("general");
    } else {
      setValue(location.pathname.split("/")[2]);
    }
  }, [location]);

  const [developerMode] = useSetting("developerMode");

  return (
    <Stack spacing="xl" w="600px">
      <Group>
        <ActionIcon onClick={() => navigate(-1)}>
          <IconChevronLeft />
        </ActionIcon>
      </Group>
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
            value="database"
            icon={<IconDatabase />}
            onClick={() => setValue("database")}
          >
            Database
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
        <Tabs.Panel value="database">
          <DatabaseSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="about">
          <AboutSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="Developer">
          This is the developer tab. It will contain extra settings for
          developers.
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
