import React from "react";
import { ActionIcon, Group, UnstyledButton } from "@mantine/core";
import { IconArrowRight, IconChevronRight } from "@tabler/icons";

interface TableRowProps {
  children: JSX.Element;
  i: number;
  onClick?: Function;
}

function TableRowButton({ children, i, onClick }: TableRowProps) {
  return (
    <UnstyledButton
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      sx={(theme) => ({
        backgroundColor:
          i % 2 === 0
            ? theme.colorScheme === "light"
              ? theme.white
              : theme.colors.dark[6]
            : "transparent",
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        boxShadow: i % 2 === 0 ? theme.shadows.sm : "none",
        "&:hover": {
          backgroundColor:
            i % 2 === 0
              ? theme.colorScheme === "light"
                ? theme.colors.gray[3]
                : theme.colors.dark[4]
              : theme.colorScheme === "light"
              ? theme.colors.gray[3]
              : theme.colors.dark[4],
          boxShadow: "none",
        },

        "&:active": { transform: "scale(0.99)" },
      })}
    >
      {
        <Group position="apart" noWrap={true}>
          {children}
          <IconChevronRight />
        </Group>
      }
    </UnstyledButton>
  );
}

export default TableRowButton;
