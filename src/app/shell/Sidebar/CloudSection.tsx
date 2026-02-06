import { db } from "@/logic/db";
import { useObservable } from "dexie-react-hooks";
import { useCallback } from "react";
import "./CloudSection.css";
import { Button } from "@/components/ui";

const BASE = "cloud-section";

interface CloudSectionProps {
  minimalMode: boolean;
}

export default function CloudSection({ minimalMode }: CloudSectionProps) {
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

  if (minimalMode) {
    return null;
  }

  return (
    <section className={BASE}>
      <span className={`${BASE}__badge`}>Experimental</span>

      {!user?.isLoggedIn ? (
        <Button variant="primary" onClick={handleLogin}>
          Login with OTP
        </Button>
      ) : (
        <>
          <p className={`${BASE}__info`}>
            Logged in as <strong>{user.email}</strong>
          </p>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </section>
  );
}
