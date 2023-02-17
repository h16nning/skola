import React from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconCode,
  IconCursorText,
  IconDots,
  IconTrash,
} from "@tabler/icons";

function CategoryMenu() {
  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon>
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconCode size={16} />}>Debug</Menu.Item>
        <Menu.Item icon={<IconAdjustmentsHorizontal size={16} />}>
          Options
        </Menu.Item>
        <Menu.Item icon={<IconArrowsExchange size={16} />}>
          Move Category
        </Menu.Item>
        <Menu.Item icon={<IconCursorText size={16} />}>Rename</Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={16} />}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default CategoryMenu;
