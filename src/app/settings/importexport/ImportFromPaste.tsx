import { useEffect, useState } from "react";
import { Stack } from "../../../components/ui/Stack";
import { TextInput } from "../../../components/ui/TextInput";
import { Textarea } from "../../../components/ui/Textarea";
import ImportButton from "./ImportButton";
import { ImportFromSourceProps } from "./ImportModal";
import { importCards } from "./importLogic";

interface ImportFromPasteProps extends ImportFromSourceProps {}

export default function ImportFromPaste({
  importStatus,
  setImportStatus,
  deck,
}: ImportFromPasteProps) {
  const [pastedText, setPastedText] = useState<string>("");
  const [cardSeparator] = useState<string>("\n");
  const [questionAnswerSeperator, setQuestionAnswerSeperator] =
    useState<string>("\t");

  useEffect(() => {
    if (importStatus === "success") {
      setPastedText("");
    }
  }, [importStatus]);

  return (
    <Stack align="start" gap="md">
      <Textarea
        label="Paste your cards here"
        placeholder="Question1&#9;Answer1&#10;Question2&#9;Answer2&#10;..."
        value={pastedText}
        onChange={(e) => setPastedText(e.currentTarget.value)}
        minRows={8}
        style={{ width: "100%" }}
      />
      <TextInput
        label="Question / Answer Separator"
        value={questionAnswerSeperator}
        onChange={(e) => setQuestionAnswerSeperator(e.currentTarget.value)}
        description="Default is Tab character. Change if your data uses a different separator."
        style={{ width: "100%" }}
      />
      <ImportButton
        importFunction={async () => {
          await importCards(
            pastedText,
            deck,
            cardSeparator,
            questionAnswerSeperator
          );
        }}
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!pastedText.trim() || !deck}
      />
    </Stack>
  );
}
