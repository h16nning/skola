import { Button, Kbd, Tooltip } from "@mantine/core";
import { useOs } from "@mantine/hooks";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { EditMode } from "../../logic/TypeManager";

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
            ? t("note.edit.submit-button-tooltip")
            : t("note.new.submit-button-tooltip")}
          <Kbd>{os === "macos" ? "Cmd" : "Ctrl"}+Enter</Kbd>
        </>
      }
    >
      <Button
        onClick={() => finish()}
        leftSection={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
      >
        {mode === "edit"
          ? t("note.edit.submit-button")
          : t("note.new.submit-button")}
      </Button>
    </Tooltip>
  );
}
