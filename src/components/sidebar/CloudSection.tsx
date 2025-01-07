import { Badge, Button, Card, Stack, Text } from "@mantine/core";
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
      notifications.show({ message: <span>{e}</span> });
    }
  }, []);

  return (
    !minimalMode && (
      <Card component="section" p="md">
        <Stack>
          <Badge color="red">Experimental</Badge>
          <Text size="xs" c="red">
            Warning: Don't use this if you don't know what you are doing! Your
            data will be synced to a server w/o encryption. In this early state,
            a test account will be created w/ your email. After 30 days it will
            be deleted.
          </Text>
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
    )
  );
}
