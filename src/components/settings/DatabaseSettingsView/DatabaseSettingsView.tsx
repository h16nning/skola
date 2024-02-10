import { Button, Card, FileButton, Stack, Text, Title } from "@mantine/core";
import {
  IconDatabaseExport,
  IconDatabaseImport,
  IconTrash,
} from "@tabler/icons-react";
import { exportDB, importInto } from "dexie-export-import";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../logic/db";
import DangerousConfirmModal from "../../custom/DangerousConfirmModal";
import classes from "./DatabaseSettingsView.module.css";

async function showEstimatedQuota(setUsageQuota: Function) {
  if (navigator.storage && navigator.storage.estimate) {
    const estimation = await navigator.storage.estimate();
    if (estimation.usage === undefined || estimation.quota === undefined)
      return;
    setUsageQuota([
      estimation.usage / 1_000_000_000,
      estimation.quota / 1_000_000_000,
    ]);
  }
}

export default function DatabaseSettingsView() {
  const navigate = useNavigate();
  const [deleteAllDataModalOpened, setDeleteAllDataModalOpened] =
    useState<boolean>(false);
  const [usageQuota, setUsageQuota] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);

  useEffect(() => {
    showEstimatedQuota(setUsageQuota);
  }, []);

  return (
    <>
      <Stack gap="xl" align="start">
        <Text>
          {usageQuota[0]}/{usageQuota[1]} bytes used
        </Text>
        <Button
          leftSection={<IconDatabaseExport />}
          onClick={async () => {
            const now = new Date(Date.now());
            const blob = await exportDB(db);
            //convert blob to file and download it
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `skola-export-${now.toLocaleDateString()}-${now.toLocaleTimeString()}.json`;
            a.click();
          }}
        >
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
