import { useHotkeys } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBracketsContain } from "@tabler/icons-react";
import { EditMode } from "../../../logic/CardTypeManager";
import { Card, CardType, newCards } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import CardEditor, { useCardEditor } from "./CardEditor";
import classes from "./ClozeCardEditor.module.css";

import { Button, Stack, useMantineTheme } from "@mantine/core";
import { Mark } from "@tiptap/core";
import { Editor, mergeAttributes } from "@tiptap/react";
import { useCallback, useState } from "react";
import CardEditorFooter from "../CardEditorFooter";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import {
  ClozeCardUtils,
  createClozeCardSet,
} from "../../../logic/CardTypeImplementations/ClozeCard";
import { useSharedValue } from "../../../logic/sharedvalue";

//not used right now, use ui control or remove later
const Gap = Mark.create({
  name: "gap",
  inline: true,
  exitable: true,
  group: "inline",
  selectable: true,
  defaultTag: "span",
  addAttributes() {
    return {
      group: 0,
    };
  },
  parseHTML() {
    return [{ tag: "span.gap" }];
  },
  renderHTML({ HTMLAttributes }) {
    const elem = document.createElement("span");
    const content = document.createElement("div");
    content.innerHTML = "Test: " + HTMLAttributes.group;
    content.className = "inline-menu";
    elem.appendChild(content);

    Object.entries(mergeAttributes(HTMLAttributes, { class: "gap" })).forEach(
      ([attr, val]) => elem.setAttribute(attr, val)
    );

    elem.addEventListener("click", () => {
      console.log(HTMLAttributes.group);
      elem.classList.toggle("clicked");
    });

    return elem;
    //return ['span', mergeAttributes(HTMLAttributes, {class: 'gap'}), 0];
  },
});

interface ClozeCardEditorProps {
  card: Card<CardType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
}

export default function ClozeCardEditor({
  card,
  deck,
  mode,
}: ClozeCardEditorProps) {
  useHotkeys([["mod+Enter", () => {}]]);
  //fix sometime
  const editor = useCardEditor(
    useSharedValue(card?.content.textReferenceId ?? "")?.value ?? "",
    Gap
  );

  const clear = useCallback(() => {
    editor?.commands.setContent("");
    editor?.commands.focus();
  }, [editor]);

  return (
    <Stack gap="2rem">
      <CardEditor
        editor={editor}
        className={classes}
        controls={
          //not used right now, use ui control or remove later
          <RichTextEditor.Control
            tabIndex={-1}
            onClick={() => {
              editor?.commands.toggleMark("gap", { group: Math.random() });
              console.log(editor?.getHTML());
            }}
          >
            <IconBracketsContain />
          </RichTextEditor.Control>
        }
      />
      <CardEditorFooter
        finish={() => finish(mode, clear, deck, card, editor)}
        mode={mode}
      />
    </Stack>
  );
}

function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  card: Card<CardType.Cloze> | null,
  editor: Editor | null
) {
  if (mode === "edit") {
    //ISSUE newly introduced cards through edit are not recognized
    try {
      if (card) {
        ClozeCardUtils.update(
          {
            text: editor?.getHTML() ?? "",
          },
          card
        );
      }
      successfullySaved();
    } catch (error) {
      saveFailed();
    }
  } else {
    const occlusionNumberSet: number[] = getOcclusionNumberSet(
      editor?.getHTML() ?? ""
    );
    try {
      createClozeCardSet({
        text: editor?.getHTML() ?? "",
        occlusionNumberSet,
      }).then((cards) => newCards(cards, deck));
      clear();
      successfullyAdded();
    } catch (error) {
      addFailed();
    }
  }
}

function getOcclusionNumberSet(text: string) {
  const regex = /\{\{c\d::((?!\{\{|}}).)*\}\}/g;
  const matches = text.match(regex);
  const cardDigits = new Set<number>();
  matches?.forEach((match) => {
    const digit = parseInt(match[3]);
    cardDigits.add(digit);
  });
  return Array.from(cardDigits);
}
