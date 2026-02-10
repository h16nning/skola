import { Paper } from "@/components/ui/Paper";
import {
  IconCode,
  IconHighlight,
  IconInfoCircle,
  IconLink,
  IconLinkOff,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
} from "@tabler/icons-react";
import { t } from "i18next";
import Section from "../Section";
import SettingsInput from "../SettingsInput";
import "./EditingSettingsView.css";

const BASE = "editing-settings-view";

export default function EditingSettingsView() {
  return (
    <div className={BASE}>
      <Section title={t("settings.editing.editor-options")}>
        <SettingsInput
          label={t("settings.editing.use-toolbar")}
          description={t("settings.editing.use-toolbar-description")}
          settingsKey="#useToolbar"
          inputType="checkbox"
        />
        <SettingsInput
          label={t("settings.editing.use-bubble-menu")}
          description={t("settings.editing-use-bubble-menu-description")}
          settingsKey="#useBubbleMenu"
          inputType="checkbox"
        />
        <Paper withBorder className={`${BASE}__alert`}>
          <div className={`${BASE}__alert-content`}>
            <IconInfoCircle size={20} className={`${BASE}__alert-icon`} />
            <span className={`${BASE}__alert-text`}>
              {t("settings.editing.markdown-hint")}
            </span>
          </div>
        </Paper>
      </Section>
      <Section title={t("settings.editing.individual-options")}>
        <SettingsInput
          label={<IconStrikethrough size={18} />}
          description={t("settings.editing.show-strikethrough-option")}
          settingsKey="#showStrikethroughOptionInEditor"
          inputType="checkbox"
        />
        <SettingsInput
          label={<IconHighlight size={18} />}
          description={t("settings.editing.show-highlight-option")}
          settingsKey="#showHighlightOptionInEditor"
          inputType="checkbox"
        />
        <SettingsInput
          label={
            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
              <IconList size={18} />
              <IconListNumbers size={18} />
            </div>
          }
          description={t("settings.editing.show-list-option")}
          settingsKey="#showListOptionInEditor"
          inputType="checkbox"
        />
        <SettingsInput
          label={<IconCode size={18} />}
          description={t("settings.editing.show-code-option")}
          settingsKey="#showCodeOptionInEditor"
          inputType="checkbox"
        />
        <SettingsInput
          label={
            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
              <IconSubscript size={18} />
              <IconSuperscript size={18} />
            </div>
          }
          description={t(
            "settings.editing.show-options-for-subscript-and-superscript"
          )}
          settingsKey="#showSubAndSuperScriptOptionInEditor"
          inputType="checkbox"
        />
        <SettingsInput
          label={
            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
              <IconLink size={18} />
              <IconLinkOff size={18} />
            </div>
          }
          description={t("settings.editing.show-link-option")}
          settingsKey="#showLinkOptionInEditor"
          inputType="checkbox"
        />
      </Section>
    </div>
  );
}
