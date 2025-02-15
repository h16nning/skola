import { Button } from "@mantine/core";
import React from "react";
import { ImportStatus } from "./ImportModal";

interface ImportButtonProps {
  importFunction: () => Promise<void>;
  importStatus: ImportStatus;
  setImportStatus: (status: ImportStatus) => void;
  disabled: boolean;
}

export default function ImportButton({
  importFunction,
  importStatus,
  setImportStatus,
  disabled,
}: ImportButtonProps) {
  return (
    <Button
      style={{ alignSelf: "end" }}
      loading={importStatus === "importing"}
      disabled={disabled}
      onClick={async () => {
        setImportStatus("importing");
        try {
          await importFunction();
        } catch {
          setImportStatus("error");
          return;
        } finally {
          setImportStatus("success");
        }
      }}
    >
      Import and Add Cards
    </Button>
  );
}
