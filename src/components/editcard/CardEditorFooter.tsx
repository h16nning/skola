import React from "react";
import { Button, Group } from "@mantine/core";
import { EditMode } from "../../logic/TypeManager";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

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
