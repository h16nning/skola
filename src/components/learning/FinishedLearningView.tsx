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
  Card,
} from "@mantine/core";
import { swap } from "../../logic/ui";
import { IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { useHotkeys } from "@mantine/hooks";
import { useSetting } from "../../logic/Settings";

interface FinishedLearningViewProps {
  repetitions: number;
  time: StopwatchResult;
}

function FinishedLearningView({
  repetitions,
  time,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [name] = useSetting("name");

  useHotkeys([["Space", () => navigate("/home")]]);
  useHotkeys([["Enter", () => navigate("/home")]]);

  return (
    <Center>
      <Stack spacing="xl" align="center" pt="xl">
        <Image
          src={process.env.PUBLIC_URL + "/badge.svg"}
          maw="10rem"
          alt="placeholder trophy image"
        />
        <Title>Congratulations{name && ", " + name}!</Title>
        <Text align="center">
          You learned all cards of today for this deck. You can be proud of
          yourself!
        </Text>
        <Group>
          <LearningStat
            title="Duration"
            value={time.minutes + "m " + time.seconds + "s"}
            color="orange"
          />
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
    <Card
      sx={(theme) => ({
        boxShadow: theme.shadows.xs,
        border: "1px solid " + swap(theme, color, 4, 4),
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs,
        minWidth: "8rem",
      })}
    >
      <Stack align="center" spacing="0">
        <Text
          sx={(theme) => ({
            fontSize: theme.fontSizes.lg,
            fontWeight: 700,
            color: swap(theme, color, 6, 6),
          })}
        >
          {value}
        </Text>
        <Text
          sx={(theme) => ({
            fontSize: theme.fontSizes.sm,
            color: swap(theme, color, 8, 4),
          })}
        >
          {title}
        </Text>
      </Stack>
    </Card>
  );
}
export default FinishedLearningView;
