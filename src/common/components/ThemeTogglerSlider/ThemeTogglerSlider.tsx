import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import React, { createContext, useContext } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import { yellow } from "@mui/material/colors";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const ThemeTogglerSlider = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "10p" }}>
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? <Brightness7Icon sx={{ color: yellow[500] }} /> : <Brightness4Icon />}
      </IconButton>
    </div>
  );
};
