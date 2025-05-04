interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
  excludeAcceptAllOption?: boolean;
}

declare function showSaveFilePicker(
  options?: SaveFilePickerOptions
): Promise<FileSystemFileHandle>;

import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import { Button, Card, FileButton, Stack, Text, Title } from "@mantine/core";
import {
  IconDatabaseExport,
  IconDatabaseImport,
  IconTrash,
} from "@tabler/icons-react";
import { exportDB, importInto } from "dexie-export-import";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../logic/db";
import classes from "./DatabaseSettingsView.module.css";
import StorageSection from "./StorageSection";

export default function DatabaseSettingsView() {
  const navigate = useNavigate();
  const [deleteAllDataModalOpened, setDeleteAllDataModalOpened] =
    useState<boolean>(false);

  const handleExport = async () => {
    const now = new Date();
    const blob = await exportDB(db);
    const filename = `skola-export-${now.toLocaleDateString()}-${now.toLocaleTimeString()}.json`;

    if ("showSaveFilePicker" in window) {
      try {
        const fileHandle = await showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: "JSON file",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (error) {
        console.error("Export cancelled or failed:", error);
      }
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    }
  };

  return (
    <>
      <Stack gap="xl" align="start">
        <StorageSection />
        <Button leftSection={<IconDatabaseExport />} onClick={handleExport}>
          Export All
        </Button>
        <Card withBorder className={classes.dangerZone}>
          <Stack gap="md" align="start">
            <Title order={6}>Danger Zone</Title>
            <Text size="sm">
              This section contains potentially dangerous settings. Proceed with
              utmost caution!
            </Text>
            <FileButton
              onChange={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    if (event.target) {
                      const blob = new Blob([event.target.result as string], {
                        type: "application/json",
                      });
                      try {
                        await importInto(db, blob, { overwriteValues: true });
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  };
                  reader.readAsText(file);
                }
              }}
              accept=".json"
            >
              {(props) => (
                <Button
                  leftSection={<IconDatabaseImport />}
                  color="red"
                  {...props}
                >
                  Import Database (overwrites conflicting data, e.g. settings)
                </Button>
              )}
            </FileButton>
            <Button
              leftSection={<IconTrash />}
              variant="filled"
              color="red"
              onClick={() => setDeleteAllDataModalOpened(true)}
            >
              Delete all Data
            </Button>
          </Stack>
        </Card>
      </Stack>
      <DangerousConfirmModal
        dangerousAction={() => {
          db.delete();
          navigate("/home");
          window.location.reload();
        }}
        dangerousDependencies={[]}
        dangerousTitle="Delete all Data"
        dangerousDescription="This will delete all of your data including your cards, decks and settings. There is absolutely no way to recover. Are you sure you want to continue?"
        opened={deleteAllDataModalOpened}
        setOpened={setDeleteAllDataModalOpened}
      />
    </>
  );
}
