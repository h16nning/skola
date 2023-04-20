import { answerCard, Card, CardType, getCard, getStateOf } from "./card";
import { useCallback, useEffect, useState } from "react";

export type Answer = "again" | "hard" | "good" | "easy";

export const AnswerQuality: Record<Answer, number> = {
  again: 0,
  hard: 1,
  good: 4,
  easy: 5,
};

export type LearnOptions = {
  learnAll: boolean;
};

/**
 * This type specifies the return value of the useLearning hook. It contains all the functions and variables needed to control the learning process.
 */
export type LearnController = {
  currentCard: Card<CardType> | null;
  currentCardFromReservoir: "new" | "learned" | "learning" | null;
  nextCard: Function;
  answerCard: Function;
  learningIsFinished: boolean;
  repetitionList: number[];
  learnedCardsLength: number;
  newCardsLength: number;
  learningQueueLength: number;
};

/**
 * This objects maps the maximum time a card can be in the urgent queue to the answer given by the user
 */
const timeInUrgentQueue: Record<number, number> = {
  0: 60_000,
  1: 300_000,
  4: 600_000,
  5: 1_200_000,
};

/**
 * This function pulls a card from the reservoir and sets it as the current card
 * @param reservoir The reservoir from which the card is pulled
 * @param setReservoir The function to set the reservoir
 * @param setCurrentCard The function to set the current card
 */
async function pullCardFromReservoir(
  reservoir: Card<CardType>[],
  setReservoir: Function,
  setCurrentCard: Function
) {
  getCard(reservoir[0].id).then((card) => {
    if (card) {
      setCurrentCard(card);
      setReservoir(reservoir.filter((_, i) => i !== 0));
    }
  });
}

async function pullCardFromLearningQueue(
  queue: { card: Card<CardType>; due: number }[],
  setQueue: Function,
  setCurrentCard: Function
) {
  getCard(queue[0].card.id).then((card) => {
    if (card) {
      console.log("Pulled card from reservoir: " + card.id);
      setCurrentCard(card);
      setQueue(queue.filter((_, i) => i !== 0));
    }
  });
}

/**
 * This hook controls the learning process. It takes a card set and returns a {@link LearnController} object.
 * @param cardSet
 * @param options
 */
