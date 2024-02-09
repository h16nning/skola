import classes from "./RemainingCardsIndicator.module.css";
import React from "react";
import { LearnController } from "../../../logic/learn";
import { Group, Text } from "@mantine/core";
interface RemainingCardsIndicatorProps {
  controller: LearnController;
}

export default function RemainingCardsIndicator({
  controller,
}: RemainingCardsIndicatorProps) {
  return (
    <Group align="end" gap="xs" className={classes.container} wrap="nowrap">
      <Text c="mantine-color" className={classes.label}>
        {controller.newCardsNumber} new cards
      </Text>
      <Text c="orange" className={classes.label}>
        {controller.timeCriticalCardsNumber} cards to do now
      </Text>
      <Text c="blue" className={classes.label}>
        {controller.toReviewCardsNumber} cards to review
      </Text>
      <Text c="gray" className={classes.label}>
        {controller.learnedCardsNumber} cards learned
      </Text>
    </Group>
  );
}
