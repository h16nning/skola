import { Stack } from "@/components/ui/Stack";
import CColorSchemeToggle from "./ColorSchemeToggle";

export default function AppearanceSettingsView() {
  return (
    <Stack gap="xl" align="start">
      <CColorSchemeToggle />
    </Stack>
  );
}
