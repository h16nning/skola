import { useState } from "react";
import {
    AppShell,
    Navbar,
    Text,
    useMantineTheme,
    MantineProvider,
} from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

import { getBaseTheme } from "./style/StyleProvider";
import CHeader from "./components/header/CHeader";

export default function App() {
    const theme = useMantineTheme();
    const [showSidebar, setShowSidebar] = useState(false);
    return (
        <MantineProvider
            theme={getBaseTheme()}
            withGlobalStyles
            withNormalizeCSS
        >
            <AppShell
                styles={{
                    main: {
                        background:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0],
                    },
                }}
                navbarOffsetBreakpoint="sm"
                navbar={
                    <Navbar
                        p="md"
                        hiddenBreakpoint="sm"
                        hidden={!showSidebar}
                        width={{ sm: 200, lg: 300 }}
                    >
                        <Text>Application navbar</Text>
                    </Navbar>
                }
                header={
                    <CHeader
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                }
            >
                <BrowserRouter></BrowserRouter>
            </AppShell>
            );
        </MantineProvider>
    );
}
