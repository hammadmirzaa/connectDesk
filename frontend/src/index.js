import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";
import { BoardsProvider } from "./context/BoardsContext";
import { WorkspaceProvider } from "./context/WorkspacesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalProvider>
      <BoardsProvider>
      <WorkspaceProvider>
        <App />
        </WorkspaceProvider>
        </BoardsProvider>
      </GlobalProvider>
    </AuthProvider>
  </React.StrictMode>
);
