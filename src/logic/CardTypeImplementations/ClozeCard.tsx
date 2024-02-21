import { Text } from "@mantine/core";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  toPreviewString,
  updateCard,
} from "../card";
import { Deck } from "../deck";
import {
  createSharedValue,
  registerReferencesToSharedValue,
  setSharedValue,
  useSharedValue,
} from "../sharedvalue";
import classes from "./ClozeCard.module.css";

export type ClozeContent = {
  occlusionNumber: number;
  textReferenceId: string;
};

export const ClozeCardUtils: CardTypeManager<CardType.Cloze> = {
  update(params: { text: string }, existingCard: Card<CardType.Cloze>) {
    setSharedValue(existingCard.content.textReferenceId, params.text);
    updateCard(existingCard.id, {
      preview: toPreviewString(
        params.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
          match.slice(6, -2)
        )
      ),
    });
    return { preview: toPreviewString(params.text), ...existingCard };
  },

  create(params: {
    occlusionNumber: number;
    textReferenceId: string;
    text: string;
  }): Card<CardType.Cloze> {
    return {
      ...createCardSkeleton(),
      preview: toPreviewString(
        params.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
          match.slice(6, -2)
        )
      ),
      content: {
        type: CardType.Cloze,
        occlusionNumber: params.occlusionNumber,
        textReferenceId: params.textReferenceId,
      },
    };
  },

  displayQuestion(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={true} card={card} />;
  },
  displayAnswer(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={false} card={card} />;
  },
  displayInNotebook(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={false} card={card} />;
  },
  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },
};

function ClozeCardComponent({
  occluded,
  card,
}: { occluded: boolean; card: Card<CardType.Cloze> }) {
  const sharedValue = useSharedValue(card.content.textReferenceId);
  let finalText = sharedValue?.value ?? "";
  finalText = finalText.replace(
    new RegExp(`{{c${card.content.occlusionNumber}::((?!{{|}}).)*}}`, "g"),
    (match) =>
      `<span class="cloze-field"><span class="cloze-content ${
        occluded && "occluded"
      }">${match}</span></span>`
  );
  finalText = finalText.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
    match.slice(6, -2)
  );
  return (
    <Text
      dangerouslySetInnerHTML={{ __html: finalText }}
      className={classes.clozeCard}
    />
  );
}

export async function createClozeCardSet(params: {
  text: string;
  occlusionNumberSet: number[];
}): Promise<Card<CardType.Cloze>[]> {
  const textReferenceId = await createSharedValue(params.text);
  const createdCards = params.occlusionNumberSet.map((occlusionNumber) =>
    ClozeCardUtils.create({
      occlusionNumber: occlusionNumber,
      textReferenceId: textReferenceId,
      text: params.text,
    })
  );
  await registerReferencesToSharedValue(
    textReferenceId,
    createdCards.map((card) => card.id)
  );
  return createdCards;
}
