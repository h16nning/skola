import { Collection, IndexableType, Table } from "dexie";
import { Card, CardType } from "./card";
import { getUtils } from "./CardTypeManager";

export default function selectCards(
  cards: Table<Card<CardType>>,
  deckGiven: boolean,
  filter: string,
  sort: [string, boolean],
  location: any
): Promise<Card<CardType>[] | undefined> {
  let filteredCards:
    | Table<Card<CardType>>
    | Collection<Card<CardType>, IndexableType> = cards;

  if (deckGiven) {
    const deckId = location.pathname.split("/")[2];
    filteredCards = filteredCards.where("deck").equals(deckId);
  }
  if (filter.length > 0) {
    console.log(filter);
    filteredCards = filteredCards.filter((card) =>
      // @ts-ignore
      card.content.front.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return filteredCards.toArray().then((cards) => {
    if (sort[0] === "front") {
      if (sort[1]) {
        return cards.sort((a, b) => {
          return getUtils(a)
            .displayPreview(a)
            .localeCompare(getUtils(b).displayPreview(b));
        });
      } else {
        return cards.sort((a, b) => {
          return getUtils(b)
            .displayPreview(b)
            .localeCompare(getUtils(a).displayPreview(a));
        });
      }
    } else if (sort[0] === "creation_date") {
      if (sort[1]) {
        return cards.sort((a, b) => {
          return a.creationDate.getTime() - b.creationDate.getTime();
        });
      } else {
        return cards.sort((a, b) => {
          return b.creationDate.getTime() - a.creationDate.getTime();
        });
      }
    } else {
      return cards;
    }
  });
}
