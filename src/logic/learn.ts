import { Card, CardType, updateCardModel, useCardsWith } from "./card";
import {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Rating, State, Card as Model, FSRS, SchedulingInfo } from "fsrs.js";
import { Table } from "dexie";
import { scheduler } from "./CardScheduler";
import { use } from "i18next";
export type LearnOptions = {
  learnAll: boolean;
  newToReviewRatio: number;
};

export type LearnController = {
  currentCard: Card<CardType> | null;
  nextCard: () => void;
  answerCard: (rating: Rating) => void;
  currentCardRepeatInfo: Record<number, SchedulingInfo> | null;

  newCardsNumber: number;
  timeCriticalCardsNumber: number;
  toReviewCardsNumber: number;
  learnedCardsNumber: number;

  ratingsList: Rating[];

  isFinished: boolean;
};

export type CardQuerier = {
  querier: (
    cards: Table<Card<CardType>>
  ) => Promise<Card<CardType>[] | undefined>;
  dependencies: any[];
};

export function useLearning(
  cardQuerier: CardQuerier,
  options: LearnOptions
): LearnController {
  //e. g. all cards of a deck
  const [providedCards] = useCardsWith(
    cardQuerier.querier,
    cardQuerier.dependencies
  );

  const [timeCriticalCards, setTimeCriticalCards] = useState<Card<CardType>[]>(
    []
  );
  const [newCards, setNewCards] = useState<Card<CardType>[]>([]);
  const [toReviewCards, setToReviewCards] = useState<Card<CardType>[]>([]);
  const [learnedCards, setLearnedCards] = useState<Card<CardType>[]>([]);

  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [ratingsList, setRatingsList] = useState<Rating[]>([]);

  //Sorting the cards into different categories if they have been provided
  useEffect(() => {
    if (providedCards) {
      if (
        timeCriticalCards.length +
          newCards.length +
          toReviewCards.length +
          learnedCards.length ===
          0 &&
        currentCard === null
      ) {
        console.log("sorting out cards");
        const now = new Date(Date.now());
        setTimeCriticalCards(
          providedCards.filter(
            (card) =>
              card.model.state === State.Learning ||
              card.model.state === State.Relearning
          )
        );
        setNewCards(
          providedCards.filter((card) => card.model.state === State.New)
        );
        setToReviewCards(
          providedCards.filter(
            (card) => card.model.state === State.Review && card.model.due <= now
          )
        );
        setLearnedCards(
          providedCards.filter(
            (card) => card.model.state === State.Review && card.model.due > now
          )
        );
      } else if (currentCard === null) {
        console.log("no current card, setting it");
        nextCard();
      }
    }
  }, [
    providedCards,
    currentCard,
    timeCriticalCards,
    newCards,
    toReviewCards,
    learnedCards,
  ]);

  const nextCard = useCallback(() => {
    if (
      timeCriticalCards.length > 0 &&
      timeCriticalCards[0].model.due <= new Date(Date.now())
    ) {
      setCurrentCard(timeCriticalCards[0]);
      setTimeCriticalCards(timeCriticalCards.filter((_, i) => i !== 0));
    } else if (newCards.length + toReviewCards.length > 0) {
      if (newCards.length === 0) {
        setCurrentCard(toReviewCards[0]);
        setToReviewCards(toReviewCards.filter((_, i) => i !== 0));
      } else if (toReviewCards.length === 0) {
        setCurrentCard(newCards[0]);
        setNewCards(newCards.filter((_, i) => i !== 0));
      } else {
        if (Math.random() < options.newToReviewRatio) {
          setCurrentCard(newCards[0]);
          setNewCards(newCards.filter((_, i) => i !== 0));
        } else {
          setCurrentCard(toReviewCards[0]);
          setToReviewCards(toReviewCards.filter((_, i) => i !== 0));
        }
      }
    } else if (options.learnAll && learnedCards.length > 0) {
      setCurrentCard(learnedCards[0]);
      setLearnedCards(learnedCards.filter((_, i) => i !== 0));
    } else if (timeCriticalCards.length > 0) {
      setCurrentCard(timeCriticalCards[0]);
      setTimeCriticalCards(timeCriticalCards.filter((_, i) => i !== 0));
    } else {
      console.log("no more cards");
      setIsFinished(true);
    }
  }, [
    timeCriticalCards,
    newCards,
    toReviewCards,
    learnedCards,
    options,
    setCurrentCard,
  ]);

  //Providing information about how all 4 ratings would affect the current card
  //Shown on buttons
  const currentCardRepeatInfo = useMemo(() => {
    if (currentCard) {
      return scheduler.repeat(currentCard.model, new Date(Date.now()));
    } else {
      return null;
    }
  }, [currentCard]);

  //Answering the current card with the given rating
  const answer = useCallback(
    (rating: Rating) => {
      if (currentCard && currentCardRepeatInfo) {
        updateCardModel(currentCard, currentCardRepeatInfo[rating].card);
        if (currentCardRepeatInfo[rating].card.scheduled_days === 0) {
          setTimeCriticalCards(
            [
              ...timeCriticalCards,
              { ...currentCard, model: currentCardRepeatInfo[rating].card },
            ].sort((a, b) => a.model.due.getTime() - b.model.due.getTime())
          );
          setRatingsList([...ratingsList, rating]);
        }
      } else {
        throw new Error("Card or cardModelInfo is missing");
      }
    },
    [currentCard]
  );

  return {
    currentCard: currentCard,
    currentCardRepeatInfo: currentCardRepeatInfo,
    answerCard: answer,
    nextCard: nextCard,

    newCardsNumber: newCards.length,
    timeCriticalCardsNumber: timeCriticalCards.length,
    toReviewCardsNumber: toReviewCards.length,
    learnedCardsNumber: learnedCards.length,

    ratingsList: ratingsList,

    isFinished: isFinished,
  };
}

//POSSIBLY NOT ACCURATE | NOT REVIEWED AGAIN AFTER #33
export function useRepetitionAccuracy(ratingsList: number[]): number | null {
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (ratingsList.length !== 0) {
      let sum = 0;
      ratingsList.forEach((rating) => (sum += rating / Rating.Good));
      setAccuracy(Math.round((sum / ratingsList.length) * 1000) / 10);
    }
  }, [ratingsList]);

  return accuracy;
}
