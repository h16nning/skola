import { Stack } from "@mantine/core";
import React from "react";
import CColorSchemeToggle from "./CColorSchemeToggle";
import Section from "./Section";

export default function SettingsView() {
    return (
        <Stack spacing="xl">
            <Section title="Appearance">
                <CColorSchemeToggle />
            </Section>
            <Section title="Account">
                <>Change your accont settings</>
            </Section>
            <Section title="About">
                <>This program was made by h16nnning</>
            </Section>
        </Stack>
    );
}
