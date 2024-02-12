import { Center, Stack, Tabs, Title } from "@mantine/core";
import {
  IconBolt,
  IconBraces,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSetting } from "../../logic/Settings";
import { AppHeaderContent } from "../Header/Header";
import AboutSettingsView from "./AboutSettingsView";
import AppearanceSettingsView from "./AppearanceSettingsView";
import DatabaseSettingsView from "./DatabaseSettingsView/DatabaseSettingsView";
import EditingSettingsView from "./EditingSettingsView/EditingSettingsView";
import GeneralSettingsView from "./GeneralSettingsView";
import LearnSettingsView from "./LearnSettingsView";

export default function SettingsView() {
  const [developerMode] = useSetting("developerMode");
  const navigate = useNavigate();
  const { section } = useParams();

  return (
    <Stack gap="xl" w="100%" maw="600px">
      <AppHeaderContent>
        <Center>
          <Title order={3}>{t("settings.title")}</Title>
        </Center>
      </AppHeaderContent>
      <Tabs
        orientation="horizontal"
        variant="pills"
        value={section}
        defaultValue={"general"}
        onChange={(value) => navigate(`/settings/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconSettings />}>
            {t("settings.general.title")}
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconPalette />}>
            {t("settings.appearance.title")}
          </Tabs.Tab>
          <Tabs.Tab value="editing" leftSection={<IconPencil />}>
            {t("settings.editing.title")}
          </Tabs.Tab>
          <Tabs.Tab value="learn" leftSection={<IconBolt />}>
            {t("settings.learn.title")}
          </Tabs.Tab>
          <Tabs.Tab value="database" leftSection={<IconDatabase />}>
            {t("settings.database.title")}
          </Tabs.Tab>
          <Tabs.Tab value="about" leftSection={<IconInfoCircle />}>
            {t("settings.about.title")}
          </Tabs.Tab>
          {developerMode ? (
            <Tabs.Tab value="developer" leftSection={<IconBraces />}>
              {t("settings.developer.title")}
            </Tabs.Tab>
          ) : null}
        </Tabs.List>
        <Tabs.Panel value="general">
          <GeneralSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="appearance">
          <AppearanceSettingsView />
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
