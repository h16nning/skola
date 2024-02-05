import classes from "./Stat.module.css";
import React, { useEffect } from "react";
import { TablerIconsProps } from "@tabler/icons-react";
import { Box, Group, Stack, Text, useComputedColorScheme } from "@mantine/core";

export default function Stat({
  name,
  value,
  icon: Icon,
  color,
  width,
}: {
  value: number | string;
  icon: React.FC<TablerIconsProps>;
  name: string;
  color: string;
  width?: string;
}) {
  const scheme = useComputedColorScheme("light");

  return (
    <Box
      component="div"
      className={classes.stat}
      miw={width ?? "6rem"}
      style={{
        color: `var(--mantine-color-${color}-${scheme === "light" ? 9 : 2})`,
      }}
    >
      <Box
        component="div"
        className={classes.statBackground}
        style={{
          backgroundColor: `var(--mantine-color-${color}-${
            scheme === "light" ? 4 : 7
          })`,
          borderColor: `var(--mantine-color-${color}-${
            scheme === "light" ? 5 : 5
          })`,
        }}
      />
      <Group align="center" gap="xs">
        <Icon className={classes.statIcon} />
        <Stack gap="0rem" align="start">
          <Text className={classes.statValue}>{value}</Text>
          <Text className={classes.statName} opacity="0.7">
            {name}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
