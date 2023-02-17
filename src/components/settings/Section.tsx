import { Stack, Title } from "@mantine/core";
import React, { ReactNode } from "react";

type SectionProps = {
  title: String | ReactNode;
  children: ReactNode;
};
export default function Section({ title, children }: SectionProps) {
  return (
    <Stack spacing="md">
      <Title order={4}>{title}</Title>
      {children}
    </Stack>
  );
}
