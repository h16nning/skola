import { Button, Card, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import FileImport from "./FileImport";
import { ImportFromSourceProps } from "./ImportModal";
import { Deck } from "../../../logic/deck";
import { NormalCardUtils } from "../../../logic/CardTypeImplementations/NormalCard";
import { newCard } from "../../../logic/card";
import ImportButton from "./ImportButton";

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
  const cards = fileText.split(cardSeparator).map((line) => {
    const [question, answer] = line.split(questionAnswerSeperator);
    return NormalCardUtils.create({ front: question, back: answer });
  });
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
  const [cardSeparator, setCardSeparator] = useState<string>("\n");
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
