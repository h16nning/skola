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
          You learned all cards for today of this deck.
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


export default FinishedLearningView;
