import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Paper } from "@/components/ui/Paper";
import { COLORS } from "@/lib/ColorIdentifier";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useCardsOf } from "@/logic/card/hooks/useCardsOf";
import { useSimplifiedStatesOf } from "@/logic/card/hooks/useSimplifiedStatesOf";
import { Deck } from "@/logic/deck/deck";
import { IconBolt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./DeckHeroSection.css";

const BASE = "deck-hero-section";

interface DeckHeroSectionProps {
  deck?: Deck;
  isDeckReady: boolean;
}

function DeckHeroSection({ deck }: DeckHeroSectionProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const [cards, areCardsReady] = useCardsOf(deck);
  const states = useSimplifiedStatesOf(cards);

  useHotkeys([["Space", startLearning]]);

  function isDone() {
    return states.new + states.learning + states.review === 0;
  }

  function startLearning() {
    cards?.length! > 0 &&
      navigate("/learn/" + deck?.id + (isDone() ? "/all" : ""));
  }

  const color = deck?.color ?? COLORS[0];

  if (!areCardsReady) {
    return (
      <Paper
        className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color}`}
        withTexture
        withBorder
      >
        <div className={`${BASE}__content`}>
          <h3 className={`deck-card-base__title ${BASE}__title`}>
            {deck?.name}
          </h3>
        </div>
      </Paper>
    );
  }

  if (!cards) {
    return (
      <Paper
        className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color}`}
        withTexture
        withBorder
      >
        <div className={`${BASE}__content`}>
          <h3 className={`deck-card-base__title ${BASE}__title`}>
            {deck?.name}
          </h3>
          <div className={`${BASE}__message`}>
            <p className={`${BASE}__message-title`}>
              {t("hero-deck-section.error")}
            </p>
          </div>
        </div>
      </Paper>
    );
  }

  if (cards.length === 0) {
    return (
      <Paper
        className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color}`}
        withTexture
        withBorder
      >
        <div className={`${BASE}__content`}>
          <h3 className={`deck-card-base__title ${BASE}__title`}>
            {deck?.name}
          </h3>
          <div className={`${BASE}__message`}>
            <p className={`${BASE}__message-title`}>
              {t("global.no-items-title")}
            </p>
            <p className={`${BASE}__message-subtitle`}>
              {t("hero-deck-section.no-cards")}
            </p>
          </div>
        </div>
      </Paper>
    );
  }

  if (isDone()) {
    return (
      <Paper
        className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color} ${BASE}--done`}
        withTexture
        withBorder
      >
        <div className={`${BASE}__content`}>
          <h3 className={`deck-card-base__title ${BASE}__title`}>
            {deck?.name}
          </h3>
          <div className={`${BASE}__message`}>
            <p className={`${BASE}__message-title`}>
              {t("hero-deck-section.all-cards-done-title")}
            </p>
            <p className={`${BASE}__message-subtitle`}>
              {t("hero-deck-section.all-cards-done-subtitle")}
            </p>
          </div>
        </div>
        <Button
          variant="subtle"
          className={`${BASE}__action-button`}
          onClick={startLearning}
        >
          {t("hero-deck-section.all-cards-done-learn-anyway")}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color}`}
      withTexture
      withBorder
    >
      <div className={`${BASE}__content`}>
        <h3 className={`deck-card-base__title ${BASE}__title`}>{deck?.name}</h3>
        <div className={`deck-card-base__details ${BASE}__details`}>
          {states.review > 0 && (
            <Badge variant="light">
              {t("deck.review-cards-label", { count: states.review })}
            </Badge>
          )}
          {states.new > 0 && (
            <Badge variant="light">
              {t("deck.new-cards-label", { count: states.new })}
            </Badge>
          )}
          {states.learning > 0 && (
            <Badge variant="light">
              {t("deck.learning-cards-label", { count: states.learning })}
            </Badge>
          )}
        </div>
      </div>
      <Button
        disabled={!deck || states.new + states.learning + states.review === 0}
        leftSection={<IconBolt />}
        className={`${BASE}__action-button`}
        onClick={startLearning}
      >
        {t("hero-deck-section.learn")}
      </Button>
    </Paper>
  );
}

export default DeckHeroSection;
