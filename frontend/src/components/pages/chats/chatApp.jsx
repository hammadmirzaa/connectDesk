import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, IconButton, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import TuneIcon from "@mui/icons-material/Tune";
import { useParams } from "react-router-dom";
import SharedLayout from "../../navbar";

const chatList = [
  { id: "fyp", name: "FYP", lastMessage: "Oct 22, 2024" },
  { id: "project-a", name: "Project A", lastMessage: "Nov 10, 2024" },
  { id: "task-mgmt", name: "Task Management", lastMessage: "Dec 05, 2024" },
  { id: "ecommerce", name: "E-commerce", lastMessage: "Jan 15, 2025" },
];

const chatMessages = {
  fyp: [
    { sender: "User", text: "Hey, how's the project?", time: "10:00 AM", type: "sent" },
    { sender: "You", text: "Going well! Need any updates?", time: "10:05 AM", type: "received" },
    { sender: "User", text: "Hey, how's the project?", time: "10:00 AM", type: "sent" },
    { sender: "You", text: "Going well! Need any updates?", time: "10:05 AM", type: "received" },
    { sender: "User", text: "Hey, how's the project?", time: "10:00 AM", type: "sent" },
    { sender: "You", text: "Going well! Need any updates?", time: "10:05 AM", type: "received" },
  ],
  "project-a": [
    { sender: "User", text: "What's the deadline?", time: "9:30 AM", type: "sent" },
  ],
  "task-mgmt": [
    { sender: "User", text: "Any blockers?", time: "12:00 PM", type: "sent" },
    { sender: "You", text: "Not yet!", time: "12:05 PM", type: "received" },
  ],
  ecommerce: [
    { sender: "User", text: "Can we launch the site?", time: "2:00 PM", type: "sent" },
  ],
};

const ChatApp = () => {
  const {chatId} = useParams()

  return (
    <SharedLayout>
    <div className="bg-[#ECEFF5] max-h-screen  p-20 overflow-y-auto" style={{width:'70%'}}>
          <Typography variant="h6" component="h6" fontWeight="bold" >Chats</Typography>
            <Typography   mb={2}>
              {chatId.toUpperCase()}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {chatMessages[chatId].map((msg, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    maxWidth: "60%",
                    alignSelf: msg.type === "sent" ? "flex-start " : "flex-end",
                    bgcolor: msg.type === "sent" ? "#fff" : "#1976d2",
                    color: msg.type === "sent" ? "#000" : "#fff",
                    borderTopLeftRadius:msg.type ==="sent"?" 15px" : "15px",
                    borderBottomLeftRadius:msg.type ==="sent"?" 0px" : "15px",
                    borderTopRightRadius:msg.type ==="sent"?" 15px" : "15px",
                    borderBottomRightRadius:msg.type ==="sent"?" 15px" : "0px",
                  }}
                >
                  <Typography>{msg.text}</Typography>
                  <Typography variant="caption">{msg.time}</Typography>
                </Paper>
              ))}
            </Box>
      </div>
      <div className="w-[30%]" >
      Media
      </div>
    </SharedLayout>
  );
};

export default ChatApp;
