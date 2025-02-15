import {
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  DXCInputField,
  DXCUserInteraction,
  resolveText,
} from "dexie-cloud-addon";
import { useObservable } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../../logic/db";

export default function LoginUI() {
  const [params, setParams] = useState<{ [param: string]: string }>({});

  const loginUI: DXCUserInteraction | undefined = useObservable(
    db.cloud.userInteraction
  );

  const content = loginUI ? (
    <>
      {loginUI.alerts?.map((alert) => (
        <Text key={alert.messageCode} c="red" size="sm">
          {resolveText(alert)}
        </Text>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginUI.onSubmit(params);
        }}
      >
        {(Object.entries(loginUI.fields) as [string, DXCInputField][]).map(
          ([fieldName, field]) => (
            <TextInput
              key={fieldName}
              label={field.label}
              autoFocus
              placeholder={field.placeholder}
              value={params[fieldName] || ""}
              onChange={(e) =>
                setParams({ ...params, [fieldName]: e.currentTarget.value })
              }
            />
          )
        )}
      </form>{" "}
      <Group justify="end" gap="sm">
        <Button onClick={loginUI.onCancel} variant="default">
          {loginUI.cancelLabel}
        </Button>
        <Button type="submit" onClick={() => loginUI.onSubmit(params)}>
          {loginUI.submitLabel}
        </Button>
      </Group>
    </>
  ) : null;

  return (
    <Modal
      opened={loginUI !== undefined}
      onClose={loginUI?.onCancel ?? (() => {})}
      title={
        <Group gap="xs">
          <Badge color="red">Experimental</Badge>
          <span>{loginUI?.title ?? ""}</span>
        </Group>
      }
    >
      <Stack gap="lg">
        <Text size="sm" c="red">
          Warning: Don't use this if you don't know what you are doing! Your
          data will be synced to a server w/o encryption. In this early state, a
          test account will be created w/ your email. After 30 days it will be
          deleted.
        </Text>
        {content}
      </Stack>
    </Modal>
  );
}
