import { Button } from "@mui/material";
import React, { useState } from "react";
import { Search, Notifications, AccountCircle } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
const SharedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation()
  const [isActive, setIsActive] = useState(true);
  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Boards", link: "/boards" },
    { name: "Chats", link: "/chats" },
  ];
  return (
    <div>
      <div className="flex justify-between py-4 px-12 ">
        <div className="flex list-none justify-center gap-12 items-center  ">
          <h1 className=" text-[24px] w-[10rem] font-bold ">Connect Desk</h1>
          <li> Boards </li>
          <li> Chats </li>
          <li> Workspaces </li>
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: "10px 24px", borderRadius: "8px", fontSize: "12px" }}
          >
            Create
          </Button>
        </div>
        <div className="flex items-center gap-4 p-2">
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
      <div className="flex">
        <div className="py-[126px] w-[20%] h-screen flex list-none flex-col  gap-3 px-12 ">
          <div className={`ml-1 flex flex-col gap-3  `}>
            {links.map((link, index) => {
              const isActive = location.pathname === link.link
              return (
                <li
                  className={`cursor-pointer ${isActive? "text-blue-600 font-medium ":"  " } `}
                  onClick={() => navigate(link.link)
                  }
                >
                  {link.name}
                </li>
              );
            })}
          </div>
          <select name="Workspaces" id="" className="">
            <option value="workspace1">Workspace 1</option>
            <option value="workspace2">Workspace 2</option>
          </select>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SharedLayout;
