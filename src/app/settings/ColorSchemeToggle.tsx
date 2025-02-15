import { useSetting } from "@/logic/settings/hooks/useSetting";
import { setSetting } from "@/logic/settings/setSetting";
import {
  Box,
  Center,
  Input,
  MantineColorScheme,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import { t } from "i18next";
import { SettingsValues } from "../../logic/settings/Settings";

export default function SegmentedToggle() {
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Input.Wrapper
      label={t("settings.appearance.color-scheme")}
      description={t("settings.appearance.color-scheme-description")}
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
                  {t("settings.appearance.color-scheme-light")}
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
                  {t("settings.appearance.color-scheme-dark")}
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
                  {t("settings.appearance.color-scheme-auto")}
                </Box>
              </Center>
            ),
          },
        ]}
      />
    </Input.Wrapper>
  );
}
