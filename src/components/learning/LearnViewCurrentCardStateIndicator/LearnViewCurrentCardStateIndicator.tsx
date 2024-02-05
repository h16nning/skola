import classes from "./LearnViewCurrentCardStateIndicator.module.css";
import React from "react";
import { CardState } from "../../../logic/card";
import { Group, Text, useMantineTheme } from "@mantine/core";
import {
  IconInfoCircle,
  IconSparkles,
  TablerIconsProps,
} from "@tabler/icons-react";

interface LearnViewCurrentCardStateIndicatorProps {
  currentCardState: CardState | undefined;
}

function Indicator({
  color,
  icon: Icon,
  text,
}: {
  color: string;
  icon: React.FC<TablerIconsProps>;
  text: string;
}) {
  const theme = useMantineTheme();
  return (
    <Group
      className={classes.indicator}
      gap="0.25rem"
      align="center"
      style={{
        position: "absolute",
        top: "-3rem",
        left: 0,
        height: "1.5rem",
        //FIXME: This is a wrong way of using the colorScheme.
        color: `var(--mantine-color-${color}-strong`,
      }}
    >
      <Icon size={16} />
      <Text fz="sm" fw={500}>
        {text}
      </Text>
    </Group>
  );
}

export default function LearnViewCurrentCardStateIndicator({
  currentCardState,
}: LearnViewCurrentCardStateIndicatorProps) {
  if (currentCardState === undefined) {
    return null;
  }
  return {
    new: <Indicator color="grape" icon={IconSparkles} text="New card" />,
    learned: (
      <Indicator
        color="blue"
        icon={IconInfoCircle}
        text="You already know this card"
      />
    ),
    learning: null,
    due: null,
  }[currentCardState];
}
