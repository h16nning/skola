import React from "react";
import { Menu } from "@mantine/core";
import { IconDots, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface EditorOptionsMenuProps {}

export default function EditorOptionsMenu({}: EditorOptionsMenuProps) {
  const navigate = useNavigate();
  return (
    <Menu>
      <Menu.Target>
        <IconDots />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconSettings />}
          onClick={() => navigate("/settings/editing")}
        >
          Editing Options
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
