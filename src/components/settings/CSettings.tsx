import { Stack } from "@mantine/core";
import React from "react";
import CColorSchemeToggle from "./CColorSchemeToggle";
import CSection from "./CSection";

export default function CSettings() {
    return (
        <Stack spacing="xl">
            <CSection title="Appearance">
                <CColorSchemeToggle />
            </CSection>
            <CSection title="Account">
                <>Change your accont settings</>
            </CSection>
            <CSection title="About">
                <>This program was made by h16nnning</>
            </CSection>
        </Stack>
    );
}
