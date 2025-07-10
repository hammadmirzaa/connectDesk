import React, { useState, useEffect } from "react";
import { UseBoardsContext } from "../../../context/BoardsContext";
import { UseAuthContext } from "../../../context/AuthContext";
import CardCarousel from "../../ReUsableComponents/carousel";
import {
  History,
  Search,
  Group,
  Chat,
  AccountCircle,
} from "@mui/icons-material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import boardIllustration from "../../../assets/png/board_illustration.png";
import chatIllustration from "../../../assets/png/Chat_illustration.png";
import taskIllustration from "../../../assets/png/task_illustration.png";
import { Link } from "react-router-dom";
import SharedLayout from "../../navbar";
import OnBoarding from "./OnBoarding";
import ChatbotWidget from "../../chatbot/ChatBot";
import { useRoomContext } from "../../../context/RoomContext";
import { useWorkspace } from "../../../context/WorkspacesContext";

const Dashboard = () => {
  const [showArrows, setShowArrows] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [onboarded, setOnboarded] = useState(false);
  const { boards } = UseBoardsContext();
  const { username, fetchAllUsers, users } = UseAuthContext();
  const {rooms} = useRoomContext();
  const {workspaces} = useWorkspace();
  useEffect(() => {
    fetchAllUsers();
  }, []);
  // Carousel data
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % taskManagementSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [taskManagementSlides.length]);

  const getIllustration = (type) => {
    if (type === "task") return taskIllustration;
    if (type === "team") return boardIllustration;
    if (type === "progress") return chatIllustration;
    return "";
  };

  const stats = [
    {
      label: "Boards",
      value: boards?.length,
      icon: <ViewKanbanIcon fontSize="small" />,
    },
    { label: "Chats", value: rooms?.length, icon: <Chat fontSize="small" /> },
    { label: "Teams", value: workspaces?.length, icon: <Group fontSize="small" /> },
  ];
  const upcoming = [{ title: "Meeting", date: "June 17" }];

  const mainUser = users.filter((user) => user.admin === true)[0];

  return (
    <>
          {onboarded ?
       ( <OnBoarding onFinish={() => setOnboarded(false)} />
      ):
    <SharedLayout>
      <div className="flex gap-6 max-w-screen-2xl w-full mx-auto py-8 px-6 ">
        <section className="flex-1 min-w-0">

          <div className="rounded-2xl bg-blue-600 text-white p-8 flex items-center justify-between mb-8 shadow-md">
            <div>
              <div className="text-xl font-bold mb-2">
                Your Team's New Digital Workspace Starts Here
              </div>
              <div className="text-sm mb-4">
                Create boards, track tasks, and chat live with your
                team—ConnectDesk brings clarity to collaboration.
              </div>
              <button className="bg-white text-blue-600 font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-50 transition" onClick={()=>setOnboarded(true)}>
                Get Started
              </button>
            </div>
            <img
              src={boardIllustration}
              alt="Banner"
              className="h-28 w-28 object-contain"
            />
          </div>

          <div className="rounded-2xl bg-white border p-5 mb-8 shadow-sm flex items-center gap-5">
            <div className="rounded-full bg-blue-100 p-2">
              <Group className="text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Team Collaboration</div>
              <div className="text-gray-500 text-sm">
                Seamlessly collaborate with team members, share files, and
                communicate in real-time to boost productivity.
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border p-6 mb-10 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-bold text-lg mb-2">
                {taskManagementSlides[currentSlide].title}
              </div>
              <div className="text-gray-600 max-w-md text-sm">
                {taskManagementSlides[currentSlide].description}
              </div>
            </div>
            <img
              src={getIllustration(
                taskManagementSlides[currentSlide].illustration
              )}
              alt={taskManagementSlides[currentSlide].title}
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className="flex justify-center items-center mb-8 gap-2">
            {taskManagementSlides.map((_, idx) => (
              <button
                key={idx}
                className={`inline-block w-2 h-2 rounded-full transition-colors border ${
                  idx === currentSlide
                    ? "bg-gray-400 border-gray-400"
                    : "bg-gray-200 border-gray-200"
                }`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-1 items-center">
              <h3 className="font-medium">Recent Boards</h3>
            </div>
            {boards.length > 3 && (
              <button
                onClick={() => setShowArrows(!showArrows)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {showArrows ? "Hide" : "More"}
              </button>
            )}
          </div>
          <div>
            {boards.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8">
                No boards yet. Click{" "}
                <span className="text-blue-600 font-semibold">Get Started</span>{" "}
                above to create your first board!
              </div>
            ) : (
              <CardCarousel boards={boards} showArrows={showArrows} />
            )}
          </div>
          <div className="flex justify-between items-center pt-6 mb-2">
            <h3 className="font-semibold text-base">Recent Chats</h3>
            <Link
              to="#"
              className="text-xs text-blue-800 font-medium hover:underline"
            >
              View all chats
            </Link>
          </div>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {rooms?.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8">
                No chats yet. Your recent chats will appear here when you start
                collaborating!
              </div>
            ) : (
              rooms?.map((board, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer bg-white rounded-md px-4 py-3 border border-gray-200 text-sm shadow-sm"
                >
                  <span>{board.name}</span>
                  
                </div>
              ))
            )}
          </div>
        </section>
        <aside className="w-[330px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <AccountCircle className="text-blue-400" fontSize="large" />
            <div>
              <div className="font-bold text-gray-900">
                {mainUser?.username || "Admin"}
              </div>
              <div className="text-xs text-gray-500">Welcome back!</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h4 className="font-bold text-gray-800 mb-4">Statistics</h4>
            <div className="flex gap-4">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 flex-1"
                >
                  <div className="mb-1">{s.icon}</div>
                  <div className="font-bold text-blue-800">{s.value}</div>
                  <div className="text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h4 className="font-bold text-gray-800 mb-2">Upcoming</h4>
            {upcoming.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex gap-2 items-center">
                  <Group className="text-blue-500" fontSize="small" />
                  <span className="text-gray-700">{item.title}</span>
                </div>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
          <ChatbotWidget />
        </aside>
      </div>
    </SharedLayout>
          }
    </>
  );
};

export default Dashboard;
