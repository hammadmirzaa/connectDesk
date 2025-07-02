import React, { useState } from "react";
import { X, List, MessageCircle } from "lucide-react";

export default function TaskModal({ open, task, activities, comments, onClose, onComment, onStatusChange }) {
  const [comment, setComment] = useState("");

  if (!open || !task) return null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#23272f] w-full max-w-md rounded-xl shadow-lg p-8 relative flex flex-col gap-4">

        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex justify-center items-center gap-2" >
          {task.completed ? (

            <span className="text-green-400"><svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          ) : (
            <span className="text-gray-400"><svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><circle cx={12} cy={12} r={8} /></svg></span>
          )}
          <span className="text-lg font-semibold text-white">{task.title}</span>
          </div>
          <span className={`ml-3 px-2 py-0.5 rounded text-xs font-bold uppercase
            ${task.completed ? "bg-green-700 text-green-200" : "bg-gray-700 text-gray-300"}`}>
            {task.completed ? "Completed" : "Incomplete"}
          </span>
         
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={18} className="text-gray-400" />
            <span className="font-medium text-gray-200">Comments</span>
          </div>
          <div className="bg-[#1e2229] rounded px-3 py-2 max-h-28 overflow-y-auto text-gray-300 text-sm mb-3">
            {comments?.length ? (
              comments.map((c, i) => (
                <div key={i} className="mb-1">
                  <span className="font-semibold">{c.user}</span>: {c.text}
                  <span className="ml-2 text-xs text-gray-400">{c.date}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">No comments yet.</span>
            )}
          </div>
          <form className="flex gap-2 mt-2" onSubmit={handleCommentSubmit}>
            <input
              className="flex-1 bg-[#23272f] border border-gray-700 rounded p-2 text-sm text-gray-100"
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
