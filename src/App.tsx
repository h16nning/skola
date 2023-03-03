import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import Main from "./components/Main";
import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Notifications } from "@mantine/notifications";

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
        <Notifications />
        <AppShell
          //header={<TopBar />}
          navbarOffsetBreakpoint="sm"
          navbar={<Sidebar />}
          pt={32}
        >
          <Main />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
