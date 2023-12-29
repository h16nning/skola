import React, { ReactNode } from "react";
import { Anchor, Group } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface LinkButtonProps {
  children: ReactNode;
  onClick?: Function;
}
function LinkButton({ children, onClick }: LinkButtonProps) {
  return (
    <Anchor
      component="button"
      type="button"
      c="blue"
      fz="sm"
      fs="sm"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Group gap={0}>
        {children}
        <IconChevronRight />
      </Group>
    </Anchor>
  );
}

export default LinkButton;
