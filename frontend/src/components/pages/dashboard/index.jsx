import React, { useState, useEffect } from "react";
import SharedLayout from "../../navbar/index";
// import { History, ChatBubbleOutline, FiberManualRecord, Search } from "@mui/icons-material"; // REMOVE MUI ICONS
// import WavingHandIcon from '@mui/icons-material/WavingHand'; // REMOVE
import BoardBG from "../../../assets/png/board_bg.png";
import CardCarousel from "../../ReUsableComponents/carousel";
import { UseBoardsContext } from "../../../context/BoardsContext";
import boardIllustration from "../../../assets/png/board_illustration.png";
import chatIllustration from "../../../assets/png/Chat_illustration.png";
import taskIllustration from "../../../assets/png/task_illustration.png";
import heyIcon from "../../../assets/png/hey_icon.png";
import { UseAuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { History } from "@mui/icons-material";

const Dashboard = () => {
  const [showArrows, setShowArrows] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { boards } = UseBoardsContext();
  const { username } = UseAuthContext();

  // Task management slides data
  const taskManagementSlides = [
    {
      title: "Task management",
      description:
        "Whether you're managing tasks, tracking progress, or communicating with your team, everything you need is in one place.",
      illustration: "task",
    },
    {
      title: "Team Collaboration",
      description:
        "Seamlessly collaborate with your team members, share files, and communicate in real-time to boost productivity.",
      illustration: "team",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor project progress, set milestones, and track deadlines to ensure your projects stay on schedule.",
      illustration: "progress",
    },
  ];

  const goToSlide = (index) => setCurrentSlide(index);

  // Auto-slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % taskManagementSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [taskManagementSlides.length]);

  // Helper for illustrations
  const getIllustration = (type) => {
    if (type === "task") return taskIllustration;
    if (type === "team") return boardIllustration;
    if (type === "progress") return chatIllustration;
    return "";
  };

  return (
    <SharedLayout>
      <div className="bg-[#fff] min-h-screen px-0 pb-20">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto pt-6 px-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            </span>
          </div>
        </div>

        {/* Welcome User */}
        <div className="max-w-4xl mx-auto pt-8 px-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <span>
              <span className="font-bold text-blue-700">
                Hey, {username || "Admin"}
              </span>
              <span className="block text-sm text-gray-500 font-normal">
                Welcome back!
              </span>
            </span>
          </div>
        </div>

        {/* Headline + Subhead */}
        <div className="max-w-4xl mx-auto pt-6 px-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Your Team’s New Digital Workspace Starts Here
          </h2>
          <div className="text-gray-600 text-sm mb-8">
            Create boards, track tasks, and chat live with your team—ConnectDesk
            brings clarity to collaboration.
          </div>
        </div>

        {/* Task Management Card/Carousel */}
        <div className="max-w-4xl mx-auto px-2">
          <div className="bg-white border rounded-2xl flex items-center justify-between p-6 mb-10 shadow-sm">
            {/* Text */}
            <div>
              <div className="font-bold text-lg mb-2">
                {taskManagementSlides[currentSlide].title}
              </div>
              <div className="text-gray-600 max-w-md text-sm">
                {taskManagementSlides[currentSlide].description}
              </div>
            </div>
            {/* Illustration */}
            <div>
              <img
                src={getIllustration(
                  taskManagementSlides[currentSlide].illustration
                )}
                alt={taskManagementSlides[currentSlide].title}
                className="w-36 h-36 object-contain"
              />
            </div>
          </div>
          {/* Carousel dots */}
          <div className="flex justify-center items-center mb-8 gap-2">
            {taskManagementSlides.map((_, idx) => (
              <button
                key={idx}
                className={`inline-block w-2 h-2 rounded-full transition-colors border ${
                  idx === currentSlide
                    ? "bg-gray-400 border-gray-400"
                    : "bg-gray-200 border-gray-200"
                }`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Recent Boards Section */}
        <div className="max-w-4xl mx-auto flex justify-between px-2">
          <div className="flex gap-1 items-center">
            <History />
            <h3 className="font-medium">Recent Boards</h3>
          </div>
          {boards.length > 3 && (
            <button
              onClick={() => setShowArrows(!showArrows)}
              className="bg-blue-500 text-white px-6 py-1 rounded-lg text-sm"
            >
              {showArrows ? "Hide" : "More"}
            </button>
          )}
        </div>
        <div className="max-w-4xl mx-auto px-2" >
          <CardCarousel boards={boards} showArrows={showArrows} />
        </div>
        {/* Recent Chats Section */}
        <div className="max-w-4xl mx-auto px-2 flex justify-between pt-6 items-center">
          <h3 className="font-semibold text-base">Recent Chats</h3>
          <Link
            to="#"
            className="text-xs text-blue-800 font-medium hover:underline"
          >
            View all chats
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-2 mt-2 flex flex-col gap-2 max-h-[400px] overflow-y-auto ">
          {boards.map((board, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white rounded-md px-4 py-3 border border-gray-200 text-sm shadow-sm"
            >
              <span>{board.title}</span>
              <span className="text-xs text-gray-500">{new Date(board.created_at)
                      .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      .replace(",", "")}</span>
            </div>
          ))}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Dashboard;
