import { Button, Kbd, Tooltip } from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { EditMode } from "../../logic/TypeManager";
import { useOs } from "@mantine/hooks";

interface NoteSubmitButtonProps {
  mode: EditMode;
  finish: Function;
}

export default function NoteSubmitButton({
  mode,
  finish,
}: NoteSubmitButtonProps) {
  const [t] = useTranslation();
  const os = useOs();

  return (
    <Tooltip
      label={
        <>
          {mode === "edit"
            ? t("edit-notes.submit-button.save-tooltip")
            : t("edit-notes.submit-button.add-tooltip")}
          <Kbd>{os === "macos" ? "Cmd" : "Ctrl"}+Enter</Kbd>
        </>
      }
    >
      <Button
        onClick={() => finish()}
        leftSection={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
      >
        {mode === "edit"
          ? t("edit-notes.submit-button.save")
          : t("edit-notes.submit-button.add")}
      </Button>
    </Tooltip>
  );
}
