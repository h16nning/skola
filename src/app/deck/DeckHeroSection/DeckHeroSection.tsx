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

interface HeroWrapperProps {
  color: string;
  isDone?: boolean;
  isReady?: boolean;
  children: React.ReactNode;
}

interface MessageContentProps {
  title?: string;
  subtitle?: string;
}

function HeroWrapper({ color, isDone, isReady, children }: HeroWrapperProps) {
  const doneClass = isDone ? ` ${BASE}--done` : "";
  const invisibleClass = isReady === false ? " invisible" : "";
  return (
    <Paper
      className={`deck-card-base deck-card-base--color-${color} ${BASE} ${BASE}--color-${color}${doneClass}${invisibleClass}`}
      withTexture
      withBorder
    >
      {children}
    </Paper>
  );
}

function HeroContent({
  deck,
  children,
}: { deck?: Deck; children?: React.ReactNode }) {
  return (
    <div className={`${BASE}__content`}>
      <h3 className={`deck-card-base__title ${BASE}__title`}>{deck?.name}</h3>
      {children}
    </div>
  );
}

function MessageContent({ title, subtitle }: MessageContentProps) {
  return (
    <div className={`${BASE}__message`}>
      {title && <p className={`${BASE}__message-title`}>{title}</p>}
      {subtitle && <p className={`${BASE}__message-subtitle`}>{subtitle}</p>}
    </div>
  );
}

function DeckHeroSection({ deck, isDeckReady }: DeckHeroSectionProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const [cards, areCardsReady] = useCardsOf(deck);
  const states = useSimplifiedStatesOf(cards);

  const color = deck?.color ?? COLORS[0];
  const isDone = states.new + states.learning + states.review === 0;

  function startLearning() {
    if (cards?.length! > 0) {
      navigate("/learn/" + deck?.id + (isDone ? "/all" : ""));
    }
  }

  useHotkeys([["Space", startLearning]]);

  if (!areCardsReady) {
    return (
      <HeroWrapper color={color} isReady={isDeckReady}>
        <HeroContent deck={deck} />
      </HeroWrapper>
    );
  }

  if (!cards) {
    return (
      <HeroWrapper color={color}>
        <HeroContent deck={deck}>
          <MessageContent title={t("hero-deck-section.error")} />
        </HeroContent>
      </HeroWrapper>
    );
  }

  if (cards.length === 0) {
    return (
      <HeroWrapper color={color}>
        <HeroContent deck={deck}>
          <MessageContent
            title={t("global.no-items-title")}
            subtitle={t("hero-deck-section.no-cards")}
          />
        </HeroContent>
      </HeroWrapper>
    );
  }

  if (isDone) {
    return (
      <HeroWrapper color={color} isDone>
        <HeroContent deck={deck}>
          <MessageContent
            title={t("hero-deck-section.all-cards-done-title")}
            subtitle={t("hero-deck-section.all-cards-done-subtitle")}
          />
        </HeroContent>
        <Button
          variant="subtle"
          className={`${BASE}__action-button`}
          onClick={startLearning}
        >
          {t("hero-deck-section.all-cards-done-learn-anyway")}
        </Button>
      </HeroWrapper>
    );
  }

  return (
    <HeroWrapper color={color}>
      <HeroContent deck={deck}>
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
      </HeroContent>
      <Button
        disabled={!deck || isDone}
        leftSection={<IconBolt />}
        className={`${BASE}__action-button`}
        onClick={startLearning}
      >
        {t("hero-deck-section.learn")}
      </Button>
    </HeroWrapper>
  );
}

export default DeckHeroSection;
