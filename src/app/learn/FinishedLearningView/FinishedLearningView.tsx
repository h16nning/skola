import { Button } from "@/components/ui/Button";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { Deck } from "@/logic/deck/deck";
import { useRepetitionAccuracy } from "@/logic/learn";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { DeckStatistics, writeStatistics } from "@/logic/statistics";
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
import "./FinishedLearningView.css";

const BASE = "finished-learning-view";

interface FinishedLearningViewProps {
  time: StopwatchResult;
  deck: Deck | undefined;
  statistics: DeckStatistics;
}

function FinishedLearningView({
  statistics,
  time,
  deck,
}: FinishedLearningViewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [name] = useSetting("name");

  const accuracy = useRepetitionAccuracy(statistics.ratingsList);
  const [wroteStatistics, setWroteStatistics] = useState<boolean>(false);

  useHotkeys([
    ["Space", () => navigate("/home")],
    ["Enter", () => navigate("/home")],
    ["d", () => navigate(`/deck/${deck?.id}`)],
  ]);

  useEffect(() => {
    if (wroteStatistics) return;
    if (!deck?.id) return;
    statistics.deck = deck.id;
    writeStatistics(statistics);
    setWroteStatistics(true);
  }, [deck?.id, wroteStatistics, statistics]);

  const deckColor = deck?.color || "lime";

  return (
    <div className={BASE} data-color={deckColor}>
      <div className={`${BASE}__content`}>
        <h1 className={`${BASE}__title`}>
          {name
            ? t("learning.finished-congrats-name", { name: name })
            : t("learning.finished-congrats")}
        </h1>
        <p className={`${BASE}__subtitle`}>{t("learning.finished-info")}</p>

        <div className={`${BASE}__stats`}>
          <div className={`${BASE}__stat`}>
            <IconClockHour9 className={`${BASE}__stat-icon`} size={32} />
            <div className={`${BASE}__stat-value`}>
              {time ? time.minutes + "m " + time.seconds + "s" : "—"}
            </div>
            <div className={`${BASE}__stat-label`}>
              {t("learning.finished-duration")}
            </div>
          </div>

          <div className={`${BASE}__stat`}>
            <IconTrophy className={`${BASE}__stat-icon`} size={32} />
            <div className={`${BASE}__stat-value`}>
              {accuracy ? accuracy + "%" : "—"}
            </div>
            <div className={`${BASE}__stat-label`}>
              {t("learning.finished-accuracy-ratio")}
            </div>
          </div>

          <div className={`${BASE}__stat`}>
            <IconTallymarks className={`${BASE}__stat-icon`} size={32} />
            <div className={`${BASE}__stat-value`}>
              {statistics.ratingsList.length}
            </div>
            <div className={`${BASE}__stat-label`}>
              {t("learning.finished-repetions-count")}
            </div>
          </div>
        </div>

        <div className={`${BASE}__actions`}>
          <Button
            onClick={() => navigate("/home")}
            leftSection={<IconHome />}
            size="lg"
            variant="white"
          >
            {t("learning.finished-button-home")}
          </Button>
          <Button
            onClick={() => navigate(`/deck/${deck?.id}`)}
            size="md"
            variant="transparent-ghost"
          >
            {t("learning.finished-button-to-deck")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinishedLearningView;
