import { Stack } from "@/components/ui/Stack";
import CColorSchemeToggle from "./ColorSchemeToggle";
import DensityToggle from "./DensityToggle";

export default function AppearanceSettingsView() {
  return (
    <Stack gap="xl" align="start">
      <CColorSchemeToggle />
      <DensityToggle />
    </Stack>
  );
}
