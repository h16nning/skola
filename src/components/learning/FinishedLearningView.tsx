import React from "react";
import {
  Center,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Button,
  Image,
} from "@mantine/core";
import { swap } from "../../logic/ui";
import { IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";

interface FinishedLearningViewProps {
  repetitions: number;
  time: StopwatchResult;
}

function FinishedLearningView({
  repetitions,
  time,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  return (
    <Center>
      <Stack spacing="xl" align="center" pt="xl">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Circle-icons-trophy_%28dark%29.svg/2048px-Circle-icons-trophy_%28dark%29.svg.png"
          maw="10rem"
          alt="placeholder trophy image"
        />
        <Title>Congratulations, Name!</Title>
        <Text align="center">
          You learned all cards of today for this deck. You can be proud of
          yourself!
        </Text>
        <Group>
          <LearningStat title="Super fast" value="35 sec" color="orange" />
          <LearningStat title="Accuracy" value="97%" color="green" />
          <LearningStat title="Repetitions" value={repetitions} color="blue" />
        </Group>
        <Button
          onClick={() => navigate("/home")}
          leftIcon={<IconHome />}
          size="md"
        >
          Go Home
        </Button>
      </Stack>
    </Center>
  );
}

function LearningStat({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <Paper
      sx={(theme) => ({
        border: "solid 1px",
        borderColor: swap(theme, color, 6, 6),
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        minWidth: "8rem",
      })}
    >
      <Stack align="center" spacing="xs">
        <Text
          sx={(theme) => ({
            fontSize: theme.fontSizes.sm,
            color: swap(theme, color, 6, 6),
          })}
        >
          {title}
        </Text>
        <Text
          sx={(theme) => ({ fontWeight: 700, color: swap(theme, color, 6, 6) })}
        >
          {value}
        </Text>
      </Stack>
    </Paper>
  );
}
export default FinishedLearningView;
