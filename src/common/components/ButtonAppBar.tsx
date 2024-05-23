import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { loginSelectors, loginThunks } from "../../redux/loginSlice";
import { ThemeTogglerSlider } from "./ThemeTogglerSlider/ThemeTogglerSlider";

function ButtonAppBar() {
  const isLoggedIn = useAppSelector((state) =>
    loginSelectors.isLoggedIn(state)
  );
  const dispatch = useAppDispatch();
  const logoutHandler = () => {
    dispatch(loginThunks.logoutTC());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <ThemeTogglerSlider />
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
