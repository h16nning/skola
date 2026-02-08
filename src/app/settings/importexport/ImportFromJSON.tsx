import { Paper } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { Deck } from "@/logic/deck/deck";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import FileImport from "./FileImport";
import ImportButton from "./ImportButton";
import { ImportFromSourceProps, ImportStatus } from "./ImportModal";

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
    <Stack align="start" gap="md">
      {step === "selectFile" || !file ? (
        <>
          <Paper>
            You can import decks from JSON here such as those exportable using
            CrowdAnki. Please note, that there is only basic options and no
            media support.
          </Paper>

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
              } catch {
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
}: {
  extractedData: ExtractedData | null;
  importStatus: ImportStatus;
  setImportStatus: (status: ImportStatus) => void;
  deck?: Deck;
}) {
  const [frontField, setFrontField] = useState<string | null>(null);
  const [backField, setBackField] = useState<string | null>(null);

  if (!extractedData) {
    return null;
  }

  return (
    <Stack align="start" gap="md">
      <Text size="sm">Deck Name: {extractedData.name}</Text>
      <Text size="sm">Deck Description: {extractedData.description}</Text>
      <Text size="sm">Card Number: {extractedData.cards.length}</Text>
      <Select
        label="Front"
        data={extractedData.fields}
        value={frontField}
        onChange={(value) => setFrontField(value)}
        style={{ width: "100%" }}
      />
      <Select
        label="Back"
        data={extractedData.fields}
        value={backField}
        onChange={(value) => setBackField(value)}
        style={{ width: "100%" }}
      />
      <ImportButton
        importFunction={async () => console.log("not supported right now")}
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!frontField || !backField}
      />
    </Stack>
  );
}
