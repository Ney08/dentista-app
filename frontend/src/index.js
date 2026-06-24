import React from "react";

import ReactDOM from "react-dom/client";

// import "./utils/chartSetup";
import "chart.js/auto";
import "./index.css";

import App from "./App";

import reportWebVitals from "./reportWebVitals";

import {
  AuthProvider
} from "./context/AuthContext";

import {
  ThemeProvider
} from "./context/ThemeContext";

import ErrorBoundary from "./components/ErrorBoundary";

/*
==========================================
GLOBAL ERROR HANDLERS
==========================================
*/

window.addEventListener("error", (event) => {

  document.body.innerHTML = `
    <div style="
      background:#020617;
      color:#fff;
      min-height:100vh;
      padding:32px;
      font-family:Consolas, monospace;
      white-space:pre-wrap;
    ">
      <h1 style="color:#f87171;">
        Error JavaScript
      </h1>

      <p>
        ${event.message}
      </p>

      <hr />

      <pre>
        ${event.error?.stack || "Sin stack"}
      </pre>
    </div>
  `;

});

window.addEventListener("unhandledrejection", (event) => {

  document.body.innerHTML = `
    <div style="
      background:#020617;
      color:#fff;
      min-height:100vh;
      padding:32px;
      font-family:Consolas, monospace;
      white-space:pre-wrap;
    ">
      <h1 style="color:#f87171;">
        Promise Error
      </h1>

      <p>
        ${event.reason?.message || event.reason}
      </p>

      <hr />

      <pre>
        ${event.reason?.stack || "Sin stack"}
      </pre>
    </div>
  `;

});

/*
==========================================
RENDER
==========================================
*/

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(

  <React.StrictMode>

    <ErrorBoundary>

      <ThemeProvider>

        <AuthProvider>

          <App />

        </AuthProvider>

      </ThemeProvider>

    </ErrorBoundary>

  </React.StrictMode>

);

reportWebVitals();