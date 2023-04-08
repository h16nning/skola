import React from "react";
import { TablerIconsProps } from "@tabler/icons-react";
import { createStyles, Group, Paper, Stack, Text } from "@mantine/core";
import { swap } from "../../logic/ui";

const useStyles = createStyles((theme) => ({
  stat: {
    padding: "0.75rem",

    borderRadius: theme.radius.sm,
  },
  statIcon: { width: "1.25rem", height: "1.25rem" },
  statValue: { fontWeight: 700, fontSize: theme.fontSizes.md },
  statName: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 400,
  },
}));

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
  const { classes } = useStyles();

  return (
    <Paper
      className={classes.stat}
      sx={(theme) => ({ backgroundColor: swap(theme, color, 4, 9, 0.1) })}
      miw={width ?? "6rem"}
    >
      <Group align="center" spacing="xs" c={color}>
        <Icon className={classes.statIcon} />
        <Stack spacing="0rem" align="start">
          <Text className={classes.statValue}>{value}</Text>
          <Text
            className={classes.statName}
            sx={(theme) => ({ color: swap(theme, color, 9, 3, 0.75) })}
          >
            {name}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
