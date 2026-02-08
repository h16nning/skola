import { Button } from "@/components/ui";
import { db } from "@/logic/db";
import { IconCloudOff } from "@tabler/icons-react";
import { useObservable } from "dexie-react-hooks";
import { useCallback } from "react";
import "./CloudSettingsView.css";
import CloudSyncSignIn from "./CloudSyncSignIn";

const BASE = "cloud-settings-view";

export default function CloudSettingsView() {
  const user = useObservable(db.cloud.currentUser);

  const handleLogin = useCallback(async () => {
    try {
      await db.cloud.login();
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      console.error("Login failed:", e);
    }
  }, []);

  const handleLogout = useCallback(() => {
    db.cloud.logout();
  }, []);

  return (
    <div className={BASE}>
      {user?.isLoggedIn ? (
        <div className={BASE + "__logged-in"}>
          <div>
            <p>Signed in as</p>
            <p>{user.email}</p>
          </div>
          <Button
            variant="neutral"
            onClick={handleLogout}
            leftSection={<IconCloudOff />}
          >
            Disconnect from Cloud Sync
          </Button>
          <p>
            <b>Warning: </b>After disconnecting, your local database will be
            cleared. You will need connect to Sync again to access your data. We
            advise to export your data before disconnecting, during Beta.
          </p>
        </div>
      ) : (
        <CloudSyncSignIn onSignIn={handleLogin} />
      )}
      <article>
        <h2>What is Skola Cloud Sync?</h2>
        <p>
          By default, Skola saves your data in your browser using IndexedDB
          using a library called Dexie. This makes Skola feel fast and enables
          offline usage.
        </p>
        <p>
          Skola Cloud Sync allows you to synchronize your data across multiple
          devices using cloud storage powered by Dexie Cloud.
        </p>
        <h3>
          The catch <i>(for now)</i>
        </h3>
        <p>
          Skola Cloud Sync is limited to 30 days of active usage. After that you
          won't be able to sync between devices, but can still it. Why? Our
          number of paying user seats is limited. I, the maintainer of this
          project am only a student with limited financial resources. This is a
          passion project and I want to keep it free for everyone, but I also
          need to cover the costs of the cloud service. If your 30 days of using
          Sync have expired, please contact me and I will upgrade your account
          to a paying seat, no questions asked.
        </p>
        <h3>How can this be sustainable going forward?</h3>
        <p>
          If Skola ever grows large enough that the cost of the cloud service
          become a problem, we may need to explore alternatives like a
          cost-covering subscription model. Although, I don't want to charge for
          Skola or create yet another subscription service.
        </p>
        <p>
          <i>
            Needless to say, Skola will always stay open-source, so self-hosting
            is a viable option for those who want to keep using the sync
            features without any limitations or costs.
          </i>
        </p>
        <h3>Terms of Services</h3>
        <p>
          By signing in to Skola Cloud Sync, you agree to Skola syncing your
          data using Dexie Cloud. Dexie Cloud is a third-party service provided
          by the makers of Dexie, the IndexedDB wrapper library used by Skola.
          Your data may be stored on Dexie Cloud's servers and is associated
          with the email address you use to sign in. Skola doesn't share your
          data with any other third parties.
        </p>
      </article>
    </div>
  );
}
