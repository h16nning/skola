import {
  Button,
  Card,
  FileButton,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import ModalProps from "../../custom/ModalProps";
import { Deck } from "../../../logic/deck";
import { newCard } from "../../../logic/card";
import { NormalCardUtils } from "../../../logic/CardTypeImplementations/NormalCard";

interface ImportCardsModalProps extends ModalProps {
  deck?: Deck;
}

function readFile(file: File, setFileText: Function) {
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target) {
      setFileText(event.target.result as string);
    }
  };
  reader.readAsText(file);
}

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
  Promise.all(cards.map((card) => newCard(card, deck)));
}

export default function ImportCardsModal({
  opened,
  setOpened,
  deck,
}: ImportCardsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);

  const [cardSeparator, setCardSeparator] = useState<string>("\n");
  const [questionAnswerSeperator, setQuestionAnswerSeperator] =
    useState<string>("\t");

  useEffect(() => {
    file && readFile(file, setFileText);
  }, [file]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        setFile(null);
      }}
      title="Import Cards"
    >
      <Stack align="start">
        <Card
          withBorder
          shadow="xs"
          w="100%"
          style={{ display: "flex", placeContent: "center" }}
        >
          {!file ? (
            <FileButton
              onChange={(f) => {
                setFile(f);
              }}
              accept=".csv, .txt, .md"
            >
              {(props) => <Button {...props}>Choose File</Button>}
            </FileButton>
          ) : (
            <Group justify="space-between" align="center" w="100%">
              <Text fz="sm" fw={500}>
                {file.name}
              </Text>{" "}
              <Button variant="default" onClick={() => setFile(null)}>
                Remove File
              </Button>
            </Group>
          )}
        </Card>
        <TextInput
          label="Question / Answer Separator"
          value={questionAnswerSeperator}
          onChange={(e) => setQuestionAnswerSeperator(e.currentTarget.value)}
        />
        <Button
          style={{ alignSelf: "end" }}
          onClick={() =>
            importCards(fileText, deck, cardSeparator, questionAnswerSeperator)
          }
          disabled={!file || !fileText || !deck}
        >
          Import Cards
        </Button>
      </Stack>
    </Modal>
  );
}
