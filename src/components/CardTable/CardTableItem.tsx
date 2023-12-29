import classes from "./CardTable.module.css";
import cx from "clsx";
import React, { useEffect } from "react";
import { Card, CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { getUtils } from "../../logic/CardTypeManager";

export function CardTableItem({
  card,
  index,
  selectedIndex,
  setSelectedIndex,
  setSelectedCard,
}: {
  card: Card<CardType>;
  index: number;
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedCard: Card<CardType> | undefined;
  setSelectedCard: Function;
}) {
  const [deck] = useDeckOf(card);

  useEffect(() => {
    if (selectedIndex === index) {
      setSelectedCard(card);
    }
  }, [selectedIndex, setSelectedCard, index, card]);

  const [preview, setPreview] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const preview = getUtils(card).displayPreview(card);
    if (preview instanceof Promise) {
      preview.then((preview) => setPreview(preview));
    } else {
      setPreview(preview);
    }
  }, [card]);

  return (
    <tr
      className={cx(classes.tr, classes.bodyTr, {
        [classes.selected]: selectedIndex === index,
      })}
      onClick={() => setSelectedIndex(index)}
    >
      <td className={classes.td}>{preview}</td>
      <td className={classes.td}>{card.content.type}</td>

      <td className={classes.td}>{deck?.name ?? "?"}</td>
      <td className={classes.td}>{card.creationDate.toLocaleDateString()}</td>
    </tr>
  );
}
