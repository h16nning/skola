import React from "react";
import { Menu } from "@mantine/core";
import { IconDots, IconSettings } from "@tabler/icons-react";
import { RichTextEditor } from "@mantine/tiptap";
import { useNavigate } from "react-router-dom";

interface EditorOptionsMenuProps {}

export default function EditorOptionsMenu({}: EditorOptionsMenuProps) {
  const navigate = useNavigate();
  return (
    <Menu>
      <Menu.Target>
        <RichTextEditor.Control tabIndex={-1}>
          <IconDots />
        </RichTextEditor.Control>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconSettings />}
          onClick={() => navigate("/settings/editing")}
        >
          Edit Options
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