export function useLearning(
  cardSet: Card<CardType>[] | null,
  options?: LearnOptions
): LearnController {
  const [newCards, setNewCards] = useState<Card<CardType>[]>([]);
  const [learnedCards, setLearnedCards] = useState<Card<CardType>[]>([]);
  const [learningQueue, setLearningQueue] = useState<
    { card: Card<CardType>; due: number }[]
  >([]);
  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);
  const [currentCardFromReservoir, setCurrentCardFromReservoir] = useState<
    "new" | "learned" | "learning" | null
  >(null);
  const [repetitionList, setRepetitionList] = useState<number[]>([]);
  const [finished, setFinished] = useState<boolean>(false);
  const [requestingNext, setRequestingNext] = useState<boolean>(false);

  //This is the function which is presented to the outside scope
  //It will set the request next state to true, which will trigger the useEffect below
  const requestNext = useCallback(
    () => setRequestingNext(true),
    [setRequestingNext]
  );

  useEffect(() => {
    console.log("use effect");
    console.log(currentCard);
    //IF another card is requested
    //OR there is no current card and there are still cards in the card reservoirs
    if (
      requestingNext ||
      (!currentCard &&
        (newCards.length !== 0 ||
          learnedCards.length !== 0 ||
          learningQueue.length !== 0))
    ) {
      setRequestingNext(false);
      console.log("next called");
      console.log("urgent queue:");
      console.log(learningQueue);

      //Check if there are any learning cards to be presented
      //There have to be items in the learningQueue
      //and the oldest one hast to be due, or instead there have to be no cards
      //left in the other card reservoirs
      if (
        learningQueue.length !== 0 &&
        (learningQueue[0].due <= Date.now() ||
          (newCards.length === 0 && learnedCards.length === 0))
      ) {
        void pullCardFromLearningQueue(
          learningQueue,
          setLearningQueue,
          setCurrentCard
        );
        setCurrentCardFromReservoir("learning");
        /*const topItem = learningQueue[0];

        //Double check if the item really exists
        if (!topItem) {
          console.error("invalid urgent queue item");
          return;
        }

        //Set the currently presented card to the item
        setCurrentCard(topItem.card);

        //Shift (remove) the first item using filter(), shift() can't be used as it will directly modify the queue.
        const newUrgentQueue = learningQueue.filter((_, i) => i !== 0);
        setLearningQueue(newUrgentQueue);*/
      } else {
        const newCardsAvailable = newCards.length > 0;
        const learnedCardsAvailable = learnedCards.length > 0;

        //If there are new cards and learned cards left, decide from which reservoir to pull from
        //TODO use other method than doing to than random, maybe incorporate a parameter from settings
        //If only one reservoir holds cards, pull it from that one
        //If no reservoir holds any more cards, then learning can be considered finished
        if (newCardsAvailable && learnedCardsAvailable) {
          if (Math.random() < 0.5) {
            void pullCardFromReservoir(newCards, setNewCards, setCurrentCard);
            setCurrentCardFromReservoir("new");
          } else {
            void pullCardFromReservoir(
              learnedCards,
              setLearnedCards,
              setCurrentCard
            );
            setCurrentCardFromReservoir("learned");
          }
        } else if (newCardsAvailable) {
          void pullCardFromReservoir(newCards, setNewCards, setCurrentCard);
        } else if (learnedCardsAvailable) {
          void pullCardFromReservoir(
            learnedCards,
            setLearnedCards,
            setCurrentCard
          );
          setCurrentCardFromReservoir("learned");
        } else {
          setFinished(true);
        }
      }
    }
  }, [
    learningQueue,
    newCards,
    learnedCards,
    requestNext,
    currentCard,
    requestingNext,
  ]);

  const answer = useCallback(
    async (quality: number) => {
      if (currentCard) {
        //Increase repetition count for stats
        setRepetitionList(repetitionList.concat(quality));

        //If the quality is 0 or the card has never been repeated before or the quality is 1 and the repetition count is less than 2, push the card to the urgent queue
        if (
          quality === 0 ||
          currentCard.model.repetitions === 0 ||
          (quality <= 1 && currentCard.model.repetitions < 2)
        ) {
          console.log("pushing to urgent queue");
          setLearningQueue(
            learningQueue.concat({
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
    [currentCard, learningQueue, repetitionList, requestNext]
  );

  //This useEffect is used to filter the cards given in using cardSet and spreading them to the learningQueue and the newCards / learnedCards reservoir
  useEffect(() => {
    if (cardSet && cardSet[0] && repetitionList.length === 0) {
      setNewCards(cardSet.filter((card) => getStateOf(card) === "new"));

      if (options?.learnAll) {
        setLearnedCards(
          cardSet.filter((card) => {
            const state = getStateOf(card);
            return state === "due" || state === "learned";
          })
        );
      } else {
        setLearnedCards(cardSet.filter((card) => getStateOf(card) === "due"));
      }

      setLearningQueue(
        cardSet
          .filter((card) => getStateOf(card) === "learning")
          .map((card) => ({ card: card, due: Date.now() }))
      );
    }
  }, [cardSet, repetitionList, options?.learnAll]);

  return {
    currentCard: currentCard,
    currentCardFromReservoir: currentCardFromReservoir,
    answerCard: answer,
    nextCard: requestNext,
    learningIsFinished: finished,
    repetitionList: repetitionList,
    learnedCardsLength: learnedCards.length,
    newCardsLength: newCards.length,
    learningQueueLength: learningQueue.length,
  };
}

export function useRepetitionAccuracy(repetitionList: number[]): number | null {
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (repetitionList.length !== 0) {
      let sum = 0;
      repetitionList.forEach(
        (quality) => (sum += quality / AnswerQuality.good)
      );
      setAccuracy(Math.round((sum / repetitionList.length) * 1000) / 10);
    }
  }, [repetitionList]);

  return accuracy;
}
