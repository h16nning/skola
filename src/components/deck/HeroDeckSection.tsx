import React from "react";
import { Button, createStyles, Group, Paper, Stack, Text } from "@mantine/core";
import { Deck } from "../../logic/deck";
import { swap } from "../../logic/ui";
import { IconBolt } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Card, CardsStats, CardType } from "../../logic/card";

interface HeroDeckSectionProps {
  deck?: Deck;
  cards: Card<CardType>[];
  stats: CardsStats;
}

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
  stat: {
    minWidth: "6rem",
    padding: theme.spacing.xs,

    borderRadius: theme.radius.sm,
  },
  statValue: { fontWeight: 700 },
  statName: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,
  },
}));
function HeroDeckSection({ deck, cards, stats }: HeroDeckSectionProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  return (
    <Paper className={classes.container}>
      <Stack spacing="md" align="center">
        <Group>
          <Stat value={stats.newCards ?? 0} name="New Cards" color="blue" />
          <Stat value={stats.learningCards ?? 0} name="Learning" color="red" />
          <Stat value={stats.dueCards ?? 0} name="Review" color="green" />
          <Stat value={stats.learnedCards ?? 0} name="Learned" color="yellow" />
          <Stat value={cards.length ?? 0} name="All" color="gray" />
        </Group>
        <Button
          disabled={
            !deck ||
            (stats.newCards === 0 &&
              stats.learningCards === 0 &&
              stats.dueCards === 0)
          }
          leftIcon={<IconBolt />}
          w="40%"
          size="md"
          onClick={() => navigate("/learn/" + deck?.id)}
        >
          Learn
        </Button>
      </Stack>
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
      <Stack spacing="0.25rem" align="center">
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
