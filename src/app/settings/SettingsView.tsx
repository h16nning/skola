import AppHeaderTitle from "@/components/AppHeaderTitle/AppHeaderTitle";
import { Tabs } from "@/components/ui/Tabs";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import {
  IconBolt,
  IconBraces,
  IconCloud,
  IconDatabase,
  IconInfoCircle,
  IconPalette,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeaderContent } from "../shell/Header/Header";
import AboutSettingsView from "./AboutSettingsView";
import AppearanceSettingsView from "./AppearanceSettingsView";
import CloudSettingsView from "./CloudSettingsView";
import DatabaseSettingsView from "./DatabaseSettingsView/DatabaseSettingsView";
import EditingSettingsView from "./EditingSettingsView/EditingSettingsView";
import GeneralSettingsView from "./GeneralSettingsView";
import LearnSettingsView from "./LearnSettingsView";
import "./SettingsView.css";

const BASE = "settings-view";

export default function SettingsView() {
  const [developerMode] = useSetting("#developerMode");
  const navigate = useNavigate();
  const { section } = useParams();

  const [activeSection, setActiveSection] = useState(section || "general");

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  const handleTabChange = (value: string) => {
    setActiveSection(value);
    navigate(`/settings/${value}`);
  };

  return (
    <div className={BASE}>
      <AppHeaderContent>
        <AppHeaderTitle>{t("settings.title")}</AppHeaderTitle>
      </AppHeaderContent>
      <Tabs
        variant="pills"
        value={activeSection}
        defaultValue="general"
        onChange={handleTabChange}
      >
        <Tabs.List>
          <Tabs.Tab value="general">
            <IconSettings size={18} />
            {t("settings.general.title")}
          </Tabs.Tab>
          <Tabs.Tab value="appearance">
            <IconPalette size={18} />
            {t("settings.appearance.title")}
          </Tabs.Tab>
          <Tabs.Tab value="editing">
            <IconPencil size={18} />
            {t("settings.editing.title")}
          </Tabs.Tab>
          <Tabs.Tab value="learn">
            <IconBolt size={18} />
            {t("settings.learn.title")}
          </Tabs.Tab>
          <Tabs.Tab value="database">
            <IconDatabase size={18} />
            {t("settings.database.title")}
          </Tabs.Tab>
          <Tabs.Tab value="cloud">
            <IconCloud size={18} />
            {t("settings.cloud.title")}
          </Tabs.Tab>
          <Tabs.Tab value="about">
            <IconInfoCircle size={18} />
            {t("settings.about.title")}
          </Tabs.Tab>
          {developerMode && (
            <Tabs.Tab value="developer">
              <IconBraces size={18} />
              {t("settings.developer.title")}
            </Tabs.Tab>
          )}
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
        <Tabs.Panel value="cloud">
          <CloudSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="about">
          <AboutSettingsView />
        </Tabs.Panel>
        <Tabs.Panel value="developer">
          {t("settings.developer.description")}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
