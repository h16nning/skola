import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Progress } from "@/components/ui/Progress";
import { Tooltip } from "@/components/ui/Tooltip";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { Card } from "@/logic/card/card";
import { Deck } from "@/logic/deck/deck";
import { LearnController } from "@/logic/learn";
import { NoteType } from "@/logic/note/note";
import { IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult, useStopwatch } from "react-timer-hook";
import CardMenu from "../../editor/CardMenu";
import RemainingCardsIndicator from "../RemainingCardsIndicator/RemainingCardsIndicator";
import "./LearnViewHeader.css";

const BASE = "learn-view-header";

export let stopwatchResult: StopwatchResult;

function Stopwatch() {
  const stopwatch = useStopwatch({ autoStart: true });

  useEffect(() => {
    stopwatchResult = stopwatch;
  }, [stopwatch]);

  return <></>;
}

interface LearnViewHeaderProps {
  currentCard: Card<NoteType> | undefined;
  controller: LearnController;
  deck?: Deck;
}

function LearnViewHeader({
  currentCard,
  controller,
  deck,
}: LearnViewHeaderProps) {
  const navigate = useNavigate();

  useHotkeys([["d", () => navigate("/deck/" + deck?.id)]]);

  const progress = useMemo(
    () =>
      controller.isFinished
        ? 100
        : (controller.statistics.ratingsList.length /
            (+1 +
              controller.statistics.ratingsList.length +
              controller.newCardsNumber * 2 +
              controller.toReviewCardsNumber +
              controller.timeCriticalCardsNumber +
              (controller.options.learnAll
                ? controller.learnedCardsNumber
                : 0))) *
          100,
    [
      controller.isFinished,
      controller.statistics.ratingsList,
      controller.newCardsNumber,
      controller.toReviewCardsNumber,
      controller.timeCriticalCardsNumber,
      controller.learnedCardsNumber,
    ]
  );

  return (
    <>
      <div className={BASE}>
        <div className={BASE + "__left-group"}>
          <Tooltip
            position="right"
            label={
              <>
                {t("learning.back-to-deck")} <Kbd>d</Kbd>
              </>
            }
          >
            <IconButton
              onClick={() => navigate("/deck/" + deck?.id)}
              variant="subtle"
            >
              <IconX />
            </IconButton>
          </Tooltip>
          <Stopwatch />
        </div>

        <div className={BASE + "__right-group"}>
          <RemainingCardsIndicator controller={controller} />
          <CardMenu card={currentCard} onDelete={controller.requestNextCard} />
        </div>
      </div>
      <Progress
        className={BASE + "__progress-bar"}
        size="xs"
        value={progress}
        style={{ width: "100%", borderRadius: 0 }}
      />
    </>
  );
}

export default LearnViewHeader;
