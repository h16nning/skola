import { NoteType } from "@/logic/note/note";
import { ActionIcon, Group, Kbd, Progress, Tooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult, useStopwatch } from "react-timer-hook";
import { Card } from "../../../logic/card/card";
import { Deck } from "../../../logic/deck/deck";
import { LearnController } from "../../../logic/learn";
import CardMenu from "../../editor/CardMenu";
import RemainingCardsIndicator from "../RemainingCardsIndicator/RemainingCardsIndicator";
import classes from "./LearnView.module.css";

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
      (controller.statistics.ratingsList.length /
        (controller.statistics.ratingsList.length +
          controller.newCardsNumber * 2 +
          controller.toReviewCardsNumber +
          controller.timeCriticalCardsNumber +
          (controller.options.learnAll ? controller.learnedCardsNumber : 0))) *
      100,
    [
      controller.isFinished,
      controller.statistics.ratingsList,
      controller.newCardsNumber,
      controller.toReviewCardsNumber,
      controller.timeCriticalCardsNumber,
      controller.learnedCardsNumber,
      //FIXME
    ]
  );
  return (
    <>
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap" gap="xs">
          <Tooltip
            label={
              <>
                Back to deck <Kbd>d</Kbd>
              </>
            }
          >
            <ActionIcon
              onClick={() => navigate("/deck/" + deck?.id)}
              variant="subtle"
              color="gray"
            >
              <IconX />
            </ActionIcon>
          </Tooltip>
          <Stopwatch />
        </Group>

        <Group justify="flex-end" wrap="nowrap" gap="xs">
          <RemainingCardsIndicator controller={controller} />
          <CardMenu card={currentCard} onDelete={controller.requestNextCard} />
        </Group>
      </Group>
      <Progress
        className={classes.progressBar}
        size="xs"
        value={progress}
        transitionDuration={200}
        radius={0}
        w="100%"
      />
    </>
  );
}

export default LearnViewHeader;
