import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { swapMono } from "../../logic/ui";
import { useHotkeys } from "@mantine/hooks";

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
  useHotkeys([
    ["1", () => answer(0)],
    ["2", () => answer(1)],
    ["3", () => answer(3)],
    ["4", () => answer(5)],
    ["Space", () => (!showingAnswer ? setShowingAnswer(true) : answer(3))],
    ["Enter", () => (!showingAnswer ? setShowingAnswer(true) : answer(3))],
  ]);

  return (
    <Group
      position="center"
      sx={(theme) => ({
        padding: theme.spacing.lg,
        backgroundColor: swapMono(theme, 0, 6),
        marginBottom: "-" + theme.spacing.lg,
        marginLeft: "-" + theme.spacing.md,
        marginRight: "-" + theme.spacing.md,
      })}
    >
      {showingAnswer ? (
        <Group spacing="xs" noWrap>
          <Button color="red" onClick={() => answer(0)} size="lg">
            <Stack spacing={0} align="center">
              <Text fz="xs" fw={400}>
                {"< 10 min"}
              </Text>
              <Text fz="sm">Again</Text>
            </Stack>
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
