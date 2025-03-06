import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/signUp";
import Dashboard from "./components/pages/dashboard";
import './App.css'
import Boards from "./components/pages/boards";
import Chats from "./components/pages/chats";
import ChatApp from "./components/pages/chats/chatApp";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:chatId" element={<ChatApp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
