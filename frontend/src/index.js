import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";
import { BoardsProvider } from "./context/BoardsContext";
import { WorkspaceProvider } from "./context/WorkspacesContext";
import { RoomProvider } from "./context/RoomContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalProvider>
      <BoardsProvider>
        <RoomProvider>
      <WorkspaceProvider>
        <App />
        </WorkspaceProvider>
        </RoomProvider>
        </BoardsProvider>
      </GlobalProvider>
    </AuthProvider>
  </React.StrictMode>
);
