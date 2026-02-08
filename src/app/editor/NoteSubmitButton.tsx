import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { useOs } from "@/lib/hooks/useOs";
import { EditMode } from "@/logic/NoteTypeAdapter";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

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
            : t("note.new.submit-button-tooltip")}{" "}
          <Kbd>{os === "macos" ? "Cmd" : "Ctrl"}+Enter</Kbd>
        </>
      }
    >
      <Button
        onClick={() => finish()}
        leftSection={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
        variant="primary"
      >
        {mode === "edit"
          ? t("note.edit.submit-button")
          : t("note.new.submit-button")}
      </Button>
    </Tooltip>
  );
}
