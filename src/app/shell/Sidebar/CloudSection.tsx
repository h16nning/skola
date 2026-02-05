import { useCallback } from "react";
import { useObservable } from "dexie-react-hooks";
import { db } from "@/logic/db";
import "./CloudSection.css";

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
        <button type="button" className={`${BASE}__button`} onClick={handleLogin}>
          Login with OTP
        </button>
      ) : (
        <>
          <p className={`${BASE}__info`}>
            Logged in as <strong>{user.email}</strong>
          </p>
          <button type="button" className={`${BASE}__button ${BASE}__button--secondary`} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </section>
  );
}
