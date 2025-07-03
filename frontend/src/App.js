import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/signUp";
import Dashboard from "./components/pages/dashboard";
import './App.css'
import Boards from "./components/pages/boards";
import Chats from "./components/pages/chats";
// import ChatApp from "./components/pages/chats/chatApp";
import Kanban from "./components/pages/Kanban/Kanban";
import HomePage from "./components/pages/homePage";
import ChatRoomsPage from './components/pages/chatRooms/ChatRoomsPage';
import WorkspacesPage from "./components/pages/workspaces";
import WorkspaceDetails from "./components/pages/workspaces/workspaceDetails";
import SettingsPage from "./components/pages/settings";
import ProtectedRoute from "./components/routes/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="" >
       <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />

  {/* Protected Routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/boards"
    element={
      <ProtectedRoute>
        <Boards />
      </ProtectedRoute>
    }
  />
  <Route
    path="/kanban/:boardId"
    element={
      <ProtectedRoute>
        <Kanban />
      </ProtectedRoute>
    }
  />
  <Route
    path="/chats"
    element={
      <ProtectedRoute>
        <ChatRoomsPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/workspaces"
    element={
      <ProtectedRoute>
        <WorkspacesPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/workspaces/:workspaceId"
    element={
      <ProtectedRoute>
        <WorkspaceDetails />
      </ProtectedRoute>
    }
  />
  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    }
  />
</Routes>

      </div>
    </Router>
  );
};

export default App;