import React, { useCallback, useDebugValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card as MantineCard,
  Center,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDeckFromUrl } from "../logic/deck";
import { answerCard, Card, CardType, getCardsOf } from "../logic/card";
import MissingObject from "./MissingObject";
import { getUtils } from "../logic/CardTypeManager";
import { generalFail } from "./Notification";

interface LearnViewProps {}

function useLearning(
  cardSet: Card<CardType>[] | null
): [currentCard: Card<CardType> | null, next: Function, finished: boolean] {
  const [reservoir, setReservoir] = useState<Card<CardType>[]>([]);
  const [urgentQueue, setUrgentQueue] = useState<Card<CardType>[]>([]);
  const [currentCard, setCurrentCard] = useState<Card<CardType> | null>(null);

  const next = useCallback(() => {
    if (urgentQueue.length !== 0) {
      setCurrentCard(urgentQueue[0]);
      setUrgentQueue(urgentQueue.slice(1));
    } else {
      setCurrentCard(reservoir[0]);
      setReservoir(reservoir.slice(1));
    }
  }, [urgentQueue, reservoir]);

  const isFinished = useCallback(() => {
    return (
      currentCard === undefined &&
      reservoir.length === 0 &&
      urgentQueue.length === 0
    );
  }, [reservoir, urgentQueue, currentCard]);

  useEffect(() => {
    if (!currentCard && cardSet && cardSet[0]) {
      setCurrentCard(cardSet[0]);
      setReservoir(cardSet.slice(1));
    }
  }, [cardSet]);

  useDebugValue(currentCard);
  useDebugValue(urgentQueue);
  useDebugValue(reservoir);
  useDebugValue(isFinished());
  return [currentCard, next, isFinished()];
}
function LearnView({}: LearnViewProps) {
  const navigate = useNavigate();
  const [showingAnswer, setShowingAnswer] = useState<Boolean>(false);
  const [deck, failed] = useDeckFromUrl();
  const [cardSet, setCardSet] = useState<Card<CardType>[] | null>(null);
  const [currentCard, next, finished] = useLearning(cardSet);

  const answer = useCallback(
    async (quality: number) => {
      if (currentCard) {
        try {
          await answerCard(currentCard, quality);
          next();
          setShowingAnswer(false);
        } catch (error) {
          generalFail();
        }
      }
    },
    [next]
  );

  useEffect(() => {
    getCardsOf(deck).then((cards) => setCardSet(cards));
  }, [deck]);

  if (failed) {
    return <MissingObject />;
  }

  if (finished) {
    return <Text>Learning is finished</Text>;
  }
  // @ts-ignore
  return (
    <Center>
      <Stack w="600px">
        <Group>
          <Button onClick={() => navigate("/home")} variant="default">
            Quit Learning
          </Button>
        </Group>
        <MantineCard>
          <Stack>
            {currentCard ? (
              getUtils(currentCard).displayQuestion(
                // @ts-ignore
                currentCard
              )
            ) : (
              <></>
            )}
            <Divider />
            {showingAnswer && currentCard ? (
              getUtils(currentCard).displayAnswer(
                // @ts-ignore
                currentCard
              )
            ) : (
              <></>
            )}
          </Stack>
        </MantineCard>
        <Group>
          {showingAnswer ? (
            <Group spacing="xs">
              <Button color="red" onClick={() => answer(0)}>
                Again
              </Button>
              <Button color="yellow" onClick={() => answer(1)}>
                Hard
              </Button>
              <Button color="green" onClick={() => answer(3)}>
                Normal
              </Button>
              <Button color="blue" onClick={() => answer(5)}>
                Easy
              </Button>
            </Group>
          ) : (
            <Button onClick={() => setShowingAnswer(true)}>Show Answer</Button>
          )}
        </Group>
      </Stack>
    </Center>
  );
}

export default LearnView;
