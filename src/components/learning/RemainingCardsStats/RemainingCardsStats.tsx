import classes from "./RemainingCardsStats.module.css";
import React from "react";
import { LearnController } from "../../../logic/learn";
import { Group, Text } from "@mantine/core";

interface RemainingCardsStatsProps {
  controller: LearnController;
}

export default function RemainingCardsStats({
  controller,
}: RemainingCardsStatsProps) {
  return (
    <Group align="end" gap="xs" className={classes.container}>
      <Text c="blue" className={classes.label}>
        {controller.newCardsLength} new
      </Text>
      <Text c="red" className={classes.label}>
        {controller.learningQueueLength} learn
      </Text>
      <Text c="teal" className={classes.label}>
        {controller.learnedCardsLength} review
      </Text>
    </Group>
  );
}
