import { Paper } from "@/components/ui/Paper";
import { t } from "i18next";
import { useEffect, useState } from "react";
import "./StorageSection.css";

const BASE = "storage-section";

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

function RingProgress({ percentage }: { percentage: number }) {
  const radius = 32;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={80} height={80} className={`${BASE}__ring`}>
      <circle
        className={`${BASE}__ring-background`}
        stroke="var(--theme-neutral-200)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={40}
        cy={40}
      />
      <circle
        className={`${BASE}__ring-progress`}
        stroke="var(--theme-primary-600)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={40}
        cy={40}
        transform="rotate(-90 40 40)"
      />
    </svg>
  );
}

export default function StorageSection() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({});

  useEffect(() => {
    calulateStorageInfo(setStorageInfo);
  }, []);

  return (
    <Paper withBorder className={BASE}>
      {storageInfo.usage !== undefined && storageInfo.quota !== undefined && (
        <div className={`${BASE}__content`}>
          <RingProgress
            percentage={(storageInfo.usage / storageInfo.quota) * 100}
          />
          <p className={`${BASE}__text`}>
            {storageInfo.usageString} / {storageInfo.quotaString}{" "}
            {t("settings.database.storage-used")}
          </p>
        </div>
      )}
    </Paper>
  );
}
