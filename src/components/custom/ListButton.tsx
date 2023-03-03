import React from "react";
import { Group, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface ListButtonProps {
  children: JSX.Element;
  i: number;
  onClick?: Function;
}

function ListButton({ children, i, onClick }: ListButtonProps) {
  return (
    <UnstyledButton
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      component="button"
      sx={(theme) => ({
        fontSize: theme.fontSizes.sm,
        fontWeight: 600,
        backgroundColor:
          i % 2 === 0
            ? theme.colorScheme === "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[6]
            : "transparent",
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[2]
              : theme.colors.dark[5],
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

export default ListButton;
