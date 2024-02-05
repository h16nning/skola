import { Button, FileInput, Select, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { ImportFromSourceProps, ImportStatus } from "./ImportModal";
import FileImport from "./FileImport";
import { IconChevronRight } from "@tabler/icons-react";
import ImportButton from "./ImportButton";
import { Deck, getDeck, newDeck } from "../../../logic/deck";
import { newCard } from "../../../logic/card";
import { NormalCardUtils } from "../../../logic/CardTypeImplementations/NormalCard";

interface ImportFromJSONProps extends ImportFromSourceProps {}
export default function ImportFromJSON({
  file,
  setFile,
  fileText,
  setFileText,
  importStatus,
  setImportStatus,
  deck,
}: ImportFromJSONProps) {
  const [step, setStep] = useState<"selectFile" | "options">("selectFile");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  return (
    <Stack align="start">
      {step === "selectFile" || !file ? (
        <>
          <Text fz="sm">
            By this you can import decks from JSON such as those exportable
            using CrowdAnki. Please note, that there is only basic options and
            no media support.
          </Text>

          <FileImport
            file={file}
            setFile={setFile}
            setFileText={setFileText}
            acceptedFormats={".json"}
          />
          <Button
            rightSection={<IconChevronRight />}
            onClick={async () => {
              let ed: ExtractedData | null = null;
              try {
                ed = await parseFile(fileText);
              } catch (e) {
                setImportStatus("error");
                return;
              } finally {
                if (ed) {
                  setExtractedData(ed);
                  setStep("options");
                  setImportStatus("passive");
                } else {
                  setImportStatus("error");
                }
              }
            }}
            style={{ alignSelf: "end" }}
            disabled={!file}
          >
            Parse File and Continue
          </Button>
        </>
      ) : (
        <ImportOptions
          extractedData={extractedData}
          importStatus={importStatus}
          setImportStatus={setImportStatus}
          deck={deck}
        />
      )}
    </Stack>
  );
}

interface ExtractedData {
  description: string;
  name: string;
  fields: { label: string; value: string }[];
  cards: { fields: string[] }[];
  warnMessages: string[];
}

async function parseFile(fileText: string | null): Promise<ExtractedData> {
  if (!fileText) {
    throw new Error("This file has no contents.");
  }
  const jsonObject = JSON.parse(fileText);
  const warnMessages: string[] = [];
  if (jsonObject.__type__ !== "Deck") {
    throw new Error("At the moment only decks can be imported from JSON");
  }
  const noteModels = jsonObject.note_models;
  if (!noteModels || noteModels.length === 0) {
    throw new Error("No note models found");
  } else if (noteModels.length > 1) {
    warnMessages.push(
      "Multiple note models found, only cards of the first one will be used"
    );
  }
  const firstNoteModel = noteModels[0];
  const cards = jsonObject.notes.map((note: any) => {
    return {
      fields: note.fields,
    };
  });
  return {
    description: jsonObject.desc,
    name: jsonObject.name,
    fields: firstNoteModel.flds.map((field: any) => ({
      label: field.name,
      value: field.ord.toString(),
    })),
    cards,
    warnMessages,
  };
}

function ImportOptions({
  extractedData,
  importStatus,
  setImportStatus,
  deck,
}: {
  extractedData: ExtractedData | null;
  importStatus: ImportStatus;
  setImportStatus: (status: ImportStatus) => void;
  deck?: Deck;
}) {
  const [frontField, setFrontField] = useState<string | null>(null);
  const [backField, setBackField] = useState<string | null>(null);
  console.log(extractedData?.fields);
  if (!extractedData) {
    return null;
  }
  return (
    <Stack align="start">
      <Text fz="sm">Deck Name: {extractedData.name}</Text>
      <Text fz="sm">Deck Description: {extractedData.description}</Text>
      <Text fz="sm">Card Number: {extractedData.cards.length}</Text>
      <Select
        label="Front"
        data={extractedData.fields}
        value={frontField}
        onChange={(value) => setFrontField(value)}
      ></Select>
      <Select
        label="Back"
        data={extractedData.fields}
        value={backField}
        onChange={(value) => setBackField(value)}
      ></Select>
      <ImportButton
        importFunction={async () => {
          await importFunction(
            frontField!,
            backField!,
            extractedData.name,
            extractedData.description,
            extractedData.cards,
            deck
          );
        }}
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!frontField || !backField}
      />
    </Stack>
  );
}

async function importFunction(
  frontField: string,
  backField: string,
  deckName: string,
  description: string,
  cards: { fields: string[] }[],
  superDeck: Deck | undefined
) {
  const frontFieldIndex = parseInt(frontField);
  const backFieldIndex = parseInt(backField);
  const newDeckId = await newDeck(deckName, superDeck, description);
  const newCards = cards.map((card) => {
    return NormalCardUtils.create({
      front: card.fields[frontFieldIndex],
      back: card.fields[backFieldIndex],
    });
  });
  const createdDeck = await getDeck(newDeckId.toString());
  if (!createdDeck) {
    throw new Error("Failed to get the created deck");
  }
  return Promise.all(newCards.map((card) => newCard(card, createdDeck)));
}
