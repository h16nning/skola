import { Button, Card, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useObservable } from "dexie-react-hooks";
import { useCallback } from "react";
import { db } from "../../logic/db";

export default function CloudSection({
  minimalMode,
}: { minimalMode: boolean }) {
  const user = useObservable(db.cloud.currentUser);

  const handleLogin = useCallback(async () => {
    try {
      await db.cloud.login();
    } catch (e: any) {
      if (e?.name === "AbortError") {
        return;
      }
      notifications.show({
        message: <span>{e?.message}</span>,
        color: "red",
      });
    }
  }, []);

  return (
    !minimalMode && (
      <>
        <Card component="section" p="md">
          <Stack>
            {!user?.isLoggedIn ? (
              <Button onClick={handleLogin}>Login with OTP</Button>
            ) : (
              <>
                <Text size="xs" c="gray">
                  Logged in as <strong>{user.email}</strong>
                </Text>
                <Button onClick={() => db.cloud.logout()}>Logout</Button>
              </>
            )}
          </Stack>
        </Card>
      </>
    )
  );
}
