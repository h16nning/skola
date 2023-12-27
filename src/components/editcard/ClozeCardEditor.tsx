import React from "react";
import { Card, CardType, newCard, updateCard } from "../../logic/card";
import { EditMode } from "../../logic/CardTypeManager";
import { Deck } from "../../logic/deck";
import CardTextEditor, { useCardEditor } from "./CardTextEditor";
import { useHotkeys } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBracketsContain } from "@tabler/icons-react";

import { Mark } from "@tiptap/core";
import { Editor, mergeAttributes } from "@tiptap/react";
import { useMantineTheme } from "@mantine/core";
import { swap } from "../../logic/ui";

const Gap = Mark.create({
    name: 'gap',
    inline: true,
    exitable: true,
    group: 'inline',
    selectable: true,
    defaultTag: "span",
    addAttributes() {
        return {
            group: 0,
          }
    },
    parseHTML() {
      return [{ tag: 'span.gap' }];
    },
    renderHTML({ HTMLAttributes }) {
        const elem = document.createElement("span")
        const content = document.createElement("div")
        content.innerHTML = "Test: " + HTMLAttributes.group
        content.className = "inline-menu"
        elem.appendChild(content)

        Object.entries(
        mergeAttributes(HTMLAttributes, {class: 'gap' })
        ).forEach(([attr, val]) => elem.setAttribute(attr, val))

        elem.addEventListener('click', () => {
            console.log(HTMLAttributes.group)
            elem.classList.toggle('clicked')
        })

        return elem
      //return ['span', mergeAttributes(HTMLAttributes, {class: 'gap'}), 0];
    },
});

interface ClozeCardEditorProps {
    card: Card<CardType.Cloze> | null;
    deck: Deck;
    mode: EditMode;
}

/*async function finish(
mode: EditMode,
clear: Function,
deck: Deck,
card: Card<CardType.Cloze> | null,
editor: Editor | null,
) {
const cardInstance = createCardInstance(card, editor);
if (cardInstance !== null) {
    if (mode === "edit") {
    //SAVE
    try {
        console.log(cardInstance.id);
        const numberOfUpdatedRecords = await updateCard(
        cardInstance.id,
        cardInstance
        );
        if (numberOfUpdatedRecords === 0) {
        saveFailed();
        return;
        }
        successfullySaved();
    } catch (error) {
        saveFailed();
    }
    } else {
    //NEW
    try {
        await newCard(cardInstance, deck);
        clear && clear();
        successfullyAdded();
    } catch (error) {
        addFailed();
    }
    }
}
}*/
 
/*function createCardInstance(
card: Card<CardType.Cloze> | null,
editor: Editor | null,
) {
return card
    ? ClozeCardUtils.update(
        {
        frame: ClozeFrame,
        back: backEditor?.getHTML() ?? "",
        },
        card
    )
    : ClozeCardUtils.create({
        front: frontEditor?.getHTML() ?? "",
        back: backEditor?.getHTML() ?? "",
    });
}*/

export default function ClozeCardEditor({
    card,
    deck,
    mode,
}: ClozeCardEditorProps) {

    const theme = useMantineTheme();

    useHotkeys([["mod+Enter", () => {}]]);
//fix sometime
    let editor = useCardEditor("", Gap);

    return (
        <CardTextEditor
            editor={editor}
            styles={{
                content: {
                    "& .gap": {
                        borderBottom: "2px solid " + swap(theme, "primary", 5,7),
                        backgroundColor: swap(theme, "primary", 0, 5),
                        borderRadius: theme.radius.xs,
                        padding: "0px 3px",
                        position: "relative",
                    },
                    "& .gap.clicked": {
                        backgroundColor: "red",
                    },
                    "& .inline-menu": {
                        position: "absolute",
                        bottom: "0px",
                        backgroundColor: theme.colorScheme === "light" ? "white" : theme.colors.dark[8],
                        borderRadius: theme.radius.xs,
                        padding: "3px 5px",
                        fontSize: "0.8em",
                        boxShadow: theme.shadows.sm,
                    }
                },
            }}
            controls={
                <RichTextEditor.Control
                    tabIndex={-1}
                    onClick={() => {
                        editor?.commands.toggleMark('gap', {group: Math.random()})
                        console.log(editor?.getHTML());
                    }}
                >
                    <IconBracketsContain />
                </RichTextEditor.Control>
            }
        />
    );
}
