import React, { useEffect, useMemo } from "react";
import classes from "./LearnView.module.css";
import { ActionIcon, Group, Progress, Stack, Text } from "@mantine/core";
import CardMenu from "../../editcard/CardMenu";
import { useNavigate } from "react-router-dom";
import { StopwatchResult, useStopwatch } from "react-timer-hook";
import { Card, CardType } from "../../../logic/card";
import { IconX } from "@tabler/icons-react";
import { LearnController } from "../../../logic/learn";
import { getCounterString } from "../../../logic/timeUtils";
import { useDebouncedValue } from "@mantine/hooks";
import RemainingCardsIndicator from "../RemainingCardsIndicator/RemainingCardsIndicator";

export let stopwatchResult: StopwatchResult;

function Stopwatch() {
  const stopwatch = useStopwatch({ autoStart: true });

  useEffect(() => {
    stopwatchResult = stopwatch;
  }, [stopwatch]);

  return <Text ff="monospace">{getCounterString(stopwatch)}</Text>;
}

interface LearnViewHeaderProps {
  currentCard: Card<CardType> | undefined;
  controller: LearnController;
}

function LearnViewHeader({ currentCard, controller }: LearnViewHeaderProps) {
  const navigate = useNavigate();
  const progress = useMemo(
    () =>
      (controller.ratingsList.length /
        (controller.ratingsList.length +
          controller.newCardsNumber * 2 +
          controller.toReviewCardsNumber +
          controller.timeCriticalCardsNumber +
          (controller.options.learnAll ? controller.learnedCardsNumber : 0))) *
      100,
    [
      controller.isFinished,
      controller.ratingsList,
      controller.newCardsNumber,
      controller.toReviewCardsNumber,
      controller.timeCriticalCardsNumber,
      controller.learnedCardsNumber,
      //FIXME
    ]
  );
  const [debouncedProgress] = useDebouncedValue(progress, 100);
  return (
    <Stack className={classes.headerContainer} gap={0}>
      <Group
        justify="space-between"
        pb="md"
        wrap="nowrap"
        className={classes.headerGroup}
      >
        <Group>
          <ActionIcon
            onClick={() => navigate("/home")}
            variant="subtle"
            color="gray"
          >
            <IconX />
          </ActionIcon>
          <Stopwatch />
        </Group>

        <Group justify="flex-end" wrap="nowrap">
          <RemainingCardsIndicator controller={controller} />
          <CardMenu card={currentCard} onDelete={controller.requestNextCard} />
        </Group>
      </Group>
      <Progress
        size="xs"
        value={progress}
        transitionDuration={200}
        radius={0}
        w="100%"
      />
    </Stack>
  );
}

export default LearnViewHeader;
