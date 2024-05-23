import React from "react";
import "./App.css";
import { CircularProgress, Container } from "@mui/material";
import { TodolistsBunch } from "../features/TodolistsBunch/ui/TodolistsBunch";
import { useAppSelector } from "../store/store";
import LinearProgress from "@mui/material/LinearProgress";
import ErrorSnackbar from "../common/components/ErrorSnackBar/ErrorSnackbar";
import { Login } from "../features/auth/ui/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { appSelectors } from "../redux/appSlice";
import { styleCircular } from "../common/utilities";
const App = React.memo(() => {
  const statusTodo = useAppSelector((state) => appSelectors.statusTodo(state));
  const statusTask = useAppSelector((state) => appSelectors.statusTask(state));
  const isInitialized = useAppSelector((state) => appSelectors.isInitialized(state));

  if (!isInitialized) {
    return (
      <div style={styleCircular}>
        <CircularProgress color="info" />
      </div>
    );
  }
  return (
    <div className="App">
      {statusTodo === "loading" && (
        <div style={styleCircular}>
          <CircularProgress color="info" />
        </div>
      )}
      <ErrorSnackbar />
      {statusTask === "loading" && <LinearProgress color="secondary" />}
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsBunch />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1 style={{ textAlign: "center" }}>404: Page not found</h1>} />
          <Route path={"*"} element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
});

export default App;
