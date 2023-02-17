import {
  AppShell,
  useMantineTheme,
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import TopBar from "./components/header/TopBar";
import Main from "./components/Main";
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
              background: colorScheme === "light" ? theme.white : theme.black,
            },
          }}
          header={<TopBar />}
        >
          <Main />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
