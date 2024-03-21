import { Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { getUtilsOfType } from "../../../logic/TypeManager";
import { NoteType, newCard } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import FileImport from "./FileImport";
import ImportButton from "./ImportButton";
import { ImportFromSourceProps } from "./ImportModal";

interface ImportFromPlainTextProps extends ImportFromSourceProps {}

async function importCards(
  fileText: string | null,
  deck: Deck | undefined,
  cardSeparator: string,
  questionAnswerSeperator: string
) {
  if (!fileText || !deck) {
    return;
  }
  const questionAnswerPairs = fileText.split(cardSeparator).map((line) => {
    return line.split(questionAnswerSeperator);
  });

  const cards = await Promise.all(
    questionAnswerPairs.map(async (pair) => {
      return getUtilsOfType(NoteType.Normal).createNote(
        {
          front: pair[0],
          back: pair[1],
        },
        deck
      );
    })
  );

  return Promise.all(cards.map((card) => newCard(card, deck)));
}

export default function ImportFromPlainText({
  file,
  setFile,
  fileText,
  setFileText,
  importStatus,
  setImportStatus,
  deck,
}: ImportFromPlainTextProps) {
  const [cardSeparator, _] = useState<string>("\n");
  const [questionAnswerSeperator, setQuestionAnswerSeperator] =
    useState<string>("\t");
  return (
    <Stack align="start">
      <FileImport
        file={file}
        setFile={setFile}
        setFileText={setFileText}
        acceptedFormats={".csv, .txt, .md"}
      />
      <TextInput
        label="Question / Answer Separator"
        value={questionAnswerSeperator}
        onChange={(e) => setQuestionAnswerSeperator(e.currentTarget.value)}
      />
      <ImportButton
        importFunction={async () => {
          await importCards(
            fileText,
            deck,
            cardSeparator,
            questionAnswerSeperator
          );
        }}
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!file || !fileText || !deck}
      />
    </Stack>
  );
}
