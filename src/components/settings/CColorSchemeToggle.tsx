import {
  useMantineColorScheme,
  SegmentedControl,
  Center,
  Box,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function SegmentedToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(value: "light" | "dark") => toggleColorScheme(value)}
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
      ]}
    />
  );
}
