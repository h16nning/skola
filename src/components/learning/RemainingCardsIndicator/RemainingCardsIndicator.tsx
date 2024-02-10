import classes from "./RemainingCardsIndicator.module.css";
import React, { ReactNode } from "react";
import { LearnController } from "../../../logic/learn";
import { Group, Text, ThemeIcon } from "@mantine/core";
import { Icon, IconBook, IconClock, IconSparkles } from "@tabler/icons-react";
interface RemainingCardsIndicatorProps {
  controller: LearnController;
}

export default function RemainingCardsIndicator({
  controller,
}: RemainingCardsIndicatorProps) {
  return (
    <Group align="end" gap="xs" className={classes.container} wrap="nowrap">
      <TinyStat
        value={controller.newCardsNumber}
        color="grape"
        icon={<IconSparkles />}
      />
      <TinyStat
        value={controller.timeCriticalCardsNumber}
        color="orange"
        icon={<IconClock />}
      />
      <TinyStat
        value={controller.toReviewCardsNumber}
        color="blue"
        icon={<IconBook />}
      />
      <TinyStat
        value={controller.learnedCardsNumber}
        color="gray"
        icon={<IconBook />}
      />
    </Group>
  );
}

export function TinyStat({
  value,
  color,
  icon,
}: { value: number; color: string; icon: ReactNode }) {
  return (
    <Group
      gap="0.125rem"
      wrap="nowrap"
      style={{
        color: `var(--mantine-color-${color}-strong`,
      }}
    >
      <ThemeIcon
        style={{ color: `var(--mantine-color-${color}-strong` }}
        variant="white"
        size={20}
      >
        {icon}
      </ThemeIcon>
      <Text
        fz="sm"
        fw={600}
        style={{ color: `var(--mantine-color-${color}-strong)` }}
      >
        {value}
      </Text>
    </Group>
  );
}
