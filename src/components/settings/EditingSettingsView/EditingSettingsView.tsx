import classes from "./EditingSettingsView.module.css";
import React from "react";
import { Alert, Stack } from "@mantine/core";
import SettingsInput from "../SettingsInput";
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
import Section from "../Section";

interface EditingSettingsViewProps {}

export default function EditingSettingsView({}: EditingSettingsViewProps) {
  return (
    <Stack className={classes.container} gap="xl">
      <Section title="Editor">
        <SettingsInput
          label="Use toolbar"
          description={
            "Always show a toolbar with formatting options above the editor"
          }
          settingsKey="useToolbar"
          inputType={"checkbox"}
        />
        <SettingsInput
          label="Use inline menu"
          description={"Only show formatting options when text is selected"}
          settingsKey="useBubbleMenu"
          inputType={"checkbox"}
        />
        <Alert color="gray" icon={<IconInfoCircle />}>
          You can also use keyboard shortcuts and basic markdown syntax to
          format text.
        </Alert>
      </Section>
      <Section title="Individual options">
        <SettingsInput
          label={<IconStrikethrough />}
          description={"Show strikethrough option"}
          settingsKey="showStrikethroughOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={<IconHighlight />}
          description={"Show highlight option"}
          settingsKey="showHighlightOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconList /> <IconListNumbers />
            </>
          }
          description={"Show options for lists"}
          settingsKey="showListOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={<IconCode />}
          description={"Show code option"}
          settingsKey="showCodeOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconSubscript />
              <IconSuperscript />
            </>
          }
          description={"Show options for subscript and superscript"}
          settingsKey="showSubAndSuperScriptOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconLink />
              <IconLinkOff />
            </>
          }
          description={"Show options for links"}
          settingsKey="showLinkOptionInEditor"
          inputType={"checkbox"}
        />
      </Section>
    </Stack>
  );
}
