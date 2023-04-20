import React from "react";
import { Button, Group } from "@mantine/core";
import { EditMode } from "../../logic/CardTypeManager";
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
    <Group position="right">
      {" "}
      <Button
        onClick={() => finish()}
        leftIcon={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
      >
        {mode === "edit" ? "Save" : "Add"}
      </Button>
    </Group>
  );
}
