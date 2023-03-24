import React from "react";
import { Stack } from "@mantine/core";
import SettingsInput from "./SettingsInput";
import {
  IconCode,
  IconHighlight,
  IconLink,
  IconLinkOff,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
} from "@tabler/icons-react";

interface EditingSettingsViewProps {}

export default function EditingSettingsView({}: EditingSettingsViewProps) {
  return (
    <Stack
      spacing="xl"
      sx={() => ({
        "& .mantine-Checkbox-label svg": {
          height: "1rem",
          marginRight: "0.4375rem",
        },
      })}
    >
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
    </Stack>
  );
}
