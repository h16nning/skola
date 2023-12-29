import classes from "./ListButton.module.css";
import React from "react";
import { Group, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface ListButtonProps {
  children: JSX.Element;
  i: number;
  onClick?: Function;
  onContextMenu?: Function;
}

function ListButton({ children, onClick, onContextMenu }: ListButtonProps) {
  return (
    <UnstyledButton
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      onContextMenu={() => {
        if (onContextMenu) {
          onContextMenu();
        }
      }}
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
