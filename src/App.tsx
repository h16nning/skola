import {
    AppShell,
    useMantineTheme,
    MantineProvider,
    ColorScheme,
    ColorSchemeProvider, Button, Input,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import CHeader from "./components/header/CHeader";
import CMain from "./components/CMain";
import { useState } from "react";

export default function App() {
    const theme = useMantineTheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={getBaseTheme(theme, colorScheme)}
                withGlobalStyles
                withNormalizeCSS
            >
                <AppShell
                    styles={{
                        main: {
                            background:
                                colorScheme === "light"
                                    ? theme.colors.gray[0]
                                    : theme.colors.dark[9],
                        },
                    }}
                    header={<CHeader />}
                >
                    <CMain />
                </AppShell>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
