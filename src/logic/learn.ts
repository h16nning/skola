import { answerCard, Card, CardType } from "./card";
import { useCallback, useDebugValue, useEffect, useState } from "react";

export type LearnController = {
  currentCard: Card<CardType> | null;
  nextCard: Function;
  answerCard: Function;
  learningIsFinished: boolean;
  repetitionCount: number;
  lengthOfUrgentQueue: number;
  lengthOfReservoir: number;
};

const timeInUrgentQueue: Record<number, number> = {
  0: 60_000,
  1: 300_000,
  3: 600_000,
  5: 1_200_000,
};

export function useLearning(
  cardSet: Card<CardType>[] | null,
  options?: {}
): LearnController {
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
            urgentQueue.concat({
              card: currentCard,
              due: Date.now() + timeInUrgentQueue[quality],
            })
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

  return {
    currentCard: currentCard,
    answerCard: answer,
    nextCard: requestNext,
    learningIsFinished: finished,
    repetitionCount: repetitionCount,
    lengthOfUrgentQueue: urgentQueue.length,
    lengthOfReservoir: reservoir.length,
  };
}
