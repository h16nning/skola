import React, { useCallback, useDebugValue, useEffect, useState } from "react";
import { Center, Divider, Flex, Stack } from "@mantine/core";
import { useDeckFromUrl } from "../../logic/deck";
import { answerCard, Card, CardType, getCardsOf } from "../../logic/card";
import MissingObject from "../custom/MissingObject";
import { getUtils } from "../CardTypeManager";
import { generalFail } from "../custom/Notification";
import FinishedLearningView from "./FinishedLearningView";
import { useStopwatch } from "react-timer-hook";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader from "./LearnViewHeader";
import { swapMono } from "../../logic/ui";

function useLearning(
  cardSet: Card<CardType>[] | null
): [
  currentCard: Card<CardType> | null,
  next: Function,
  answer: Function,
  finished: boolean,
  repetitionCount: number
] {
  const [reservoir, setReservoir] = useState<Card<CardType>[]>([]);
  const [urgentQueue, setUrgentQueue] = useState<
    { card: Card<CardType>; due: number }[]
  >([]);
  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);
  const [repetitionCount, setRepetitionCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [requestingNext, setRequestingNext] = useState<boolean>(false);

  const requestNext = useCallback(
    () => setRequestingNext(true),
    [setRequestingNext]
  );

  useEffect(() => {
    console.log("use effect");
    console.log(currentCard);
    if (
      requestingNext ||
      (!currentCard && (reservoir.length !== 0 || urgentQueue.length !== 0))
    ) {
      setRequestingNext(false);
      console.log("next called");
      //Check if there are urgent items to be presented
      console.log("urgent queue:");
      console.log(urgentQueue);
      if (
        urgentQueue.length !== 0 &&
        (urgentQueue[0].due <= Date.now() || reservoir.length === 0)
      ) {
        const topItem = urgentQueue[0];
        if (!topItem) {
          console.log("invalid urgent queue item");
          return;
        }
        setCurrentCard(topItem.card);
        console.log("next: shift first item");
        let newUrgentQueue = urgentQueue.filter((_, i) => i !== 0);
        console.log(urgentQueue.length);
        console.log(newUrgentQueue.length);
        console.log(newUrgentQueue);

        setUrgentQueue(newUrgentQueue);
      } else if (reservoir.length !== 0) {
        //If not pull card from the card reservoir
        setCurrentCard(reservoir[0]);
        setReservoir(reservoir.filter((_, i) => i !== 0));
      } else {
        setFinished(true);
      }
    }
  }, [urgentQueue, reservoir, requestNext, currentCard, requestingNext]);

  const answer = useCallback(
    async (quality: number) => {
      console.log("answer function was called. currentCard: ");
      console.log(currentCard);

      //Increase repetition count for stats
      setRepetitionCount(repetitionCount + 1);
      if (currentCard) {
        console.log("check: current card exists");
        let pushToUrgentQueue = false;

        //If card was answered badly, the learned stat is reset to false, and it is added back to the urgent queue
        if (quality <= 1) {
          console.log("check: insufficient quality");
          currentCard.model.learned = false;
          pushToUrgentQueue = true;
        } else {
          console.log("check: sufficient quality");
          //If card was answered correctly, but it wasn't learned before, it is added one more time to the urgent queue. But learned gets set to true
          if (!currentCard.model.learned) {
            console.log(
              "check: card isn't set to learned yet and will be set to learned now"
            );
            pushToUrgentQueue = true;
          }
          //Finally, if the card is answered correctly and has been learned before, keep learned true and do nothing
          currentCard.model.learned = true;
        }

        //If previously determined, the card is pushed to urgent queue
        if (pushToUrgentQueue) {
          console.log("pushing to urgent queue");
          setUrgentQueue(
            urgentQueue.concat({ card: currentCard, due: Date.now() + 60_000 })
          );
        }
        console.log("calling sm2 and updating database");

        //Now calculate sm2 and update database
        await answerCard(currentCard, quality, currentCard.model.learned);

        console.log("answer finished");
      }

      requestNext();
    },
    [currentCard, urgentQueue, repetitionCount, requestNext]
  );

  useEffect(() => {
    if (cardSet && cardSet[0] && repetitionCount === 0) {
      setReservoir(
        cardSet
          .filter((card) => card.model.learned)
          .filter(
            (card) => !card.dueDate || card.dueDate.getTime() <= Date.now()
          )
      );
      setUrgentQueue(
        cardSet
          .filter((card) => !card.model.learned)
          .map((card) => ({ card: card, due: Date.now() }))
      );
    }
  }, [cardSet, repetitionCount]);

  useDebugValue(currentCard);
  useDebugValue(urgentQueue);
  useDebugValue(reservoir);
  useDebugValue(finished);
  useDebugValue(repetitionCount);
  return [currentCard, requestNext, answer, finished, repetitionCount];
}
function LearnView() {
  const [showingAnswer, setShowingAnswer] = useState<boolean>(false);
  const [deck, failed] = useDeckFromUrl();
  const [cardSet, setCardSet] = useState<Card<CardType>[] | null>(null);
  const [currentCard, requestNext, answer, finished, repetitions] =
    useLearning(cardSet);

  const stopwatch = useStopwatch({ autoStart: true });

  const answerButtonPressed = useCallback(
    async (quality: number) => {
      try {
        await answer(quality);
        setShowingAnswer(false);
      } catch (error) {
        generalFail();
        console.log(error);
      }
    },
    [answer]
  );

  useEffect(() => {
    getCardsOf(deck).then((cards) => setCardSet(cards));
  }, [deck]);

  useEffect(() => {
    if (finished) {
      stopwatch.pause();
    }
  }, [finished, stopwatch]);

  if (failed) {
    return <MissingObject />;
  }

  if (finished) {
    return <FinishedLearningView repetitions={repetitions} time={stopwatch} />;
  }
  // @ts-ignore
  return (
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <LearnViewHeader
        stopwatch={stopwatch}
        currentCard={currentCard ?? undefined}
        next={requestNext}
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
          {currentCard
            ? getUtils(currentCard.content.type).displayQuestion(
                // @ts-ignore how to solve this???
                currentCard
              )
            : null}
          {showingAnswer && currentCard ? (
            <>
              <Divider
                sx={(theme) => ({ borderColor: swapMono(theme, 2, 6) })}
              />
              {getUtils(currentCard.content.type).displayAnswer(
                // @ts-ignore how to solve this???
                currentCard
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
