import { LearnController } from "@/logic/learn";
import {
  IconBook,
  IconCircleArrowUpRight,
  IconInfoCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import "./RemainingCardsIndicator.css";

const BASE = "remaining-cards-indicator";

interface RemainingCardsIndicatorProps {
  controller: LearnController;
}

export default function RemainingCardsIndicator({
  controller,
}: RemainingCardsIndicatorProps) {
  return (
    <div className={BASE}>
      <TinyStat
        value={controller.newCardsNumber}
        color="fuchsia"
        icon={<IconSparkles />}
      />
      <TinyStat
        value={controller.timeCriticalCardsNumber}
        color="orange"
        icon={<IconCircleArrowUpRight />}
      />
      <TinyStat
        value={controller.toReviewCardsNumber}
        color="sky"
        icon={<IconBook />}
      />
      <TinyStat
        value={controller.learnedCardsNumber}
        color="neutral"
        icon={<IconInfoCircle />}
      />
    </div>
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
    fuchsia: "var(--theme-fuchsia-700)",
    orange: "var(--theme-orange-700)",
    sky: "var(--theme-sky-700)",
    neutral: "var(--theme-neutral-600)",
  };

  const iconColor = colorMap[color] || "var(--theme-neutral-600)";

  return (
    <div className={`${BASE}__tiny-stat`}>
      <div className={`${BASE}__icon`} style={{ color: iconColor }}>
        {icon}
      </div>
      <span className={`${BASE}__value`} style={{ color: iconColor }}>
        {value}
      </span>
    </div>
  );
}
