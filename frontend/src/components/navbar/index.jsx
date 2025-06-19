// SidebarLayout.js
import React from "react";
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  ViewKanban as BoardIcon,
  Group as WorkspaceIcon,
  Inbox as InboxIcon,
  ListAlt as TaskIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAuthContext } from "../../context/AuthContext";
import CreateBoardForm from "../pages/boards/createBoard";
import { UseGlobalContext } from "../../context/GlobalContext";
import {ReactComponent as ConnectDeskLogo} from "../../assets/svg/connectDeskLogo.svg";

const navLinks = [
  { name: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
  { name: "Boards", link: "/boards", icon: <BoardIcon /> },
  { name: "Chats", link: "/chats", icon: <ChatIcon /> },
  { name: "Workspaces", link: "/workspaces", icon: <WorkspaceIcon /> },
  { name: "Inbox", link: "/inbox", icon: <InboxIcon /> },
  { name: "Tasks", link: "/tasks", icon: <TaskIcon /> },
];

const SharedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, users } = UseAuthContext();
  const { showBoardForm, setShowBoardForm } = UseGlobalContext();

  const mainUser = users.filter((user) => user.admin === true)[0];

  return (
    <div className="flex h-screen bg-[#F6F8FA]">
      <aside className="flex flex-col w-[260px] bg-white border-r px-6 py-6 justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-8 mt-3">
            <ConnectDeskLogo className="w-15 h-15" />
            <h2 className="font-bold text-2xl text-blue-800">ConnectDesk</h2>
          </div>
          <nav>
            <ul className="flex flex-col gap-3">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                  <li
                    key={item.name}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                    onClick={() => navigate(item.link)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </nav>
          {showBoardForm && (
            <CreateBoardForm onClose={() => setShowBoardForm(false)} />
          )}
        </div>
        {/* User & Settings */}
        <div className="mb-2 flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className=" text-white" style={{backgroundColor:'#1e40af'}} >
              {mainUser?.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <div>
              <div className="font-medium text-sm">
                {mainUser?.username || "User"}
              </div>
              <div className="text-xs text-gray-400">Admin</div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-blue-700"
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon fontSize="small" />
              <span className="text-xs">Settings</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-red-700"
              onClick={() => navigate("/logout")}
            >
              <LogoutIcon fontSize="small" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </div>
  );
};

export default SharedLayout;
