import React, { useState } from "react";
import SharedLayout from "../../navbar";
import CardCarousel from "../../ReUsableComponents/carousel";
import { UseGlobalContext } from "../../../context/GlobalContext";
import { UseBoardsContext } from "../../../context/BoardsContext";

const Boards = () => {
  const [showArrows, setShowArrows] = useState(false);
  const {
    showBoardForm,
    setShowBoardForm,
  } = UseGlobalContext();
  const { boards } = UseBoardsContext();

  return (
    <SharedLayout>
      <div className="bg-[#ffffff] min-h-screen py-10">
        {/* Search bar */}
        <div className="max-w-4xl mx-auto pb-8 px-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search boards..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition"
            />
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 mb-12">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-semibold text-xl mb-2 text-gray-800">Getting started with boards</h2>
            <p className="text-gray-500 mb-3">Just a few steps to supercharge your productivity!</p>
            <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
              <li>Create a board</li>
              <li>Add members</li>
              <li>Use task lists and chats</li>
              <li>Make boards public/private</li>
            </ul>
          </div>
          {/* Right: Video */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-gray-200 shadow-lg border border-gray-100 flex items-center justify-center aspect-video">
              <iframe
                width="100%"
                height="240"
                src="https://www.youtube.com/embed/xhuA3wCg06E" 
                title="Getting Started With Boards"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Add New Board Section */}
        <div className="max-w-4xl mx-auto w-full border-t border-gray-200 pt-7 mb-10">
          <div className="mb-2 font-medium text-base text-gray-700 flex items-center gap-2">
            Add a new board
          </div>
          <button
            className="w-48 h-28 border-2 border-dashed rounded-xl bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 flex flex-col items-center justify-center text-5xl text-gray-400 hover:bg-gray-300 hover:text-blue-500 hover:border-blue-400 transition-shadow shadow-sm mb-6 group relative"
            onClick={() => setShowBoardForm(true)}
          >
            <span className="transition-transform group-hover:scale-110">+</span>
            <span className="absolute bottom-3 text-xs text-gray-500 group-hover:text-blue-600 transition">Create Board</span>
          </button>
        </div>

        {/* Boards Carousel */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-base text-gray-700">Recent Boards</h3>
            {boards.length > 3 && (
              <button
                onClick={() => setShowArrows(!showArrows)}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm shadow hover:bg-blue-600 transition"
              >
                {showArrows ? "Hide" : "More"}
              </button>
            )}
          </div>
          <CardCarousel boards={boards} showArrows={showArrows} />
          {boards.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">No boards yet. Click + to add your first board!</div>
          )}
        </div>

        {/* All Boards Section */}
        <div className="max-w-4xl mx-auto w-full border-t border-gray-200 pt-7">
          <div className="mb-3 font-semibold text-lg text-gray-900 flex items-center gap-2">
            All Boards
            <span className="ml-2 text-xs font-normal text-gray-400">
              {boards.length} total
            </span>
          </div>
          <div className="w-full max-w-4xl">
            {boards.length === 0 ? (
              <div className="text-center text-gray-400 text-base py-10">No boards to show. Start by creating one!</div>
            ) : (
              boards.map((board, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-200 rounded-lg bg-white mb-3 px-4 py-3 shadow-sm hover:shadow transition group"
                >
                  <span className="text-base font-medium text-gray-800 group-hover:text-blue-700 transition">
                    {board.title}
                  </span>
                  <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 transition">
                    {/* Share SVG icon */}
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M15 8l5 4-5 4M20 12H9a5 5 0 1 1 0-10h1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Share
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Boards;
