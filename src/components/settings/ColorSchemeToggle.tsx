import { Box, Center, Input, SegmentedControl } from "@mantine/core";
import { IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import { setSetting, useSetting } from "../../logic/Settings";

export default function SegmentedToggle() {
  const colorSchemePreference = useSetting("colorSchemePreference");

  return (
    <Input.Wrapper
      label="Color Scheme Preference"
      description="You can choose between light or dark mode. Alternatively, you can use the color scheme of your system."
    >
      <SegmentedControl
        mt="xs"
        value={colorSchemePreference}
        onChange={(value: "light" | "dark" | "system") =>
          setSetting("colorSchemePreference", value)
        }
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
            value: "system",
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
