import classes from "./LearnViewCurrentCardStateIndicator.module.css";
import React, { useCallback } from "react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { Card as Model } from "fsrs.js";
import {
  IconBook,
  IconCircleArrowUpRight,
  IconInfoCircle,
  IconSparkles,
  TablerIconsProps,
} from "@tabler/icons-react";
import { State } from "fsrs.js";

interface LearnViewCurrentCardStateIndicatorProps {
  currentCardModel: Model | undefined;
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
  currentCardModel,
}: LearnViewCurrentCardStateIndicatorProps) {
  if (currentCardModel === undefined) {
    return null;
  }
  const indicator = useCallback(() => {
    if (currentCardModel.state === State.New) {
      return <Indicator color="grape" icon={IconSparkles} text="New card" />;
    } else if (
      currentCardModel.state === State.Learning ||
      currentCardModel.state === State.Relearning
    ) {
      return (
        <Indicator
          color="orange"
          icon={IconCircleArrowUpRight}
          text="Learn card"
        />
      );
    } else if (
      currentCardModel.state === State.Review &&
      currentCardModel.due <= new Date(Date.now())
    ) {
      return <Indicator color="blue" icon={IconBook} text="Review card" />;
    } else {
      return (
        <Indicator color="gray" icon={IconInfoCircle} text="Already learned" />
      );
    }
  }, [currentCardModel]);

  return indicator();
}
