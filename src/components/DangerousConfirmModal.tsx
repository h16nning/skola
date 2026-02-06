import { t } from "i18next";
import React, { ReactNode } from "react";
import ModalProps from "./ModalProps";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

interface DangerousConfirmModalProps extends ModalProps {
  dangerousAction: Function;
  dangerousDependencies: Array<any>;
  dangerousTitle: string;
  dangerousDescription: ReactNode;
}

function DangerousConfirmModal({
  dangerousDependencies,
  dangerousAction,
  dangerousTitle,
  dangerousDescription,
  opened,
  setOpened,
}: DangerousConfirmModalProps) {
  return (
    <Modal
      title={dangerousTitle}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        <p style={{
          fontSize: "var(--font-size-md)",
          color: "var(--theme-neutral-600"
        }}>{dangerousDescription}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-sm)" }}>
          <Button variant="default" onClick={() => setOpened(false)}>
            {t("global.cancel")}
          </Button>
          <Button
            data-autofocus
            variant="destructive"
            onClick={() => {
              dangerousAction(...dangerousDependencies);
              setOpened(false);
            }}
          >
            {dangerousTitle}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DangerousConfirmModal;
