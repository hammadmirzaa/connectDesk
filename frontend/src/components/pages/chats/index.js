import React from "react";
import SharedLayout from "../../navbar";
import { Chat, FiberManualRecord, Tune } from "@mui/icons-material";
import BoardBG from "../../../assets/png/board_bg.png";
import { useNavigate } from "react-router-dom";

const Chats = () => {
    const navigate = useNavigate()
  const boards = [
    { id: "fyp", title: "FYP", img: BoardBG, date: "Oct 22,2024" },
    { id: "project-a", title: "Project A", img: BoardBG, date: "Nov 10,2024" },
    {
      id: "task-mgmt",
      title: "Task Management",
      img: BoardBG,
      date: "Dec 05,2024",
    },
    { id: "ecommerce", title: "E-commerce", img: BoardBG, date: "Jan 15,2025" },
  ];
  return (
    <SharedLayout>
      <div className="bg-[#ECEFF5] w-full p-20 overflow-hidden">
        <div className="flex justify-between items-center w-[70%] ">
          <div className="flex gap-1 items-center  ">
            <Chat />
            <h3 className="font-medium">Chats</h3>
          </div>
          <button className="  px-4 py-1 rounded-lg font-medium flex gap-1 ">
            <span>Filter</span>
            <Tune />
          </button>
        </div>
        <div className="w-[69%] max-h-[300px] overflow-y-auto">
          {boards.map((board, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[#bcbaba] mr-2 py-2 "
            >
              <div
                className="flex items-center gap-1 cursor-pointer "
                onClick={() => navigate(`/chats/${board.id}`)}
              >
                <h3 className="text-base">{board.title}</h3>
                <FiberManualRecord
                  className="text-red-500"
                  style={{ width: "10px" }}
                />
              </div>
              <p className="text-xs">{board.date}</p>
            </div>
          ))}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Chats;
