import React from "react";
import { Button, Group } from "@mantine/core";
import { swapMono } from "../../logic/ui";

interface LearnViewFooterProps {
  answer: Function;
  showingAnswer: boolean;
  setShowingAnswer: Function;
}

function LearnViewFooter({
  answer,
  showingAnswer,
  setShowingAnswer,
}: LearnViewFooterProps) {
  return (
    <Group
      position="center"
      sx={(theme) => ({
        width: "calc(100% +" + theme.spacing.md + ")",
        padding: theme.spacing.lg,
        backgroundColor: swapMono(theme, 0, 6),
        marginLeft: "-" + theme.spacing.md,
      })}
    >
      {showingAnswer ? (
        <Group spacing="xs">
          <Button color="red" onClick={() => answer(0)} size="md">
            Again
          </Button>
          <Button color="yellow" onClick={() => answer(1)} size="md">
            Hard
          </Button>
          <Button color="green" onClick={() => answer(3)} size="md">
            Normal
          </Button>
          <Button color="blue" onClick={() => answer(5)} size="md">
            Easy
          </Button>
        </Group>
      ) : (
        <Button onClick={() => setShowingAnswer(true)} size="md">
          Show Answer
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;
