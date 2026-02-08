import { Paper } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/TextInput";
import {
  DXCInputField,
  DXCUserInteraction,
  resolveText,
} from "dexie-cloud-addon";
import { useObservable } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../../logic/db";
import "./LoginUI.css";

const BASE = "login-ui";

export default function LoginUI() {
  const [params, setParams] = useState<{ [param: string]: string }>({});

  const loginUI: DXCUserInteraction | undefined = useObservable(
    db.cloud.userInteraction
  );

  const content = loginUI ? (
    <div className={`${BASE}__content`}>
      {loginUI.alerts &&
        loginUI.alerts.length > 0 &&
        loginUI.alerts.map((alert) => (
          <Paper key={alert.messageCode} withBorder>
            {resolveText(alert)}
          </Paper>
        ))}
      <form
        className={`${BASE}__form`}
        onSubmit={(e) => {
          e.preventDefault();
          loginUI.onSubmit(params);
        }}
      >
        <div className={`${BASE}__fields`}>
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
        </div>

        <div className={`${BASE}__actions`}>
          <Button onClick={loginUI.onCancel} variant="default">
            {loginUI.cancelLabel}
          </Button>
          <Button type="submit" variant="primary">
            {loginUI.submitLabel}
          </Button>
        </div>
      </form>
    </div>
  ) : null;

  const title = loginUI ? (
    <div className={`${BASE}__header`}>{loginUI.title}</div>
  ) : undefined;

  return (
    <Modal
      opened={loginUI !== undefined}
      exitOnEscape={false}
      onClose={loginUI?.onCancel ?? (() => {})}
      title={title}
    >
      {content}
    </Modal>
  );
}
