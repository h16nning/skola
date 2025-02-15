import EmptyNotice from "@/components/EmptyNotice";
import Stat from "@/components/Stat/Stat";
import { Card } from "@/logic/card/card";
import { useSimplifiedStatesOf } from "@/logic/card/hooks/useSimplifiedStatesOf";
import { Deck } from "@/logic/deck/deck";
import { NoteType } from "@/logic/note/note";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import classes from "./HeroDeckSection.module.css";

import { useHotkeys } from "@mantine/hooks";
import {
  IconBolt,
  IconBook,
  IconCircleArrowUpRight,
  IconFile,
  IconSparkles,
} from "@tabler/icons-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface HeroDeckSectionProps {
  deck?: Deck;
  cards?: Card<NoteType>[];
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
            {t("hero-deck-section.error")}
          </Text>
        ) : cards.length === 0 ? (
          <EmptyNotice
            icon={IconFile}
            description={t("hero-deck-section.no-cards")}
          />
        ) : isDone() ? (
          <Stack gap="md" align="center">
            <Title order={3}>
              {t("hero-deck-section.all-cards-done-title")}
            </Title>
            <Text fz="sm">
              {t("hero-deck-section.all-cards-done-subtitle")}
            </Text>
            <Button variant="subtle" w="50%" onClick={startLearning}>
              {t("hero-deck-section.all-cards-done-learn-anyway")}
            </Button>
          </Stack>
        ) : (
          <Stack gap="md" align="center" w="100%">
            <Group
              wrap="nowrap"
              w="100%"
              justify="center"
              className={classes.statsGroup}
            >
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
              {t("hero-deck-section.learn")}
            </Button>
          </Stack>
        ))}
    </Paper>
  );
}

export default HeroDeckSection;
