import { Button } from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { EditMode } from "../../logic/TypeManager";
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

  return (
    <Button
      onClick={() => finish()}
      leftSection={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
    >
      {mode === "edit"
        ? t("edit-notes.submit-button.save")
        : t("edit-notes.submit-button.add")}
    </Button>
  );
}
