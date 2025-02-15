import { Group, Text, ThemeIcon } from "@mantine/core";
import {
  IconBook,
  IconCircleArrowUpRight,
  IconInfoCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { LearnController } from "../../../logic/learn";
import classes from "./RemainingCardsIndicator.module.css";
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
        icon={<IconCircleArrowUpRight />}
      />
      <TinyStat
        value={controller.toReviewCardsNumber}
        color="blue"
        icon={<IconBook />}
      />
      <TinyStat
        value={controller.learnedCardsNumber}
        color="gray"
        icon={<IconInfoCircle />}
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
        variant="transparent"
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
