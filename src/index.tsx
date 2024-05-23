import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { HashRouter } from "react-router-dom";
import { ThemeTogglerHOC } from "./common/components/ThemeTogglerHOC/ThemeTogglerHOC";
import AppBarWithToggleLeft from "./common/components/AppBarWithToggle/AppBarWithToggle";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <HashRouter>
      <ThemeTogglerHOC>
        <AppBarWithToggleLeft>
          <App />
        </AppBarWithToggleLeft>
      </ThemeTogglerHOC>
    </HashRouter>
  </Provider>
);

reportWebVitals();
