import React, { useCallback, useEffect, useState } from "react";
import { Box, Center, Flex } from "@mantine/core";
import { useDeckFromUrl } from "../../logic/deck";
import {
  Card,
  CardState,
  CardType,
  getCardsOf,
  getStateOf,
} from "../../logic/card";
import MissingObject from "../custom/MissingObject";
import { getUtils } from "../../logic/CardTypeManager";
import { generalFail } from "../custom/Notification";
import FinishedLearningView from "./FinishedLearningView";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import LearnViewCurrentCardStateIndicator from "./LearnViewCurrentCardStateIndicator";
import { useLearning } from "../../logic/learn";

function LearnView() {
  const [deck, isReady, params] = useDeckFromUrl();
  const [cardSet, setCardSet] = useState<Card<CardType>[] | null>(null);

  const controller = useLearning(cardSet, { learnAll: params === "all" });

  const [currentCardState, setCurrentCardState] = useState<
    CardState | undefined
  >(undefined);

  useEffect(() => {
    getCardsOf(deck).then((cards) => setCardSet(cards ?? null));
  }, [deck]);

  useEffect(() => {
    if (controller.currentCard) {
      setCurrentCardState(getStateOf(controller.currentCard));
    } else {
      setCurrentCardState(undefined);
    }
  }, [controller.currentCard]);

  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);

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
    [controller]
  );

  useEffect(() => {
    if (controller.learningIsFinished) {
      stopwatchResult.pause();
    }
  }, [controller.learningIsFinished]);

  if (isReady && !deck) {
    return <MissingObject />;
  }

  if (controller.learningIsFinished) {
    return (
      <FinishedLearningView
        repetitionList={controller.repetitionList}
        time={stopwatchResult}
      />
    );
  }
  // @ts-ignore
  return (
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <LearnViewHeader
        currentCard={controller.currentCard ?? undefined}
        controller={controller}
      />
      <Center>
        <Box
          component="div"
          pos="relative"
          w="100%"
          maw="600px"
          sx={() => ({
            "& p:first-of-type": {
              marginTop: 0,
            },
            "& p:last-of-type": { marginBottom: 0 },
            "& img": {
              maxWidth: "100%",
            },
          })}
        >
          <LearnViewCurrentCardStateIndicator
            currentCardState={currentCardState}
          />
          {!showingAnswer &&
            controller.currentCard &&
            getUtils(controller.currentCard).displayQuestion(
              controller.currentCard
            )}
          {showingAnswer &&
            controller.currentCard &&
            getUtils(controller.currentCard).displayAnswer(
              controller.currentCard
            )}
        </Box>
      </Center>
      <LearnViewFooter
        controller={controller}
        answer={answerButtonPressed}
        showingAnswer={showingAnswer}
        setShowingAnswer={setShowingAnswer}
      />
    </Flex>
  );
}

export default LearnView;
