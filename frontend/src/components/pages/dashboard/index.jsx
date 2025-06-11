import React, { useState } from "react";
import SharedLayout from "../../navbar/index";
import {
  History,
  ChatBubbleOutline,
  FiberManualRecord,
} from "@mui/icons-material";
import BoardBG from "../../../assets/png/board_bg.png";
import CardCarousel from "../../ReUsableComponents/carousel";
import { UseBoardsContext } from "../../../context/BoardsContext";

const Dashboard = () => {
  const [showArrows, setShowArrows] = useState(false);
  const { boards } = UseBoardsContext();

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

        <div className="flex gap-1 items-center py-3">
          <ChatBubbleOutline />
          <h3 className="font-medium">Recent Chats</h3>
        </div>
        <div className="w-[70%] max-h-[300px] overflow-y-auto">
          {boards.map((board, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[#bcbaba] mr-2 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-1">
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

export default Dashboard;
