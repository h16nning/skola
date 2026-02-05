import { Group, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
import classes from "./ListButton.module.css";

interface ListButtonProps {
  children: JSX.Element;
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
        <Group gap="apart" wrap="nowrap" w="100%">
          {children}
          <IconChevronRight className={classes.rightArrow} />
        </Group>
      }
    </UnstyledButton>
  );
}

export default ListButton;
