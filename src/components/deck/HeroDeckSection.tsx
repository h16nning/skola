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
import { swap, swapMono } from "../../logic/ui";
import { IconBolt } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Card, CardsStats, CardType } from "../../logic/card";

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
  },
  stat: {
    minWidth: "6rem",
    padding: theme.spacing.xs,

    borderRadius: theme.radius.sm,
  },
  statValue: { fontWeight: 600, fontSize: theme.fontSizes.lg },
  statName: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
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
              Practice anyways
            </Button>
          </Stack>
        ) : (
          <Stack spacing="md" align="center">
            <Group>
              <Stat value={stats.newCards ?? 0} name="New" color="blue" />
              <Stat
                value={stats.learningCards ?? 0}
                name="Learning"
                color="red"
              />
              <Stat value={stats.dueCards ?? 0} name="Review" color="green" />
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

function Stat({
  value,
  name,
  color,
}: {
  value: number;
  name: string;
  color: string;
}) {
  const { classes } = useStyles();

  return (
    <Paper
      className={classes.stat}
      sx={(theme) => ({ backgroundColor: swap(theme, color, 4, 9, 0.1) })}
    >
      <Stack spacing="0.125rem" align="center">
        <Text
          className={classes.statValue}
          sx={(theme) => ({ color: swap(theme, color, 6, 5) })}
        >
          {value}
        </Text>
        <Text
          className={classes.statName}
          sx={(theme) => ({ color: swap(theme, color, 9, 3, 0.75) })}
        >
          {name}
        </Text>
      </Stack>
    </Paper>
  );
}
export default HeroDeckSection;
