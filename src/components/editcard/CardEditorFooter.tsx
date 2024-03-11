import { Button, Group } from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import React from "react";
import { EditMode } from "../../logic/TypeManager";

interface CardEditorFooterProps {
  mode: EditMode;
  finish: Function;
}

export default function CardEditorFooter({
  mode,
  finish,
}: CardEditorFooterProps) {
  return (
    <Group justify="flex-end">
      {" "}
      <Button
        onClick={() => finish()}
        leftSection={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
      >
        {mode === "edit" ? "Save" : "Add"}
      </Button>
    </Group>
  );
}
