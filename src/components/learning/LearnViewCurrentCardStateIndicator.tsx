import React from "react";
import { CardState } from "../../logic/card";
import { Group, Text } from "@mantine/core";
import {
  IconInfoCircle,
  IconSparkles,
  TablerIconsProps,
} from "@tabler/icons-react";
import { swap } from "../../logic/ui";

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
  return (
    <Group
      spacing="0.25rem"
      align="center"
      sx={(theme) => ({
        position: "absolute",
        bottom: "3.5rem",
        color: swap(theme, color, 7, 5),
      })}
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
