import React, { ReactNode } from "react";
import { UnstyledButton } from "@mantine/core";

interface SidebarItemProps {
  action: Function;
  icon: ReactNode;
  children: ReactNode;
}

function SidebarItem({ action, icon, children }: SidebarItemProps) {
  return <UnstyledButton component="button" type="button"></UnstyledButton>;
}

export default SidebarItem;
