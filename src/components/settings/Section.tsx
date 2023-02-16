import { Space, Stack, Title } from "@mantine/core";
import React from "react";

type SectionProps = {
    title: String;
    children: JSX.Element;
};
export default function Section({ title, children }: SectionProps) {
    return (
        <Stack spacing="xs">
            <Title order={4}>{title}</Title>
            {children}
        </Stack>
    );
}
