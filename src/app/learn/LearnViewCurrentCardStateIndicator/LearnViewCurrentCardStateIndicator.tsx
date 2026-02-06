import { Group } from "@/components/ui/Group";
import { Text } from "@/components/ui/Text";
import {
  IconBook,
  IconCircleArrowUpRight,
  IconInfoCircle,
  IconProps,
  IconSparkles,
} from "@tabler/icons-react";
import { Card as Model } from "fsrs.js";
import { State } from "fsrs.js";
import React, { useCallback } from "react";
import "./LearnViewCurrentCardStateIndicator.css";

const BASE = "learn-view-current-card-state-indicator";

interface LearnViewCurrentCardStateIndicatorProps {
  currentCardModel: Model | undefined;
}

function Indicator({
  color,
  icon: Icon,
  text,
}: {
  color: string;
  icon: React.FC<IconProps>;
  text: string;
}) {
  const colorMap: Record<string, string> = {
    fuchsia: "var(--theme-fuchsia-700)",
    orange: "var(--theme-orange-700)",
    sky: "var(--theme-sky-700)",
    gray: "var(--theme-neutral-600)",
  };

  const iconColor = colorMap[color] || "var(--theme-neutral-600)";

  return (
    <Group
      className={BASE}
      gap="xs"
      align="center"
      style={{ color: iconColor, alignSelf: "flex-start" }}
    >
      <Icon size={16} />
      <Text size="sm" weight="medium">
        {text}
      </Text>
    </Group>
  );
}

export default function LearnViewCurrentCardStateIndicator({
  currentCardModel,
}: LearnViewCurrentCardStateIndicatorProps) {
  const indicator = useCallback(() => {
    if (currentCardModel === undefined) {
      return;
    }
    if (currentCardModel.state === State.New) {
      return <Indicator color="fuchsia" icon={IconSparkles} text="New card" />;
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
      return <Indicator color="sky" icon={IconBook} text="Review card" />;
    } else {
      return (
        <Indicator
          color="neutral"
          icon={IconInfoCircle}
          text="Already learned"
        />
      );
    }
  }, [currentCardModel]);

  if (currentCardModel === undefined) {
    return null;
  }

  return indicator();
}
