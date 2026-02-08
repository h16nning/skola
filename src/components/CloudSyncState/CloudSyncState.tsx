import { db } from "@/logic/db";
import {
  IconCloudDownload,
  IconCloudOff,
  IconCloudUpload,
} from "@tabler/icons-react";
import { useObservable } from "dexie-react-hooks";
import "./CloudSyncState.css";

const BASE = "cloud-sync-state";

interface CloudSyncStateProps {
  minimal?: boolean;
}

export function CloudSyncState({ minimal = false }: CloudSyncStateProps) {
  const syncState = useObservable(db.cloud.syncState);
  const user = useObservable(db.cloud.currentUser);

  if (!syncState || !user?.isLoggedIn) {
    return null;
  }

  const { status, phase, progress } = syncState;

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "lime";
      case "connecting":
        return "orange";
      case "error":
      case "disconnected":
        return "red";
      default:
        return "neutral";
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case "pushing":
        return <IconCloudUpload size={14} />;
      case "pulling":
        return <IconCloudDownload size={14} />;
      case "offline":
        return <IconCloudOff size={14} />;
      case "error":
        return <IconCloudOff size={14} />;
      default:
        return null;
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "pushing":
        return "Uploading";
      case "pulling":
        return "Downloading";
      case "offline":
        return "Offline";
      case "error":
        return "Error";
      case "not-in-sync":
        return "Syncing";
      case "in-sync":
        return "Synced";
      case "initial":
        return "Starting";
      default:
        return "Idle";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Error";
      case "offline":
        return "Offline";
      default:
        return "Not started";
    }
  };

  const statusColor = getStatusColor();
  const phaseIcon = getPhaseIcon();
  const phaseLabel = getPhaseLabel();
  const statusLabel = getStatusLabel();
  const showProgress = progress !== undefined;

  const classes = [BASE, minimal && `${BASE}--minimal`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className={`${BASE}__indicator`}>
        <div
          className={`${BASE}__status-dot ${BASE}__status-dot--${statusColor}`}
        >
          <div className={`${BASE}__status-dot-inner`} />
        </div>
      </div>

      {!minimal && (
        <div className={`${BASE}__content`}>
          <div className={`${BASE}__labels`}>
            <span className={`${BASE}__status-label`}>{statusLabel}</span>
            <span className={`${BASE}__phase-label`}>{phaseLabel}</span>
          </div>

          {showProgress && (
            <div className={`${BASE}__progress`}>
              <div
                className={`${BASE}__progress-bar`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {phaseIcon && <div className={`${BASE}__phase-icon`}>{phaseIcon}</div>}
    </div>
  );
}
