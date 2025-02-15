import { Stack } from "@mantine/core";
import CColorSchemeToggle from "./ColorSchemeToggle";

export default function AppearanceSettingsView() {
  return (
    <Stack gap="xl" align="start">
      <CColorSchemeToggle />
    </Stack>
  );
}
