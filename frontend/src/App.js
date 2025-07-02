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

const App = () => {
  return (
    <Router>
      <div className="" >
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards" element={<Boards />} />
          {/* <Route path="/chats" element={<Chats />} /> */}
          <Route path="/kanban/:boardId" element={<Kanban />} />
          <Route path="/chats" element={<ChatRoomsPage />} />
          <Route path="/workspaces" element={<WorkspacesPage/>} />
          <Route path="/workspaces/:workspaceId" element={<WorkspaceDetails/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;