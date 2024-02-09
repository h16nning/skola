import classes from "./LearnView.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Center, Flex, Modal } from "@mantine/core";
import { useDeckFromUrl } from "../../../logic/deck";
import { getCardsOf } from "../../../logic/card";
import MissingObject from "../../custom/MissingObject";
import { getUtils } from "../../../logic/CardTypeManager";
import { generalFail } from "../../custom/Notification/Notification";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import { CardSorts, useLearning } from "../../../logic/learn";
import { useDebouncedValue, useFullscreen } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSetting } from "../../../logic/Settings";
import { Rating } from "fsrs.js";

function LearnView() {
  const { toggle, fullscreen } = useFullscreen();
  const [zenMode] = useSetting("useZenMode");

  const navigate = useNavigate();
  const [deck, isReady, params] = useDeckFromUrl();

  const controller = useLearning(
    {
      querier: () => getCardsOf(deck),
      dependencies: [deck],
    },
    {
      learnAll: params === "all",
      newToReviewRatio: 0.5,
      sort: CardSorts.bySortField(1),
    }
  );

  //ZEN MODE
  useEffect(() => {
    if (zenMode) {
      toggle();
    }
    return () => {
      if (zenMode) {
        toggle();
      }
    };
  }, []);

  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);
  const [debouncedFinish] = useDebouncedValue(controller.isFinished, 50);

  const answerButtonPressed = useCallback(
    async (rating: Rating) => {
      try {
        await controller.answerCard(rating);
        setShowingAnswer(false);
        controller.nextCard();
      } catch (error) {
        generalFail();
        console.log(error);
      }
    },
    [controller]
  );

  useEffect(() => {
    if (controller.isFinished) {
      stopwatchResult.pause();
    } else {
      stopwatchResult.start();
    }
  }, [controller.isFinished]);

  if (isReady && !deck) {
    return <MissingObject />;
  }

  return (
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <LearnViewHeader
        currentCard={controller.currentCard ?? undefined}
        controller={controller}
      />
      <Center>
        <Box component="div" className={classes.cardContainer}>
          <LearnViewCurrentCardStateIndicator
            currentCardModel={controller.currentCard?.model}
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

      <Modal
        opened={debouncedFinish}
        onClose={() => navigate("/home")}
        fullScreen
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        transitionProps={{ transition: "fade" }}
      >
        <FinishedLearningView
          ratingsList={controller.ratingsList}
          time={stopwatchResult}
        />
      </Modal>
    </Flex>
  );
}

export default LearnView;
