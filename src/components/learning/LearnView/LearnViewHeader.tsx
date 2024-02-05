import React, { useEffect, useMemo } from "react";
import { ActionIcon, Group, Progress, Text } from "@mantine/core";
import CardMenu from "../../editcard/CardMenu";
import { useNavigate } from "react-router-dom";
import { StopwatchResult, useStopwatch } from "react-timer-hook";
import { Card, CardType } from "../../../logic/card";
import { IconX } from "@tabler/icons-react";
import { LearnController } from "../../../logic/learn";
import { getCounterString } from "../../../logic/timeUtils";
import { useDebouncedValue } from "@mantine/hooks";

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
      controller.learningIsFinished
        ? 100
        : (controller.repetitionList.length /
            (1 +
              controller.repetitionList.length +
              controller.learnedCardsLength +
              controller.newCardsLength +
              controller.learningQueueLength * 2)) *
          100,
    [
      controller.learningIsFinished,
      controller.repetitionList,
      controller.learnedCardsLength,
      controller.newCardsLength,
      controller.learningQueueLength,
    ]
  );
  const [debouncedProgress] = useDebouncedValue(progress, 100);
  return (
    <div>
      <Group justify="space-between" pb="md" wrap="nowrap">
        <ActionIcon
          onClick={() => navigate("/home")}
          variant="subtle"
          color="gray"
        >
          <IconX />
        </ActionIcon>
        <Stopwatch />
        <Progress
          size="md"
          value={debouncedProgress}
          transitionDuration={200}
          radius="md"
          w="100%"
        />
        <Group w="10%" justify="flex-end">
          <CardMenu card={currentCard} onDelete={controller.nextCard} />
        </Group>
      </Group>
    </div>
  );
}

export default LearnViewHeader;
