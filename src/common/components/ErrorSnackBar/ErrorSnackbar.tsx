import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { appActions, appSelectors } from "../../../redux/appSlice";
import { useSelector } from "react-redux";

export default function ErrorSnackbar() {
  const errorToApp = useAppSelector((state) => appSelectors.error(state));
  const dispatch = useAppDispatch();
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(appActions.setAppError({ error: null }));
  };

  return (
    <div>
      <Snackbar
        open={!!errorToApp}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorToApp}
        </Alert>
      </Snackbar>
    </div>
  );
}
