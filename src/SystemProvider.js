import React from "react";
import SystemContext from "./SystemContext";
import { ThemeProvider, jss, JssProvider } from "react-jss";

jss.setup({insertionPoint: 'mana-insertion-point'})

const SystemProvider = ({ theme, system, children }) => (
    <JssProvider jss={jss}>
        <ThemeProvider theme={theme}>
            <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
        </ThemeProvider>
    </JssProvider>
);

export default SystemProvider;