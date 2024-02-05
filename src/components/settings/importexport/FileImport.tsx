import React, { useEffect } from "react";
import { Button, Card, FileButton, Group, Text } from "@mantine/core";

interface FileImportProps {
  file: File | null;
  setFile: Function;
  setFileText: Function;
  acceptedFormats: string;
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
export default function FileImport({
  file,
  setFile,
  setFileText,
  acceptedFormats,
}: FileImportProps) {
  useEffect(() => {
    file && readFile(file, setFileText);
  }, [file]);

  return (
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
          accept={acceptedFormats}
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
  );
}
