import { useState } from "react";
import { Stack } from "../../../components/ui/Stack";
import { TextInput } from "../../../components/ui/TextInput";
import FileImport from "./FileImport";
import ImportButton from "./ImportButton";
import { ImportFromSourceProps } from "./ImportModal";
import { importCards } from "./importLogic";

interface ImportFromPlainTextProps extends ImportFromSourceProps {}

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
    <Stack align="start" gap="md">
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
        style={{ width: "100%" }}
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
