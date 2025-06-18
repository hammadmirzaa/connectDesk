import { Button } from "@mui/material";
import React, { useState } from "react";
import { Search, Notifications, AccountCircle } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import CreateBoardForm from "../pages/boards/createBoard";
import { UseGlobalContext } from "../../context/GlobalContext";
import { UseAuthContext } from "../../context/AuthContext";

const SharedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showBoardForm, setShowBoardForm } = UseGlobalContext();
  const { username } = UseAuthContext();

  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Boards", link: "/boards" },
    { name: "Chats", link: "/chats" },
    { name: "Workspaces", link: "/workspaces" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center px-40 py-2 bg-[#ffffff] shadow-sm sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-12">
          <h1 className="text-[24px] w-[10rem] font-bold ">ConnectDesk</h1>

          {/* <Button
            onClick={() => setShowBoardForm(true)}
            variant="contained"
            sx={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "12px",
              position: "relative",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Create
          </Button> */}
          {showBoardForm && (
            <CreateBoardForm onClose={() => setShowBoardForm(false)} />
          )}
        </div>

        <div className="flex items-center gap-4">
          <ul className="flex items-center justify-center gap-8 list-none">
            {links.map((link) => {
              const isActive = location.pathname === link.link;
              return (
                <li
                  key={link.name}
                  onClick={() => navigate(link.link)}
                  className={`cursor-pointer  hover:text-blue-200 transition-colors ${
                    isActive ? "text-blue-500 font-bold font-medium" : ""
                  }`}
                >
                  {link.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {/*      <div className="flex items-center border-b border-white/40 px-2">
            <input
              type="text"
              placeholder="Search"
              className="outline-none px-2 py-1 bg-transparent text-white placeholder-white/70"
            />
            <Search className="text-white cursor-pointer" />
          </div> */}
          <AccountCircle className=" cursor-pointer hover:text-blue-200 transition-colors" />
          <p>{username}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#ffffff] px-32 ">
        {children}
      </div>
    </div>
  );
};

export default SharedLayout;
