import React, { useMemo } from "react";
import { Button, Group } from "@mantine/core";
import { swapMono } from "../../logic/ui";
import { useHotkeys } from "@mantine/hooks";
import { LearnController } from "../../logic/learn";
import { sm2 } from "../../logic/SpacedRepetition";
import AnswerCardButton from "../../logic/AnswerCardButton";

interface LearnViewFooterProps {
  controller: LearnController;
  answer: Function;
  showingAnswer: boolean;
  setShowingAnswer: Function;
}
function LearnViewFooter({
  controller,
  answer,
  showingAnswer,
  setShowingAnswer,
}: LearnViewFooterProps) {
  useHotkeys([
    ["1", () => answer(0)],
    ["2", () => answer(1)],
    ["3", () => answer(4)],
    ["4", () => answer(5)],
    ["Space", () => (!showingAnswer ? setShowingAnswer(true) : answer(4))],
    ["Enter", () => (!showingAnswer ? setShowingAnswer(true) : answer(4))],
  ]);

  const sm2Hard = useMemo(() => {
    if (controller.currentCard) {
      const days = sm2(1, controller.currentCard.model).interval;
      return days === 0 ? "< 6 min" : days + " d";
    } else return "";
  }, [controller.currentCard]);

  const sm2Normal = useMemo(() => {
    if (controller.currentCard) {
      const days = sm2(4, controller.currentCard.model).interval;
      return days === 0 ? "< 10 min" : days + " d";
    } else return "";
  }, [controller.currentCard]);

  const sm2Easy = useMemo(() => {
    if (controller.currentCard) {
      const days = sm2(5, controller.currentCard.model).interval;
      return days === 0 ? "< 10 min" : days + " d";
    } else return "";
  }, [controller.currentCard]);

  return (
    <Group
      position="center"
      sx={(theme) => ({
        padding: theme.spacing.md,
        borderTop: `1px solid ${swapMono(theme, 2, 5)}`,
        marginBottom: "-" + theme.spacing.md,
        marginLeft: "-" + theme.spacing.md,
        marginRight: "-" + theme.spacing.md,
      })}
    >
      {showingAnswer ? (
        <Group spacing="xs" noWrap w="100%" maw="25rem">
          <AnswerCardButton
            label="Again"
            timeInfo="< 10 min"
            color="red"
            action={() => answer(0)}
          />
          <AnswerCardButton
            label="Hard"
            timeInfo={sm2Hard}
            color="yellow"
            action={() => answer(1)}
          />
          <AnswerCardButton
            label="Normal"
            timeInfo={sm2Normal}
            color="green"
            action={() => answer(4)}
          />
          <AnswerCardButton
            label="Easy"
            timeInfo={sm2Easy}
            color="blue"
            action={() => answer(5)}
          />
        </Group>
      ) : (
        <Button onClick={() => setShowingAnswer(true)} h="2.5rem">
          Show Answer
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;
