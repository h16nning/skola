import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconClockHour9,
  IconHome,
  IconTallymarks,
  IconTrophy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StopwatchResult } from "react-timer-hook";
import { useSetting } from "../../../logic/Settings";
import { useRepetitionAccuracy } from "../../../logic/learn";
import { DeckStatistics, writeStatistics } from "../../../logic/statistics";
import Stat from "../../custom/Stat/Stat";
import classes from "./FinishedLearningView.module.css";

interface FinishedLearningViewProps {
  time: StopwatchResult;
  deckId: string | undefined;
  statistics: DeckStatistics;
}

function FinishedLearningView({
  statistics,
  time,
  deckId,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [name] = useSetting("name");

  const accuracy = useRepetitionAccuracy(statistics.ratingsList);
  const [wroteStatistics, setWroteStatistics] = useState<boolean>(false);

  useHotkeys([
    ["Space", () => navigate("/home")],
    ["Enter", () => navigate("/home")],
    ["d", () => navigate(`/deck/${deckId}`)],
  ]);

  useEffect(() => {
    if (wroteStatistics) return;
    if (!deckId) return;
    statistics.deck = deckId;
    writeStatistics(statistics);
    setWroteStatistics(true);
  }, [deckId]);

  return (
    <Center>
      <Stack gap="xl" align="center" pt="xl">
        <ThemeIcon size="6rem" radius="60%" className={classes.trophyIcon}>
          <IconTrophy stroke={0.75} size={50} />
        </ThemeIcon>
        <Title>
          {name
            ? t("learning.finished-congrats-name", { name: name })
            : t("learning.finished-congrats")}
        </Title>
        <Text style={{ textAlign: "center" }}>
          {t("learning.finished-info")}
        </Text>
        <Group wrap="nowrap" w="100%" maw="600px">
          <Stat
            name={t("learning.finished-duration")}
            value={
              time ? time.minutes + "m " + time.seconds + "s" : "not available"
            }
            icon={IconClockHour9}
            color="orange"
          />
          <Stat
            name={t("learning.finished-accuracy-ratio")}
            value={accuracy ? accuracy + "%" : "not available"}
            icon={IconTrophy}
            color="green"
          />
          <Stat
            name={t("learning.finished-repetions-count")}
            value={statistics.ratingsList.length}
            icon={IconTallymarks}
            color="blue"
          />
        </Group>
        <Stack gap="sm">
          <Button
            onClick={() => navigate("/home")}
            leftSection={<IconHome />}
            size="md"
          >
            {t("learning.finished-button-home")}
          </Button>
          <Button
            onClick={() => navigate(`/deck/${deckId}`)}
            size="md"
            variant="subtle"
          >
            {t("learning.finished-button-to-deck")}
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}

export default FinishedLearningView;
