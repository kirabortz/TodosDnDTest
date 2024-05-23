import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "../ThemeTogglerSlider/ThemeTogglerSlider";
import { grey, lightBlue, teal } from "@mui/material/colors";

const initTheme = JSON.parse(localStorage.getItem("theme") || "{}");

export const ThemeTogglerHOC = (props: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">(
    initTheme.theme ? initTheme.theme : "light"
  );

  let theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#fbb538",
          },
          ...(mode === "light" && {
            background: {
              default: "#eeeeee",
            },
          }),
          ...(mode === "dark" && {
            background: {
              default: grey[900],
            },
          }),
        },
      }),
    [mode]
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    []
  );



  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify({ theme: mode }));
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
