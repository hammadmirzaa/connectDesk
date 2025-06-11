import React from "react";
import { UserRound, Share2, Lock, Star, LayoutGrid, ChevronDown, Filter, Zap, Send } from "lucide-react";
import { UseGlobalContext } from "../../../context/GlobalContext";
import { UseBoardsContext } from "../../../context/BoardsContext";

const BoardNavbar = ({savedBoards }) => {
    const {boardState} = UseGlobalContext();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-black bg-opacity-70 text-white shadow-sm">

      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{boardState.title}</h1>
        <Star size={16} className="text-gray-400 cursor-pointer hover:text-yellow-400" />
        <Lock size={16} className="text-gray-400" />
        <button className="flex items-center gap-1 text-sm bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300">
          <LayoutGrid size={14} />
          Board
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Send size={16} className="cursor-pointer hover:text-gray-300" />
        <Zap size={16} className="cursor-pointer hover:text-gray-300" />
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
          <Filter size={16} />
          <span className="text-sm">Filters</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center text-sm font-semibold">
          H
        </div>
      </div>
    </nav>
  );
};

export default BoardNavbar;
