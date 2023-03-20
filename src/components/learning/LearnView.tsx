import React, { useCallback, useEffect, useState } from "react";
import { Center, Divider, Flex, Stack } from "@mantine/core";
import { useDeckFromUrl } from "../../logic/deck";
import { Card, CardType, getCardsOf } from "../../logic/card";
import MissingObject from "../custom/MissingObject";
import { getUtils } from "../CardTypeManager";
import { generalFail } from "../custom/Notification";
import FinishedLearningView from "./FinishedLearningView";
import { useStopwatch } from "react-timer-hook";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader from "./LearnViewHeader";
import { swapMono } from "../../logic/ui";
import { useLearning } from "../../logic/learn";

function LearnView() {
  const [deck, failed] = useDeckFromUrl();

  const [cardSet, setCardSet] = useState<Card<CardType>[] | null>(null);

  useEffect(() => {
    getCardsOf(deck).then((cards) => setCardSet(cards));
  }, [deck]);

  const controller = useLearning(cardSet);

  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);

  const stopwatch = useStopwatch({ autoStart: true });

  const answerButtonPressed = useCallback(
    async (quality: number) => {
      try {
        await controller.answerCard(quality);
        setShowingAnswer(false);
      } catch (error) {
        generalFail();
        console.log(error);
      }
    },
    [controller.answerCard]
  );

  useEffect(() => {
    if (controller.learningIsFinished) {
      stopwatch.pause();
    }
  }, [controller.learningIsFinished, stopwatch]);

  if (failed) {
    return <MissingObject />;
  }

  if (controller.learningIsFinished) {
    return (
      <FinishedLearningView
        repetitions={controller.repetitionCount}
        time={stopwatch}
      />
    );
  }
  // @ts-ignore
  return (
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <LearnViewHeader
        stopwatch={stopwatch}
        currentCard={controller.currentCard ?? undefined}
        next={controller.nextCard}
      />
      <Center>
        <Stack
          spacing="xl"
          w="100%"
          maw="600px"
          sx={() => ({
            "& p:first-of-type": {
              marginTop: 0,
            },
            "& p:last-of-type": { marginBottom: 0 },
          })}
        >
          {controller.currentCard
            ? getUtils(controller.currentCard.content.type).displayQuestion(
                // @ts-ignore how to solve this???
                controller.currentCard
              )
            : null}
          {showingAnswer && controller.currentCard ? (
            <>
              <Divider
                sx={(theme) => ({ borderColor: swapMono(theme, 2, 6) })}
              />
              {getUtils(controller.currentCard.content.type).displayAnswer(
                // @ts-ignore how to solve this???
                controller.currentCard
              )}
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Center>
      <LearnViewFooter
        answer={answerButtonPressed}
        showingAnswer={showingAnswer}
        setShowingAnswer={setShowingAnswer}
      />
    </Flex>
  );
}

export default LearnView;
