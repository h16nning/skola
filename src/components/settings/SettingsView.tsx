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
import EditingSettingsView from "./EditingSettingsView/EditingSettingsView";
import { useLocation, useNavigate } from "react-router-dom";
import AboutSettingsView from "./AboutSettingsView";
import DatabaseSettingsView from "./DatabaseSettingsView/DatabaseSettingsView";
import { t } from "i18next";

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
    <Stack gap="xl" w="100%" maw="600px">
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
            leftSection={<IconSettings />}
            onClick={() => setValue("general")}
          >
            {t("settings.general.title")}
          </Tabs.Tab>
          <Tabs.Tab
            value="appearance"
            leftSection={<IconPalette />}
            onClick={() => setValue("appearance")}
          >
            {t("settings.appearance.title")}
          </Tabs.Tab>
          <Tabs.Tab
            value="editing"
            leftSection={<IconPencil />}
            onClick={() => setValue("editing")}
          >
            {t("settings.editing.title")}
          </Tabs.Tab>
          <Tabs.Tab
            value="database"
            leftSection={<IconDatabase />}
            onClick={() => setValue("database")}
          >
            {t("settings.database.title")}
          </Tabs.Tab>
          <Tabs.Tab
            value="about"
            leftSection={<IconInfoCircle />}
            onClick={() => setValue("about")}
          >
            {t("settings.about.title")}
          </Tabs.Tab>
          {developerMode ? (
            <Tabs.Tab
              value="developer"
              leftSection={<IconBraces />}
              onClick={() => setValue("developer")}
            >
              {t("settings.developer.title")}
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
