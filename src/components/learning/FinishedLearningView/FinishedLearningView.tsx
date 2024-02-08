import classes from "./FinishedLearningView.module.css";
import React, { useEffect } from "react";
import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconClockHour9,
  IconHome,
  IconTallymarks,
  IconTrophy,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { useHotkeys } from "@mantine/hooks";
import { useSetting } from "../../../logic/Settings";
import Stat from "../../custom/Stat/Stat";
import { useRepetitionAccuracy } from "../../../logic/learn";

interface FinishedLearningViewProps {
  ratingsList: number[];
  time: StopwatchResult;
}

function FinishedLearningView({
  ratingsList,
  time,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [name] = useSetting("name");

  const accuracy = useRepetitionAccuracy(ratingsList);

  useHotkeys([["Space", () => navigate("/home")]]);
  useHotkeys([["Enter", () => navigate("/home")]]);

  return (
    <Center>
      <Stack gap="xl" align="center" pt="xl">
        <ThemeIcon size="6rem" radius="60%" className={classes.trophyIcon}>
          <IconTrophy stroke={0.75} size={50} />
        </ThemeIcon>
        <Title>Congratulations{name && ", " + name}!</Title>
        <Text style={{ textAlign: "center" }}>
          You learned all cards for today of this deck.
        </Text>
        <Group wrap="nowrap">
          <Stat
            name="Duration"
            value={
              time ? time.minutes + "m " + time.seconds + "s" : "not available"
            }
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
            value={ratingsList.length}
            icon={IconTallymarks}
            color="blue"
            width="7rem"
          />
        </Group>
        <Button
          onClick={() => navigate("/home")}
          leftSection={<IconHome />}
          size="md"
        >
          Go Home
        </Button>
      </Stack>
    </Center>
  );
}

export default FinishedLearningView;
