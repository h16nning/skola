import { Group } from "@/components/ui/Group";
import { Text } from "@/components/ui/Text";
import {
  IconBook,
  IconCircleArrowUpRight,
  IconInfoCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { LearnController } from "../../../logic/learn";
import "./RemainingCardsIndicator.css";

const BASE_URL = "remaining-cards-indicator";

interface RemainingCardsIndicatorProps {
  controller: LearnController;
}

export default function RemainingCardsIndicator({
  controller,
}: RemainingCardsIndicatorProps) {
  return (
    <Group align="end" gap="xs" className={BASE_URL} wrap="nowrap">
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
}: {
  value: number;
  color: string;
  icon: ReactNode;
}) {
  const colorMap: Record<string, string> = {
    grape: "var(--theme-fuchsia-700)",
    orange: "var(--theme-orange-700)",
    blue: "var(--theme-sky-700)",
    gray: "var(--theme-neutral-600)",
  };

  const iconColor = colorMap[color] || "var(--theme-neutral-600)";

  return (
    <Group gap="xs" wrap="nowrap" style={{ color: iconColor }}>
      <div className={`${BASE_URL}__icon`} style={{ color: iconColor }}>
        {icon}
      </div>
      <Text size="sm" weight="semibold" style={{ color: iconColor }}>
        {value}
      </Text>
    </Group>
  );
}
