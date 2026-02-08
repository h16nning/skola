import { db } from "@/logic/db";
import { useObservable } from "dexie-react-hooks";
import "./CloudSection.css";

const BASE = "cloud-section";

interface CloudSectionProps {
  minimalMode: boolean;
}

export default function CloudSection({ minimalMode }: CloudSectionProps) {
  const user = useObservable(db.cloud.currentUser);
  const syncState = useObservable(db.cloud.syncState);
  const persistedSyncState = useObservable(db.cloud.persistedSyncState);

  if (!user || !user.isLoggedIn || minimalMode) {
    return null;
  }
  return (
    <section className={BASE}>
      <p>{user.email}</p>
      <h2>Sync State</h2>
      <p>Error Message: {syncState?.error?.message}</p>
      <p>License: {syncState?.license}</p>
      <p>Phase: {syncState?.phase}</p>
      <p>Progresss: {syncState?.progress} / 100</p>
      <p>Status: {syncState?.status}</p>
      <h2>Persisted Sync State</h2>
      <p>Client Identiy: {persistedSyncState?.clientIdentity}</p>
      <p>Error: {persistedSyncState?.error}</p>
      <p>Initially Synced: {persistedSyncState?.initiallySynced}</p>
      <p>
        Latest Revision{JSON.stringify(persistedSyncState?.latestRevisions)}
      </p>
      <p>
        Timestamp:{" "}
        {persistedSyncState?.timestamp?.toLocaleDateString() +
          " " +
          persistedSyncState?.timestamp?.toLocaleTimeString()}
      </p>
    </section>
  );
}
