import classes from "./HeroDeckSection.module.css";

import React from "react";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Deck } from "../../../logic/deck";
import {
  IconBolt,
  IconBook,
  IconCircleArrowUpRight,
  IconSparkles,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Card, CardType, useSimplifiedStatesOf } from "../../../logic/card";
import Stat from "../../custom/Stat/Stat";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";

interface HeroDeckSectionProps {
  deck?: Deck;
  cards?: Card<CardType>[];
  isDeckReady: boolean;
  areCardsReady: boolean;
}

function HeroDeckSection({ deck, cards, areCardsReady }: HeroDeckSectionProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  useHotkeys([["Space", startLearning]]);

  const states = useSimplifiedStatesOf(cards);

  function isDone() {
    return states.new + states.learning + states.review === 0;
  }

  function startLearning() {
    navigate("/learn/" + deck?.id + (isDone() ? "/all" : ""));
  }

  return (
    <Paper className={classes.container} withBorder shadow="xs">
      {areCardsReady &&
        (!cards ? (
          <Text c="red" fw={700}>
            We have issues loading these cards. Please try again later.
          </Text>
        ) : cards.length === 0 ? (
          <Stack gap="0" align="center">
            <Text fz="md" fw={500}>
              It is looking empty here!
            </Text>
            <Text fz="sm" c="dimmed">
              Start by creating some cards!
            </Text>
          </Stack>
        ) : isDone() ? (
          <Stack gap="md" align="center">
            <Title order={3}>
              Congratulations! This deck is done for today!
            </Title>
            <Text fz="sm">
              Return back tomorrow or choose to practice anyway.
            </Text>
            <Button variant="subtle" w="50%" onClick={startLearning}>
              Practice anyway
            </Button>
          </Stack>
        ) : (
          <Stack gap="md" align="center" w="100%">
            <Group wrap="nowrap" w="100%" justify="center">
              <Stat
                value={states.new}
                name={t("deck.new-cards-label")}
                color="grape"
                icon={IconSparkles}
              />
              <Stat
                value={states.learning}
                name={t("deck.learning-cards-label")}
                color="orange"
                icon={IconCircleArrowUpRight}
              />
              <Stat
                value={states.review}
                name={t("deck.review-cards-label")}
                color="blue"
                icon={IconBook}
              />
            </Group>
            <Button
              disabled={
                !deck || states.new + states.learning + states.review === 0
              }
              leftSection={<IconBolt />}
              w="50%"
              onClick={startLearning}
            >
              Learn
            </Button>
          </Stack>
        ))}
    </Paper>
  );
}

export default HeroDeckSection;
