import React, { useState, useEffect } from "react";
import { Button, Card, Text, Stack, Title } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { swap } from "../../logic/ui";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import { db } from "../../logic/db";

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
      <Stack spacing="xl" align="start">
        <Text>
          {usageQuota[0]}/{usageQuota[1]} bytes used
        </Text>

        <Card
          withBorder
          w="100%"
          sx={(theme) => ({
            borderColor: swap(theme, "red", 7, 5) + " !important",
          })}
        >
          <Stack spacing="md" align="start">
            <Title order={6}>Danger Zone</Title>
            <Text size="sm">
              This section contains potentially dangerous settings. Proceed with
              utmost caution!
            </Text>
            <Button
              leftIcon={<IconTrash />}
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
        dangerousAction={() => db.delete()}
        dangerousDependencies={[]}
        dangerousTitle="Delete all Data"
        dangerousDescription="This will delete all of your data including your cards, decks and settings. There is absolutely no way to recover. Are you sure you want to continue?"
        opened={deleteAllDataModalOpened}
        setOpened={setDeleteAllDataModalOpened}
      />
    </>
  );
}
