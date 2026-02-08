import React from "react";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
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
  const isLoading = importStatus === "importing";

  return (
    <Button
      variant="primary"
      style={{ alignSelf: "end" }}
      disabled={disabled || isLoading}
      onClick={async () => {
        setImportStatus("importing");
        try {
          await importFunction();
          setImportStatus("success");
        } catch {
          setImportStatus("error");
        }
      }}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span>Importing...</span>
        </>
      ) : (
        "Import and Add Cards"
      )}
    </Button>
  );
}
