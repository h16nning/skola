import { Space, Stack, Title } from "@mantine/core";
import React from "react";

type CSectionProps = {
    title: String;
    children: JSX.Element;
};
export default function CSection({ title, children }: CSectionProps) {
    return (
        <Stack spacing="xs">
            <Title order={3}>{title}</Title>
            {children}
        </Stack>
    );
}
