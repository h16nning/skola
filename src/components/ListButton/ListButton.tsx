import { Group, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
import classes from "./ListButton.module.css";

interface ListButtonProps {
  children: JSX.Element;
  i: number;
  onClick?: () => void;
  onContextMenu?: () => void;
}

function ListButton({ children, onClick, onContextMenu }: ListButtonProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      onContextMenu={onContextMenu}
      component="button"
      className={classes.listButton}
    >
      {
        <Group gap="apart" wrap="nowrap">
          {children}
          <IconChevronRight className={classes.rightArrow} />
        </Group>
      }
    </UnstyledButton>
  );
}

export default ListButton;
