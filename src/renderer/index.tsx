import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";

import "./assets/ui/index.sass";
import "./assets/fonts/roboto.sass";

import Application from "./components/Application";
import store from "./store";

// Create main element
const mainElement = document.createElement("div");
mainElement.classList.add("app-container");

document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    mainElement
  );
};

render(Application);
