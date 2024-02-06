import classes from "./LearnView.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Center, Flex, Modal, Overlay } from "@mantine/core";
import { useDeckFromUrl } from "../../../logic/deck";
import {
  Card,
  CardState,
  CardType,
  getCardsOf,
  getStateOf,
} from "../../../logic/card";
import MissingObject from "../../custom/MissingObject";
import { getUtils } from "../../../logic/CardTypeManager";
import { generalFail } from "../../custom/Notification/Notification";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import { useLearning } from "../../../logic/learn";
import { useDebouncedValue, useFullscreen } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSetting } from "../../../logic/Settings";

function LearnView() {
  const { toggle, fullscreen } = useFullscreen();
  const [useZenMode] = useSetting("useZenMode");

  const navigate = useNavigate();
  const [deck, isReady, params] = useDeckFromUrl();
  const [cardSet, setCardSet] = useState<Card<CardType>[] | null>(null);

  const controller = useLearning(cardSet, { learnAll: params === "all" });

  const [currentCardState, setCurrentCardState] = useState<
    CardState | undefined
  >(undefined);

  useEffect(() => {
    toggle();
    return () => {
      toggle();
    };
  }, []);

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
  const [debouncedLearningIsFinished] = useDebouncedValue(
    controller.learningIsFinished,
    1000
  );

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

  return (
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <LearnViewHeader
        currentCard={controller.currentCard ?? undefined}
        controller={controller}
      />
      <Center>
        <Box component="div" className={classes.cardContainer}>
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
      <Modal
        opened={controller.learningIsFinished}
        onClose={() => navigate("/home")}
        fullScreen
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        transitionProps={{ transition: "fade" }}
      >
        <FinishedLearningView
          repetitionList={controller.repetitionList}
          time={stopwatchResult}
        />
      </Modal>
    </Flex>
  );
}

export default LearnView;
