import { Center, Stack, Tabs, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CColorSchemeToggle from "./ColorSchemeToggle";
import {
  IconBolt,
  IconBraces,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import GeneralSettingsView from "./GeneralSettingsView";
import { useSetting } from "../../logic/Settings";
import EditingSettingsView from "./EditingSettingsView/EditingSettingsView";
import { useLocation } from "react-router-dom";
import AboutSettingsView from "./AboutSettingsView";
import DatabaseSettingsView from "./DatabaseSettingsView/DatabaseSettingsView";
import { t } from "i18next";
import LearnSettingsView from "./LearnSettingsView";
import { AppHeaderContent } from "../Header/Header";

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

  const [developerMode] = useSetting("developerMode");

  return (
    <Stack gap="xl" w="100%" maw="600px">
      <AppHeaderContent>
        <Center>
          <Title order={3}>{t("settings.page-title")}</Title>
        </Center>
      </AppHeaderContent>
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
            value="learn"
            leftSection={<IconBolt />}
            onClick={() => setValue("learn")}
          >
            {t("settings.learn.title")}
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
        <Tabs.Panel value="learn">
          <LearnSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="database">
          <DatabaseSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="about">
          <AboutSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="Developer">
          {t("settings.developer.description")}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
