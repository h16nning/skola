import React, { useEffect, useMemo } from "react";
import { ActionIcon, Group, Progress, Text } from "@mantine/core";
import CardMenu from "../editcard/CardMenu";
import { useNavigate } from "react-router-dom";
import { StopwatchResult, useStopwatch } from "react-timer-hook";
import { Card, CardType } from "../../logic/card";
import { IconX } from "@tabler/icons-react";
import { LearnController } from "../../logic/learn";
import { getCounterString } from "../../logic/timeUtils";

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
      (controller.repetitionCount /
        (1 +
          controller.repetitionCount +
          controller.learnedCardsLength +
          controller.newCardsLength +
          controller.learningQueueLength * 2)) *
      100,
    [
      controller.repetitionCount,
      controller.learnedCardsLength,
      controller.newCardsLength,
      controller.learningQueueLength,
    ]
  );
  return (
    <Group position="apart" noWrap>
      <Group w="10%" noWrap>
        <ActionIcon
          onClick={() => navigate("/home")}
          variant="subtle"
          color="gray"
        >
          <IconX />
        </ActionIcon>
        <Stopwatch />
      </Group>
      <Progress size="md" value={progress} w="50%" />
      <Group w="10%" position="right">
        <CardMenu card={currentCard} onDelete={controller.nextCard} />
      </Group>
    </Group>
  );
}

export default LearnViewHeader;
