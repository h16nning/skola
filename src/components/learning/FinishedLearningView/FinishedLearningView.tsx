import classes from "./FinishedLearningView.module.css";
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
import { useTranslation } from "react-i18next";

interface FinishedLearningViewProps {
  ratingsList: number[];
  time: StopwatchResult;
  deckId: string | undefined;
}

function FinishedLearningView({
  ratingsList,
  time,
  deckId,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
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
          {t("learning.finished-congratulations")}
        </Text>
        <Group wrap="nowrap">
          <Stat
            name={t("learning.finished-duration")}
            value={
              time ? time.minutes + "m " + time.seconds + "s" : "not available"
            }
            icon={IconClockHour9}
            color="orange"
            width="7rem"
          />
          <Stat
            name={t("learning.finished-accuracy-ratio")}
            value={accuracy ? accuracy + "%" : "not available"}
            icon={IconTrophy}
            color="green"
            width="7rem"
          />
          <Stat
            name={t("learning.finished-repetions-count")}
            value={ratingsList.length}
            icon={IconTallymarks}
            color="blue"
            width="7rem"
          />
        </Group>
        <Group>
          <Button
            onClick={() => navigate(`/deck/${deckId}`)}
            size="md"
            variant="subtle"
          >
            {t("learning.finished-button-to-deck")}
          </Button>
          <Button
            onClick={() => navigate("/home")}
            leftSection={<IconHome />}
            size="md"
          >
            {t("learning.finished-button-home")}
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default FinishedLearningView;
