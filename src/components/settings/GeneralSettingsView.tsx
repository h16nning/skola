import React from "react";
import { Stack } from "@mantine/core";
import SettingsInput from "./SettingsInput";

export default function GeneralSettingsView() {
  return (
    <Stack spacing="xl">
      <SettingsInput
        label={"Name"}
        description="This name will be used to customize user experience"
        settingsKey={"name"}
        inputType={"text"}
      />
      <SettingsInput
        label={"Enable Developer Mode"}
        description={
          "This will enable additional options for debugging and creating custom plugins and themes."
        }
        settingsKey="developerMode"
        inputType={"switch"}
      ></SettingsInput>
    </Stack>
  );
}
