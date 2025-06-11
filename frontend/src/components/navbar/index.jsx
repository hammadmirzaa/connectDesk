import { Button } from "@mui/material";
import React, { useState } from "react";
import { Search, Notifications, AccountCircle } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import CreateBoardForm from "../pages/boards/createBoard";
import { UseGlobalContext } from "../../context/GlobalContext";

const SharedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showBoardForm, setShowBoardForm } = UseGlobalContext();

  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Boards", link: "/boards" },
    { name: "Chats", link: "/chats" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center px-6 py-2 bg-white shadow-sm sticky top-0 z-10 h-[64px]">
        <div className="flex items-center gap-12">
          <h1 className="text-[24px] w-[10rem] font-bold">Connect Desk</h1>
          <ul className="flex items-center gap-8 list-none">
            {links.map((link) => {
              const isActive = location.pathname === link.link;
              return (
                <li
                  key={link.name}
                  onClick={() => navigate(link.link)}
                  className={`cursor-pointer ${
                    isActive ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  {link.name}
                </li>
              );
            })}
          </ul>
          <Button
            onClick={() => setShowBoardForm(true)}
            variant="contained"
            color="primary"
            sx={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "12px",
              position: "relative",
            }}
          >
            Create
          </Button>
          {showBoardForm && <CreateBoardForm />}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border-b border-gray-400 px-2">
            <input
              type="text"
              placeholder="Search"
              className="outline-none px-2 py-1"
            />
            <Search className="text-gray-600 cursor-pointer" />
          </div>
          <Notifications className="text-gray-600 cursor-pointer" />
          <AccountCircle className="text-gray-600 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto  bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default SharedLayout;
