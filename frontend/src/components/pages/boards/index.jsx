import React, { useState } from "react";
import SharedLayout from "../../navbar";
import {
  ChatBubbleOutline,
  Dashboard,
  FiberManualRecord,
  History,
} from "@mui/icons-material";
import BoardBG from "../../../assets/png/board_bg.png";
import CardCarousel from "../../ReUsableComponents/carousel";
import { UseGlobalContext } from "../../../context/GlobalContext";
import CreateBoardForm from "./createBoard";

const Boards = () => {
  const [showArrows, setShowArrows] = useState(false);
  const { showBoardForm, setShowBoardForm, boardState, setBoardState, saveBoards } = UseGlobalContext();

  console.log(saveBoards, "boardState");  

  const boards = [
    { title: boardState.title, img: BoardBG, date: "Oct 22,2024" },
    { title: "Project A", img: BoardBG, date: "Nov 10,2024" },
    { title: "Task Management", img: BoardBG, date: "Dec 05,2024" },
    { title: "E-commerce", img: BoardBG, date: "Jan 15,2025" },
    { title: "AI Research", img: BoardBG, date: "Feb 28,2025" },
    { title: "E-commerce", img: BoardBG, date: "Jan 15,2025" },
    { title: "AI Research", img: BoardBG, date: "Feb 28,2025" },
    { title: "E-commerce", img: BoardBG, date: "Jan 15,2025" },
    { title: "AI Research", img: BoardBG, date: "Feb 28,2025" },
    { title: "E-commerce", img: BoardBG, date: "Jan 15,2025" },
    { title: "AI Research", img: BoardBG, date: "Feb 28,2025" },
  ];
  return (
    <SharedLayout>
      <div className="bg-[#ECEFF5] w-full p-20 overflow-hidden">
        <div className="flex justify-between items-center w-[95%] ">
          <div className="flex gap-1 items-center  ">
            <History />
            <h3 className="font-medium">Recent Boards</h3>
          </div>
          {boards.length > 3 && (
            <button
              onClick={() => setShowArrows(!showArrows)}
              className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
            >
              {showArrows ? "Hide" : "More"}
            </button>
          )}
        </div>

        <CardCarousel boards={boards} showArrows={showArrows} />
        <button className="w-[28%] min-h-[125px] h-auto border rounded-lg bg-[#CECECE] flex flex-col items-center justify-center " onClick={()=>setShowBoardForm(true)} >
          <span className="text-[20px]"> + </span>
          <span> Create New Board </span>
        </button>
        <div className="flex gap-1 items-center pt-8 pb-3">
          <Dashboard />
          <h3 className="font-medium">All Boards</h3>
        </div>
        <div className="w-[70%] max-h-[300px] overflow-y-auto">
          {boards.map((board, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[#bcbaba] mr-2 py-1.5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium">{board.title}</h3>
                <p className="text-xs">{board.date}</p>
              </div>
              <div className="flex items-center gap-4">
              <button
              className="border-blue-600 border text-black p-2 rounded-lg text-sm"
            >
              Chats
            </button>
              <button
              className="bg-blue-500 text-white p-2 rounded-lg text-sm"
            >
              Share
            </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SharedLayout>
  );
};

export default Boards;
