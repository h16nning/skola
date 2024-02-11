import {
  Box,
  Center,
  Input,
  MantineColorScheme,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import { SettingsValues, setSetting, useSetting } from "../../logic/Settings";

export default function SegmentedToggle() {
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Input.Wrapper
      label="Color Scheme Preference"
      description="You can choose between light or dark mode. Alternatively, you can use the color scheme of your system."
    >
      <SegmentedControl
        mt="xs"
        value={colorSchemePreference}
        onChange={(value) => {
          setSetting(
            "colorSchemePreference",
            (value as SettingsValues["colorSchemePreference"]) || "light"
          );
          setColorScheme((value as MantineColorScheme) || "auto");
        }}
        data={[
          {
            value: "light",
            label: (
              <Center>
                <IconSun size={16} />
                <Box fz="xs" fw={600} ml={10}>
                  Light
                </Box>
              </Center>
            ),
          },
          {
            value: "dark",
            label: (
              <Center>
                <IconMoon size={16} />
                <Box fz="xs" fw={600} ml={10}>
                  Dark
                </Box>
              </Center>
            ),
          },
          {
            value: "auto",
            label: (
              <Center>
                <IconSunMoon size={16} />
                <Box fz="xs" fw={600} ml={10}>
                  System
                </Box>
              </Center>
            ),
          },
        ]}
      />
    </Input.Wrapper>
  );
}
