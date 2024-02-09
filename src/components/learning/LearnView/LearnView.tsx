import { Center, Flex, Modal, Paper } from "@mantine/core";
import { useDebouncedValue, useFullscreen } from "@mantine/hooks";
import { Rating } from "fsrs.js";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUtils } from "../../../logic/CardTypeManager";
import { useSetting } from "../../../logic/Settings";
import { getCardsOf } from "../../../logic/card";
import { useDeckFromUrl } from "../../../logic/deck";
import { CardSorts, useLearning } from "../../../logic/learn";
import MissingObject from "../../custom/MissingObject";
import { generalFail } from "../../custom/Notification/Notification";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import classes from "./LearnView.module.css";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";

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

  const [debouncedFinish] = useDebouncedValue(controller.isFinished, 50);

  const answerButtonPressed = useCallback(
    async (rating: Rating) => {
      try {
        await controller.answerCard(rating);
        controller.requestNextCard();
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
    <div className={classes.learnView}>
      <Flex direction="column" justify="space-between" h="100%" w="100%">
        <LearnViewHeader
          currentCard={controller.currentCard ?? undefined}
          controller={controller}
        />
        <Center className={classes.cardContainer}>
          <Paper className={classes.card}>
            <LearnViewCurrentCardStateIndicator
              currentCardModel={controller.currentCard?.model}
            />
            {!controller.showingAnswer &&
              controller.currentCard &&
              getUtils(controller.currentCard).displayQuestion(
                controller.currentCard
              )}
            {controller.showingAnswer &&
              controller.currentCard &&
              getUtils(controller.currentCard).displayAnswer(
                controller.currentCard
              )}
          </Paper>
        </Center>
        <LearnViewFooter controller={controller} answer={answerButtonPressed} />

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
    </div>
  );
}

export default LearnView;
