import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import TuneIcon from "@mui/icons-material/Tune";
import { useParams } from "react-router-dom";
import SharedLayout from "../../navbar";
import {
  AttachFile,
  EmojiEmotions,
  MoreHoriz,
  VideoCall,
} from "@mui/icons-material";
import BasicTabs from "./tabs";

const chatList = [
  { id: "fyp", name: "FYP", lastMessage: "Oct 22, 2024" },
  { id: "project-a", name: "Project A", lastMessage: "Nov 10, 2024" },
  { id: "task-mgmt", name: "Task Management", lastMessage: "Dec 05, 2024" },
  { id: "ecommerce", name: "E-commerce", lastMessage: "Jan 15, 2025" },
];

const chatMessages = {
  fyp: [
    {
      sender: "User",
      text: "Hey, how's the project?",
      time: "10:00 AM",
      type: "sent",
    },
    {
      sender: "You",
      text: "Going well! Need any updates?",
      time: "10:05 AM",
      type: "received",
    },
    {
      sender: "User",
      text: "Hey, how's the project?",
      time: "10:00 AM",
      type: "sent",
    },
    {
      sender: "You",
      text: "Going well! Need any updates?",
      time: "10:05 AM",
      type: "received",
    },
    {
      sender: "User",
      text: "Hey, how's the project?",
      time: "10:00 AM",
      type: "sent",
    },
    {
      sender: "You",
      text: "Going well! Need any updates?",
      time: "10:05 AM",
      type: "received",
    },
  ],
  "project-a": [
    {
      sender: "User",
      text: "What's the deadline?",
      time: "9:30 AM",
      type: "sent",
    },
  ],
  "task-mgmt": [
    { sender: "User", text: "Any blockers?", time: "12:00 PM", type: "sent" },
    { sender: "You", text: "Not yet!", time: "12:05 PM", type: "received" },
  ],
  ecommerce: [
    {
      sender: "User",
      text: "Can we launch the site?",
      time: "2:00 PM",
      type: "sent",
    },
  ],
};

const ChatApp = () => {
  const { chatId } = useParams();

  return (
    <SharedLayout>
      <div className="flex h-[87vh] w-full">
        <div className="bg-[#ECEFF5] w-[70%] h-full flex flex-col pt-5  ">

          <Typography variant="h6" component="h6" fontWeight="bold" sx={{paddingX:'2.5rem'}} >
            Chats
          </Typography>
          <Typography mb={2} sx={{paddingX:'2.5rem'}} >{chatId.toUpperCase()}</Typography>

          <div className="flex-1 overflow-y-auto px-10 scrollbar-hide ">
            <Box display="flex" flexDirection="column" gap={2}>
              {chatMessages[chatId].map((msg, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    maxWidth: "60%",
                    alignSelf: msg.type === "sent" ? "flex-start" : "flex-end",
                    bgcolor: msg.type === "sent" ? "#fff" : "#1976d2",
                    color: msg.type === "sent" ? "#000" : "#fff",
                    borderRadius: "15px",
                    borderBottomLeftRadius: msg.type === "sent" ? "0px" : "15px",
                    borderBottomRightRadius: msg.type === "sent" ? "15px" : "0px",
                  }}
                >
                <div className="flex justify-between items-center " >
                <Typography fontWeight={'bold'} fontSize={'16px'} >{msg.sender}</Typography>
                <Typography  variant="caption">{msg.time}</Typography>
                </div>
                  <Typography>{msg.text}</Typography>
                </Paper>
              ))}
            </Box>
          </div>

          <div className="sticky bottom-0 bg-white shadow-md p-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-[100%] mx-auto">
              <EmojiEmotions className="text-gray-500" />
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-transparent outline-none px-2 text-gray-700"
              />
              <div className="flex items-center gap-3">
                <AttachFile className="text-gray-500 cursor-pointer" />
                <MoreHoriz className="text-gray-500 cursor-pointer" />
                <VideoCall className="text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] p-4  ">
        <BasicTabs/>
        </div>
      </div>
    </SharedLayout>
  );
};

export default ChatApp;
