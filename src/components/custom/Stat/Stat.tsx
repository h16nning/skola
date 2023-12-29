import classes from "./Stat.module.css";
import React from "react";
import { TablerIconsProps } from "@tabler/icons-react";
import { Group, Paper, Stack, Text } from "@mantine/core";

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
  return (
    <Paper className={classes.stat} bg={color} miw={width ?? "6rem"}>
      <Group align="center" gap="xs" c="white">
        <Icon className={classes.statIcon} />
        <Stack gap="0rem" align="start">
          <Text className={classes.statValue}>{value}</Text>
          <Text className={classes.statName} opacity="0.7">
            {name}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
