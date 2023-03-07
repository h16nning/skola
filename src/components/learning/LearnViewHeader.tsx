import React from "react";
import { Button, Group, Text } from "@mantine/core";
import CardMenu from "../editcard/CardMenu";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { Card, CardType } from "../../logic/card";
import { swapMono } from "../../logic/ui";
import { IconX } from "@tabler/icons-react";

interface LearnViewHeaderProps {
  stopwatch: StopwatchResult;
  currentCard: Card<CardType> | null;
  next: Function;
}
function LearnViewHeader({
  stopwatch,
  currentCard,
  next,
}: LearnViewHeaderProps) {
  const navigate = useNavigate();
  return (
    <Group
      position="apart"
      sx={(theme) => ({
        width: "calc(100% +" + theme.spacing.md + ")",
        padding: theme.spacing.sm,
        marginLeft: "-" + theme.spacing.md,
      })}
    >
      <Button
        onClick={() => navigate("/home")}
        variant="subtle"
        color="gray"
        leftIcon={<IconX />}
      >
        Quit Learning
      </Button>
      <Text>{stopwatch.minutes + ":" + stopwatch.seconds}</Text>
      <CardMenu card={currentCard} onDelete={next} />
    </Group>
  );
}

export default LearnViewHeader;
