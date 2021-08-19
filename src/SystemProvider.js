import React from "react";
import SystemContext from "./SystemContext";
import { ThemeProvider as JssThemeProvider, jss, JssProvider } from "react-jss";
import defaults from "lodash.defaultsdeep";
import { ThemeProvider } from "@emotion/react";
import { NotificationContainer } from "./notify";

jss.setup({ insertionPoint: "mana-insertion-point" });

const SystemProvider = ({ theme, system, children }) => {
  const mergedTheme = system.variant(defaults(theme, system.defaultTheme));
  return (
    <JssProvider jss={jss}>
      <JssThemeProvider theme={mergedTheme}>
        <ThemeProvider theme={mergedTheme}>
          <SystemContext.Provider value={system}>
            <NotificationContainer>{children}</NotificationContainer>
          </SystemContext.Provider>
        </ThemeProvider>
      </JssThemeProvider>
    </JssProvider>
  );
};

export default SystemProvider;
