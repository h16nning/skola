import { Modal, Tabs } from "@mantine/core";
import React, { useState } from "react";
import ModalProps from "../../../components/ModalProps";
import { Deck } from "../../../logic/deck/deck";

import { IconClipboardText, IconJson, IconTxt } from "@tabler/icons-react";
import ImportFromJSON from "./ImportFromJSON";
import ImportFromPaste from "./ImportFromPaste";
import ImportFromPlainText from "./ImportFromPlainText";

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
        <Tabs
          orientation="horizontal"
          defaultValue="General"
          variant="pills"
          value={tab}
        >
          <Tabs.List>
            <Tabs.Tab
              value="cardsfrompaste"
              leftSection={<IconClipboardText />}
              onClick={() => setTab("cardsfrompaste")}
            >
              From Paste
            </Tabs.Tab>
            <Tabs.Tab
              value="cardsfromplaintext"
              leftSection={<IconTxt />}
              onClick={() => setTab("cardsfromplaintext")}
            >
              From Plain Text
            </Tabs.Tab>
            <Tabs.Tab
              value="deckfromjson"
              leftSection={<IconJson />}
              onClick={() => setTab("deckfromjson")}
            >
              From JSON
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
      {importStatus !== "passive" && importStatus}
    </Modal>
  );
}
