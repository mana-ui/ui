import React from "react";
import SystemContext from "./SystemContext";
import { ThemeProvider } from "react-jss";

const SystemProvider = ({ theme, system, children }) => (
    <ThemeProvider theme={theme}>
        <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
    </ThemeProvider>
);

export default SystemProvider;
