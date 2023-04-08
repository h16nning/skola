import React from "react";
import { LearnController } from "../../logic/learn";
import { createStyles, Group, Text } from "@mantine/core";
import { swapMono } from "../../logic/ui";

interface RemainingCardsStatsProps {
  controller: LearnController;
}

export default function RemainingCardsStats({
  controller,
}: RemainingCardsStatsProps) {
  const { classes } = createStyles((theme) => ({
    container: {
      borderRadius: theme.radius.sm,
      border: "1px solid " + swapMono(theme, 2, 5),
      padding: "0.25rem " + theme.spacing.xs,
    },
    label: {
      width: "4rem",
      fontWeight: 600,
      fontSize: theme.fontSizes.xs,
      textAlign: "center",
    },
  }))();
  return (
    <Group align="end" spacing="xs" className={classes.container}>
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
