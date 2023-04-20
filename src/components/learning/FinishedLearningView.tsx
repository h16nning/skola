import React from "react";
import {
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { swap } from "../../logic/ui";
import {
  IconClockHour9,
  IconHome,
  IconTallymarks,
  IconTrophy,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { useHotkeys } from "@mantine/hooks";
import { useSetting } from "../../logic/Settings";
import Stat from "../custom/Stat";
import { useRepetitionAccuracy } from "../../logic/learn";

interface FinishedLearningViewProps {
  repetitionList: number[];
  time: StopwatchResult;
}

function FinishedLearningView({
  repetitionList,
  time,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [name] = useSetting("name");

  const accuracy = useRepetitionAccuracy(repetitionList);

  useHotkeys([["Space", () => navigate("/home")]]);
  useHotkeys([["Enter", () => navigate("/home")]]);

  return (
    <Center>
      <Stack spacing="xl" align="center" pt="xl">
        <ThemeIcon
          variant="gradient"
          size="6rem"
          radius="50%"
          sx={(theme) => ({
            background: `linear-gradient(to bottom right, ${swap(
              theme,
              "primary",
              1,
              6,
              0.5
            )}, ${swap(theme, "primary", 4, 9, 0.5)})`,
            color: swap(theme, "primary", 5, 5),
          })}
        >
          <IconTrophy stroke={0.75} size={50} />
        </ThemeIcon>
        <Title>Congratulations{name && ", " + name}!</Title>
        <Text align="center">
          You learned all cards of today for this deck. You can be proud of
          yourself!
        </Text>
        <Group>
          <Stat
            name="Duration"
            value={time.minutes + "m " + time.seconds + "s"}
            icon={IconClockHour9}
            color="orange"
            width="7rem"
          />
          <Stat
            name="Accuracy"
            value={accuracy ? accuracy + "%" : "not available"}
            icon={IconTrophy}
            color="green"
            width="7rem"
          />
          <Stat
            name="Repetitions"
            value={repetitionList.length}
            icon={IconTallymarks}
            color="blue"
            width="7rem"
          />
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
