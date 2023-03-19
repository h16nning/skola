import React from "react";
import { ActionIcon, Group, Progress, Text } from "@mantine/core";
import CardMenu from "../editcard/CardMenu";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { Card, CardType } from "../../logic/card";
import { IconX } from "@tabler/icons-react";

interface LearnViewHeaderProps {
  stopwatch: StopwatchResult;
  currentCard: Card<CardType> | undefined;
  next: Function;
}
function LearnViewHeader({
  stopwatch,
  currentCard,
  next,
}: LearnViewHeaderProps) {
  const navigate = useNavigate();
  return (
    <Group position="apart">
      <Group w="10rem" noWrap>
        <ActionIcon
          onClick={() => navigate("/home")}
          variant="subtle"
          color="gray"
        >
          <IconX />
        </ActionIcon>
        <Text ff="monospace">
          {stopwatch.minutes + ":" + stopwatch.seconds}
        </Text>
      </Group>
      <Progress size="sm" value={70} w="50%" />
      <Group w="10rem" position="right">
        <CardMenu card={currentCard} onDelete={next} />
      </Group>
    </Group>
  );
}

export default LearnViewHeader;
