import { Paper } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import type { Deck } from "@/logic/deck/deck";
import { BasicNoteTypeAdapter } from "@/logic/type-implementations/normal/BasicNote";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import FileImport from "./FileImport";
import ImportButton from "./ImportButton";
import { ImportFromSourceProps, ImportStatus } from "./ImportModal";
import { bulkImportBasicNotes } from "./bulkImportBasicNotes";
import {
  type ExtractedCrowdAnkiData,
  importCrowdAnkiCards,
  parseCrowdAnkiFile,
} from "./crowdAnkiImport";

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
  const [extractedData, setExtractedData] =
    useState<ExtractedCrowdAnkiData | null>(null);
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
              let ed: ExtractedCrowdAnkiData | null = null;
              try {
                ed = parseCrowdAnkiFile(fileText);
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

function ImportOptions({
  extractedData,
  importStatus,
  setImportStatus,
  deck,
}: {
  extractedData: ExtractedCrowdAnkiData | null;
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
        options={extractedData.fields}
        value={frontField || ""}
        onChange={(value) => setFrontField(value || null)}
      />
      <Select
        label="Back"
        options={extractedData.fields}
        value={backField || ""}
        onChange={(value) => setBackField(value || null)}
      />
      <ImportButton
        importFunction={() =>
          importCrowdAnkiCards(
            extractedData,
            deck,
            frontField,
            backField,
            BasicNoteTypeAdapter.createNote,
            bulkImportBasicNotes
          )
        }
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!frontField || !backField || !deck}
      />
    </Stack>
  );
}
