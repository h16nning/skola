import { Card, CardType, updateCardModel, useCardsWith } from "./card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Rating, State, SchedulingInfo } from "fsrs.js";
import { Table } from "dexie";
import { scheduler } from "./CardScheduler";
import { getUtils } from "./CardTypeManager";

export type LearnOptions = {
  learnAll: boolean;
  newToReviewRatio: number;
  sort?: (a: Card<CardType>, b: Card<CardType>) => number;
};

export type CardQuerier = {
  querier: (
    cards: Table<Card<CardType>>
  ) => Promise<Card<CardType>[] | undefined>;
  dependencies: any[];
};

export const CardSorts = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  bySortField: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    (getUtils(a).displayPreview(a) > getUtils(b).displayPreview(b) ? 1 : -1) *
    sortOrder,
};

export type LearnController = {
  newCardsNumber: number;
  timeCriticalCardsNumber: number;
  toReviewCardsNumber: number;
  learnedCardsNumber: number;

  currentCard: Card<CardType> | null;
  currentCardRepeatInfo: Record<number, SchedulingInfo> | null;

  answerCard: (rating: Rating) => void;
  nextCard: () => void;

  ratingsList: Rating[];
  isFinished: boolean;
};

export function useLearning(
  cardQuerier: CardQuerier,
  options: LearnOptions
): LearnController {
  //e.g. all cards of a deck
  const [providedCards] = useCardsWith(
    cardQuerier.querier,
    cardQuerier.dependencies
  );

  //Time critical cards are cards that are due today / should be done within this learning session (5-10 min interval). timeCriticalCards should be sorted by due date
  const [timeCriticalCards, setTimeCriticalCards] = useState<Card<CardType>[]>(
    []
  );

  //New cards are cards that have never been reviewed
  const [newCards, setNewCards] = useState<Card<CardType>[]>([]);
  //To review cards are cards that have been answered correctly before and are due for a review
  const [toReviewCards, setToReviewCards] = useState<Card<CardType>[]>([]);
  //Learned cards are cards that have been answered correctly but are not due for a review. These cards are not regulary shown, only with learnAll true
  const [learnedCards, setLearnedCards] = useState<Card<CardType>[]>([]);

  //Currently shown card
  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);

  //Determines if FinishedLearningView is shown
  const [isFinished, setIsFinished] = useState<boolean>(false);
  //for progress bar and statistics on FinishedLearningView
  const [ratingsList, setRatingsList] = useState<Rating[]>([]);

  useEffect(() => {
    //Check if there are already cards provided
    if (providedCards) {
      //Check if there are no cards are in the respective lists and currentCard is not set.
      if (
        timeCriticalCards.length +
          newCards.length +
          toReviewCards.length +
          learnedCards.length ===
          0 &&
        currentCard === null
      ) {
        //If yes, sort the cards into the respective lists
        const now = new Date(Date.now());
        setTimeCriticalCards(
          providedCards.filter(
            (card) =>
              card.model.state === State.Learning ||
              card.model.state === State.Relearning
          )
        );
        setNewCards(
          providedCards
            .filter((card) => card.model.state === State.New)
            .sort(options.sort)
        );
        setToReviewCards(
          providedCards
            .filter(
              (card) =>
                card.model.state === State.Review && card.model.due <= now
            )
            .sort(options.sort)
        );
        setLearnedCards(
          providedCards
            .filter(
              (card) =>
                card.model.state === State.Review && card.model.due > now
            )
            .sort(options.sort)
        );
      } else if (currentCard === null) {
        //If currentCard is not set (and there are cards in the lists), set it
        nextCard();
      }
    }
    if (
      timeCriticalCards.length +
        newCards.length +
        toReviewCards.length +
        learnedCards.length >
      0
    ) {
      setIsFinished(false);
    }
  }, [
    providedCards,
    currentCard,
    timeCriticalCards,
    newCards,
    toReviewCards,
    learnedCards,
  ]);

  //Tries to set currentCard to the next card
  const nextCard = useCallback(() => {
    if (isFinished) return;
    //If there are time critical cards that are due, set the first one as currentCard
    if (
      timeCriticalCards.length > 0 &&
      timeCriticalCards[0].model.due <= new Date(Date.now())
    ) {
      setCurrentCard(timeCriticalCards[0]);
      setTimeCriticalCards((tcCards) => tcCards.filter((_, i) => i !== 0));
      //If there are new cards or cards that need to be reviewed are available choose one of them based on the newToReviewRatio
    } else if (newCards.length + toReviewCards.length > 0) {
      if (newCards.length === 0) {
        setCurrentCard(toReviewCards[0]);
        setToReviewCards((trCards) => trCards.filter((_, i) => i !== 0));
      } else if (toReviewCards.length === 0) {
        setCurrentCard(newCards[0]);
        setNewCards((nCards) => nCards.filter((_, i) => i !== 0));
      } else {
        if (Math.random() < options.newToReviewRatio) {
          setCurrentCard(newCards[0]);
          setNewCards((nCards) => nCards.filter((_, i) => i !== 0));
        } else {
          setCurrentCard(toReviewCards[0]);
          setToReviewCards((trCards) => trCards.filter((_, i) => i !== 0));
        }
      }
      //If learnAll is true and there are learned cards available set the first one as currentCard
    } else if (options.learnAll && learnedCards.length > 0) {
      setCurrentCard(learnedCards[0]);
      setLearnedCards((lCards) => lCards.filter((_, i) => i !== 0));
      //If there aren't any other cards but still time critical cards which are not due yet do them anyway
    } else if (timeCriticalCards.length > 0) {
      setCurrentCard(timeCriticalCards[0]);
      setTimeCriticalCards((tcCards) => tcCards.filter((_, i) => i !== 0));
      //If there are no cards left finish the learning session
    } else {
      setIsFinished(true);
    }
  }, [timeCriticalCards, newCards, toReviewCards, learnedCards, options]);

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
          setTimeCriticalCards((tcCards) =>
            [
              ...tcCards,
              { ...currentCard, model: currentCardRepeatInfo[rating].card },
            ].sort((a, b) => a.model.due.getTime() - b.model.due.getTime())
          );
        }
        setRatingsList((rList) => [...rList, rating]);
      } else {
        throw new Error("Card or cardModelInfo is missing");
      }
    },
    [currentCard, currentCardRepeatInfo, timeCriticalCards, ratingsList]
  );

  return {
    newCardsNumber: newCards.length,
    timeCriticalCardsNumber: timeCriticalCards.length,
    toReviewCardsNumber: toReviewCards.length,
    learnedCardsNumber: learnedCards.length,

    currentCard: currentCard,
    currentCardRepeatInfo: currentCardRepeatInfo,

    answerCard: answer,
    nextCard: nextCard,

    ratingsList: ratingsList,
    isFinished: isFinished,
  };
}

export function useRepetitionAccuracy(ratingsList: number[]): number {
  return useMemo(() => {
    if (ratingsList.length !== 0) {
      let sum = 0;
      ratingsList.forEach((rating) => {
        return (sum += (rating - 1) / 2);
      });
      return Math.round((sum / ratingsList.length) * 1000) / 10;
    } else {
      console.log("No ratings available");
      return NaN;
    }
  }, [ratingsList]);
}
