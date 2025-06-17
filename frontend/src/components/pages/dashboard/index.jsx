import React, { useState, useEffect } from "react";
import SharedLayout from "../../navbar/index";
import {
  History,
  ChatBubbleOutline,
  FiberManualRecord,
  Search,
} from "@mui/icons-material";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import BoardBG from "../../../assets/png/board_bg.png";
import CardCarousel from "../../ReUsableComponents/carousel";
import { UseBoardsContext } from "../../../context/BoardsContext";
import boardIllustration from "../../../assets/png/board_illustration.png";
import chatIllustration from "../../../assets/png/Chat_illustration.png";
import taskIllustration from "../../../assets/png/task_illustration.png";
import heyIcon from "../../../assets/png/hey_icon.png";
import { UseAuthContext } from "../../../context/AuthContext";

const Dashboard = () => {
  const [showArrows, setShowArrows] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { boards } = UseBoardsContext();
  const {username, loginUser} = UseAuthContext();

  useEffect(()=>{
loginUser()
  },[])

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


  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % taskManagementSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [taskManagementSlides.length]);

  return (
    <SharedLayout>
      <div className=" w-full p-8 overflow-hidden">
        {/* Welcome Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full ">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Welcome User Section */}
          <div className="text-center mb-8">
            <div className="flex items-center  mb-4 gap-2 ">
                <WavingHandIcon className="w-10 h-10 text-yellow-400 " />
            <h1 className="text-2xl font-bold text-gray-800 ">
              Welcome {username}!
            </h1>
            </div>
            <p className="text-gray-600 max-w-2xl text-left">
              Whether you're managing tasks, tracking progress, or communicating
              with your team, everything you need is in one place.
            </p>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {taskManagementSlides[currentSlide].title}
              </h2>
              <p className="text-gray-600 max-w-md">
                {taskManagementSlides[currentSlide].description}
              </p>
            </div>
            <div className="flex-shrink-0 ml-8">
              {/* Task Management Illustration */}
              <div className="w-48 h-32 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    {taskManagementSlides[currentSlide].illustration ===
                      "task" && (
                      <img
                        src={taskIllustration}
                        alt="Task"
                        className="w-58 h-58 object-contain"
                      />
                    )}
                    {taskManagementSlides[currentSlide].illustration ===
                      "team" && (
                      <img
                        src={boardIllustration}
                        alt="Team"
                        className="w-58 h-58 object-contain"
                      />
                    )}
                    {taskManagementSlides[currentSlide].illustration ===
                      "progress" && (
                      <img
                        src={chatIllustration}
                        alt="Progress"
                        className="w-8 h-8 object-contain"
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {taskManagementSlides[currentSlide].title}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {taskManagementSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recent Boards Section */}
        <div className="flex justify-between items-center w-[95%] mb-4">
          <div className="flex gap-1 items-center">
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

        {/* Recent Chats Section */}
        <div className="flex gap-1 items-center py-5">
          <ChatBubbleOutline />
          <h3 className="font-medium">Recent Chats</h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {boards.map((board, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-[#e1e0e0] mr-2 py-3 cursor-pointer bg-white rounded-lg p-6 mb-2 shadow-sm "
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
