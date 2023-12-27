import React from "react";
import {
  Button,
  createStyles,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Deck } from "../../logic/deck";
import { swapMono } from "../../logic/ui";
import {
  IconBolt,
  IconBook,
  IconCircleArrowUpRight,
  IconSparkles,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Card, CardsStats, CardType } from "../../logic/card";
import Stat from "../custom/Stat";
import { useTranslation } from "react-i18next";

interface HeroDeckSectionProps {
  deck?: Deck;
  cards?: Card<CardType>[];
  stats: CardsStats;
  isDeckReady: boolean;
  areCardsReady: boolean;
}

const useStyles = createStyles((theme) => ({
  container: {
    border: "solid 1px " + swapMono(theme, 2, 5),
    boxShadow: theme.shadows.xs,
    height: "15rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    textAlign: "center",
    width: "100%",
  },
}));
function HeroDeckSection({
  deck,
  isDeckReady,
  cards,
  areCardsReady,
  stats,
}: HeroDeckSectionProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();

  function isDone() {
    return (
      stats.newCards === 0 && stats.learningCards === 0 && stats.dueCards === 0
    );
  }

  return (
    <Paper className={classes.container}>
      {areCardsReady &&
        (!cards ? (
          <Text c="red" fw={700}>
            We have issues loading these cards. Please ry again later.
          </Text>
        ) : cards.length === 0 ? (
          <Stack spacing="0" align="center">
            <Text fz="sm" fw={500}>
              It is looking empty here!
            </Text>
            <Text fz="sm" color="dimmed">
              Start by creating some cards!
            </Text>
          </Stack>
        ) : isDone() ? (
          <Stack spacing="md" align="center">
            <Title order={3}>
              Congratulations! This deck is done for today!
            </Title>
            <Text fz="sm">
              Return back tomorrow or choose to practice anyway.
            </Text>
            <Button
              variant="subtle"
              w="50%"
              onClick={() => navigate("/learn/" + deck?.id + "/all")}
            >
              Practice anyway
            </Button>
          </Stack>
        ) : (
          <Stack spacing="md" align="center">
            <Group>
              <Stat
                value={stats.newCards ?? 0}
                name={t("deck.new-cards-label")}
                color="grape"
                icon={IconSparkles}
              />
              <Stat
                value={stats.learningCards ?? 0}
                name={t("deck.learning-cards-label")}
                color="orange"
                icon={IconCircleArrowUpRight}
              />
              <Stat
                value={stats.dueCards ?? 0}
                name={t("deck.review-cards-label")}
                color="blue"
                icon={IconBook}
              />
            </Group>
            <Button
              disabled={
                !deck ||
                (stats.newCards === 0 &&
                  stats.learningCards === 0 &&
                  stats.dueCards === 0)
              }
              leftIcon={<IconBolt />}
              w="50%"
              onClick={() => navigate("/learn/" + deck?.id)}
            >
              Learn
            </Button>
          </Stack>
        ))}
    </Paper>
  );
}

export default HeroDeckSection;
