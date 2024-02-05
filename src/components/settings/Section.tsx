import { Group, Stack, Title } from "@mantine/core";
import React, { ReactNode } from "react";

type SectionProps = {
  title: string | ReactNode;
  children: ReactNode;
  rightSection?: ReactNode;
};
export default function Section({
  title,
  children,
  rightSection,
}: SectionProps) {
  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Title order={4}>{title}</Title>
        {rightSection}
      </Group>
      {children}
    </Stack>
  );
}
