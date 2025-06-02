// src/pages/HomePage.jsx
import React from "react";
import { Button, TextField } from "@mui/material";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-xl font-bold">ConnectDesk</h1>
        <div className="space-x-4">
          <Button variant="text">Sign In</Button>
          <Button variant="contained" color="primary">Sign up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-16 px-6">
        <p className="text-sm text-gray-600">Collaboration tool, made for everyone</p>
        <h2 className="text-4xl font-bold leading-snug mt-2">
          The Ultimate <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-transparent bg-clip-text">Workspace</span> for your use
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          Whether you're managing tasks, tracking progress, or communicating with your team, everything you need is in one place.
        </p>
        <img src="/assets/dashboard.png" alt="Dashboard" className="mx-auto mt-10 rounded-xl shadow-xl max-w-5xl w-full" />
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 px-10">
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="font-semibold text-lg mb-2">Task Management</h3>
          <p className="text-gray-600">
            Easily create, assign, and track tasks across teams. Stay organized with due dates, priorities, and progress indicators—all in one place.
          </p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h3 className="font-semibold text-lg mb-2">Instant Team Communication</h3>
          <p className="text-gray-600">
            Chat with teammates in real time without switching tools. Share ideas, updates, and files instantly to keep everyone in sync.
          </p>
        </div>
      </section>

      {/* Sign-Up Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-20 px-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sign up to collaborate freely with your team!</h2>
          <p className="text-gray-600 max-w-md">
            ConnectDesk provides you task management, seamless communication providing real time chats all in one place.
          </p>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-md max-w-md w-full mx-auto">
          <form className="space-y-4">
            <TextField label="Username" variant="outlined" fullWidth />
            <TextField label="Email Address" variant="outlined" fullWidth />
            <TextField label="Create Password" variant="outlined" type="password" fullWidth />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
            <Button variant="outlined" fullWidth startIcon={<img src="/assets/google-icon.svg" alt="Google" className="w-5 h-5" />}>
              Sign up with Google
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-20 mb-6">
        © 2025 ConnectDesk. All rights reserved.
      </footer>
    </div>
  );
}
