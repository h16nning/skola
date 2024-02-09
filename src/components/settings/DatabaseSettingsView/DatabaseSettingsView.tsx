import classes from "./DatabaseSettingsView.module.css";
import React, { useState, useEffect } from "react";
import { Button, Card, Text, Stack, Title } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import DangerousConfirmModal from "../../custom/DangerousConfirmModal";
import { db } from "../../../logic/db";
import { useNavigate } from "react-router-dom";

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

        <Card withBorder className={classes.dangerZone}>
          <Stack gap="md" align="start">
            <Title order={6}>Danger Zone</Title>
            <Text size="sm">
              This section contains potentially dangerous settings. Proceed with
              utmost caution!
            </Text>
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
