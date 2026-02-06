import EmptyNotice from "@/components/EmptyNotice";
import Stat from "@/components/Stat/Stat";
import { Button } from "@/components/ui/Button";
import { Paper } from "@/components/ui/Paper";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useCardsOf } from "@/logic/card/hooks/useCardsOf";
import { useSimplifiedStatesOf } from "@/logic/card/hooks/useSimplifiedStatesOf";
import { Deck } from "@/logic/deck/deck";
import {
  IconBolt,
  IconBook,
  IconCircleArrowUpRight,
  IconFile,
  IconSparkles,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./HeroDeckSection.css";

const BASE_URL = "hero-deck-section";

interface HeroDeckSectionProps {
  deck?: Deck;
  isDeckReady: boolean;
}

function HeroDeckSection({ deck }: HeroDeckSectionProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  useHotkeys([["Space", startLearning]]);

  const [cards, areCardsReady] = useCardsOf(deck);
  const states = useSimplifiedStatesOf(cards);

  function isDone() {
    return states.new + states.learning + states.review === 0;
  }

  function startLearning() {
    navigate("/learn/" + deck?.id + (isDone() ? "/all" : ""));
  }

  return (
    <Paper className={BASE_URL} withBorder shadow="xs">
      {areCardsReady &&
        (!cards ? (
          <span className={`${BASE_URL}__error`}>
            {t("hero-deck-section.error")}
          </span>
        ) : cards.length === 0 ? (
          <EmptyNotice
            icon={IconFile}
            description={t("hero-deck-section.no-cards")}
          />
        ) : isDone() ? (
          <div className={`${BASE_URL}__content`}>
            <h3 className={`${BASE_URL}__title`}>
              {t("hero-deck-section.all-cards-done-title")}
            </h3>
            <p className={`${BASE_URL}__subtitle`}>
              {t("hero-deck-section.all-cards-done-subtitle")}
            </p>
            <Button
              variant="subtle"
              className={`${BASE_URL}__button`}
              onClick={startLearning}
            >
              {t("hero-deck-section.all-cards-done-learn-anyway")}
            </Button>
          </div>
        ) : (
          <div className={`${BASE_URL}__content`}>
            <div className={`${BASE_URL}__stats-group`}>
              <Stat
                value={states.new}
                name={t("deck.new-cards-label")}
                color="grape"
                icon={IconSparkles}
              />
              <Stat
                value={states.learning}
                name={t("deck.learning-cards-label")}
                color="orange"
                icon={IconCircleArrowUpRight}
              />
              <Stat
                value={states.review}
                name={t("deck.review-cards-label")}
                color="blue"
                icon={IconBook}
              />
            </div>
            <Button
              disabled={
                !deck || states.new + states.learning + states.review === 0
              }
              leftSection={<IconBolt />}
              className={`${BASE_URL}__button`}
              onClick={startLearning}
            >
              {t("hero-deck-section.learn")}
            </Button>
          </div>
        ))}
    </Paper>
  );
}

export default HeroDeckSection;
