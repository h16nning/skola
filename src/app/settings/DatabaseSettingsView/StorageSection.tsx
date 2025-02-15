import { Group, Paper, RingProgress, Text } from "@mantine/core";
import { t } from "i18next";
import { useEffect, useState } from "react";

type StorageInfo = StorageEstimate & {
  usageString?: string;
  quotaString?: string;
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

async function calulateStorageInfo(setStorageInfo: Function) {
  if (navigator.storage && navigator.storage.estimate) {
    const estimation = await navigator.storage.estimate();
    if (estimation.usage === undefined || estimation.quota === undefined)
      return;
    setStorageInfo({
      usage: estimation.usage,
      quota: estimation.quota,
      usageString: formatBytes(estimation.usage),
      quotaString: formatBytes(estimation.quota),
    });
  }
}

export default function StorageSection() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({});

  useEffect(() => {
    calulateStorageInfo(setStorageInfo);
  }, []);

  return (
    <Paper w="100%" withBorder shadow="xs" p="sm" radius="sm">
      {storageInfo.usage !== undefined && storageInfo.quota !== undefined && (
        <Group justify="space-between">
          <RingProgress
            size={80}
            sections={[
              {
                value: (storageInfo.usage / storageInfo.quota) * 100,
                color: "forest",
              },
            ]}
            thickness={8}
            roundCaps
          />
          <Text fw={600}>
            {storageInfo.usageString} / {storageInfo.quotaString}{" "}
            {t("settings.database.storage-used")}
          </Text>
        </Group>
      )}
    </Paper>
  );
}
