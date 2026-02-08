import { Button } from "@/components/ui/Button";
import { Group } from "@/components/ui/Group";
import { Paper } from "@/components/ui/Paper";
import { Text } from "@/components/ui/Text";
import { useEffect } from "react";
import "./FileImport.css";

const BASE_URL = "file-import";

interface FileImportProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setFileText: (text: string | null) => void;
  acceptedFormats: string;
}

function readFile(file: File, setFileText: (text: string) => void) {
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

export default function FileImport({
  file,
  setFile,
  setFileText,
  acceptedFormats,
}: FileImportProps) {
  useEffect(() => {
    file && readFile(file, setFileText);
  }, [file, setFileText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <Paper withBorder shadow="xs" className={BASE_URL}>
      {!file ? (
        <label className={`${BASE_URL}__label`}>
          <input
            type="file"
            accept={acceptedFormats}
            onChange={handleFileChange}
            className={`${BASE_URL}__input`}
          />
          <Button as="span">Choose File</Button>
        </label>
      ) : (
        <Group justify="space-between" align="center" style={{ width: "100%" }}>
          <Text size="sm" weight="medium">
            {file.name}
          </Text>
          <Button variant="default" onClick={() => setFile(null)}>
            Remove File
          </Button>
        </Group>
      )}
    </Paper>
  );
}
