import { Table } from "@mantine/core";
import cx from "clsx";
import { useEffect } from "react";
import { getUtils } from "../../logic/TypeManager";
import { CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Note } from "../../logic/note";
import classes from "./CardTable.module.css";

export function NoteTableItem({
  note,
  index,
  selectedIndex,
  setSelectedIndex,
  setSelectedNote,
}: {
  note: Note<CardType>;
  index: number;
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedNote: Note<CardType> | undefined;
  setSelectedNote: Function;
}) {
  const [deck] = useDeckOf(note);

  useEffect(() => {
    if (selectedIndex === index) {
      setSelectedNote(note);
    }
  }, [selectedIndex, setSelectedNote, index, note]);

  /*const [preview, setPreview] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const preview = getUtils(card).displayPreview(card);
    if (preview instanceof Promise) {
      preview.then((preview) => setPreview(preview));
    } else {
      setPreview(preview);
    }
  }, [card]);*/

  return (
    <Table.Tr
      className={cx(classes.tr, classes.bodyTr, {
        [classes.selected]: selectedIndex === index,
      })}
      onClick={() => setSelectedIndex(index)}
    >
      <Table.Td className={classes.td}>
        {getUtils(note).getSortFieldFromNoteContent(note.content)}
      </Table.Td>
      <Table.Td className={classes.td}>{note.content.type}</Table.Td>

      <Table.Td className={classes.td}>{deck?.name ?? "?"}</Table.Td>
      <Table.Td className={classes.td}>
        {note.creationDate.toLocaleDateString()}
      </Table.Td>
    </Table.Tr>
  );
}
