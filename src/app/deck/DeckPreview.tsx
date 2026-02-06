import { Badge, Paper } from "@/components/ui";
import { useCardsOf } from "@/logic/card/hooks/useCardsOf";
import { useSimplifiedStatesOf } from "@/logic/card/hooks/useSimplifiedStatesOf";
import { Alert } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Deck } from "../../logic/deck/deck";
import "./DeckPreview.css";
import { COLORS } from "@/lib/ColorIdentifier";

type DeckPreviewProps = {
  deck: Deck;
  i: number;
};

const BASE = "deck-preview";

export default function DeckPreview({ deck }: DeckPreviewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [cards] = useCardsOf(deck);
  const states = useSimplifiedStatesOf(cards);

  const color = deck.color ?? COLORS[0];
  return deck ? (
    <Paper
      className={`${BASE} ${BASE}--color-${color}`}
      onClick={() => navigate(`/deck/${deck.id}`)}
      withTexture
      withBorder
    >
      <div className={`${BASE}__footer`}>
        <h3 className={`${BASE}__title`}>{deck.name}</h3>
        <div className={`${BASE}__details`}>
          {states.review > 0 ? (
            <Badge variant="light">
              {t("deck.review-cards-label", { count: states.review })}
            </Badge>
          ) : (
            <></>
          )}
          {states.new > 0 ? (
            <Badge variant="light">
              {t("deck.new-cards-label", { count: states.new })}
            </Badge>
          ) : (
            <></>
          )}
          {states.learning > 0 ? (
            <Badge variant="light">
              {t("deck.learning-cards-label", {
                count: states.learning,
              })}
            </Badge>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Paper>
  ) : (
    <Alert title="Error" color="red" variant="filled">
      {t("deck.error-failed-to-load")}
    </Alert>
  );
}
