import React from "react";
import { Group, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";

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
        fontSize: theme.fontSizes.sm,
        fontWeight: 600,
        backgroundColor:
          i % 2 === 0
            ? theme.colorScheme === "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[7]
            : "transparent",
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[2]
              : theme.colors.dark[6],
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
