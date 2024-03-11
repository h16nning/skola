import { Box, Group, Stack, Text, useComputedColorScheme } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import React from "react";
import classes from "./Stat.module.css";

export default function Stat({
  name,
  value,
  icon: Icon,
  color,
}: {
  value: number | string;
  icon: React.FC<TablerIconsProps>;
  name: string;
  color: string;
}) {
  const scheme = useComputedColorScheme("light");

  return (
    <Box
      component="div"
      className={classes.stat}
      style={{
        color: `var(--mantine-color-${color}-${scheme === "light" ? 9 : 2})`,
        backgroundColor: `var(--mantine-color-${color}-light)`,
        borderColor: `var(--mantine-color-${color}-light)`,
      }}
    >
      <Stack gap="0" w="100%" align="center">
        <Text truncate="end" className={classes.statValue}>
          {value}
        </Text>
        <Group align="center" gap="4px" wrap="nowrap" opacity={0.8}>
          <Icon className={classes.statIcon} />
          <Text className={classes.statName}>{name}</Text>
        </Group>
      </Stack>
    </Box>
  );
}
