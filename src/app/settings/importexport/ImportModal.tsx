import ModalProps from "@/components/ModalProps";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Deck } from "@/logic/deck/deck";
import { IconClipboardText, IconJson, IconTxt } from "@tabler/icons-react";
import React, { useState } from "react";
import ImportFromJSON from "./ImportFromJSON";
import ImportFromPaste from "./ImportFromPaste";
import ImportFromPlainText from "./ImportFromPlainText";
import "./ImportModal.css";

const BASE_URL = "import-modal";

interface ImportModalProps extends ModalProps {
  deck?: Deck;
}

export interface ImportFromSourceProps {
  file: File | null;
  setFile: (file: File | null) => void;
  fileText: string | null;
  setFileText: (fileText: string | null) => void;
  importStatus: ImportStatus;
  setImportStatus: (status: ImportStatus) => void;
  deck?: Deck;
}

export type ImportStatus = "passive" | "importing" | "success" | "error";

export default function ImportModal({
  opened,
  setOpened,
  deck,
}: ImportModalProps) {
  const [tab, setTab] = useState("cardsfrompaste");
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>("passive");

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        setFile(null);
        setFileText(null);
      }}
      title="Import"
    >
      {(importStatus === "passive" || importStatus === "importing") && (
        <Tabs value={tab} onChange={setTab} variant="pills">
          <Tabs.List>
            <Tabs.Tab value="cardsfrompaste">
              <IconClipboardText size={16} />
              <span>From Paste</span>
            </Tabs.Tab>
            <Tabs.Tab value="cardsfromplaintext">
              <IconTxt size={16} />
              <span>From Plain Text</span>
            </Tabs.Tab>
            <Tabs.Tab value="deckfromjson">
              <IconJson size={16} />
              <span>From JSON</span>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="cardsfrompaste">
            <ImportFromPaste
              file={file}
              setFile={setFile}
              fileText={fileText}
              setFileText={setFileText}
              deck={deck}
              importStatus={importStatus}
              setImportStatus={setImportStatus}
            />
          </Tabs.Panel>
          <Tabs.Panel value="cardsfromplaintext">
            <ImportFromPlainText
              file={file}
              setFile={setFile}
              fileText={fileText}
              setFileText={setFileText}
              deck={deck}
              importStatus={importStatus}
              setImportStatus={setImportStatus}
            />
          </Tabs.Panel>
          <Tabs.Panel value="deckfromjson">
            <ImportFromJSON
              file={file}
              setFile={setFile}
              fileText={fileText}
              setFileText={setFileText}
              deck={deck}
              importStatus={importStatus}
              setImportStatus={setImportStatus}
            />
          </Tabs.Panel>
        </Tabs>
      )}
      {importStatus !== "passive" && (
        <div className={`${BASE_URL}__status`}>{importStatus}</div>
      )}
    </Modal>
  );
}
