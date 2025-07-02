import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseGlobalContext } from "../../../context/GlobalContext";
import { UseBoardsContext } from "../../../context/BoardsContext";
import { useWorkspace } from "../../../context/WorkspacesContext";

const CreateBoardForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [selectedBg, setSelectedBg] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [error, setError] = useState("");

  const { setShowBoardForm, setBoardState } = UseGlobalContext();
  const { setBoards, boards, saveBoard } = UseBoardsContext();
  const navigate = useNavigate();
  const modalRef = useRef();
  const { workspaces, fetchWorkspaces } = useWorkspace();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

const backgroundOptions = [
  "https://images.unsplash.com/photo-1612831455544-bb7f0c530e84?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1600&q=80",    
  "https://images.unsplash.com/photo-1616401786637-1d6d9c7c4d14?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1616627985843-4cdb7f31c5e9?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1618005198919-d3d4e5a8f94c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1600&q=80", 
];


const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Selected workspace ID:", workspace);  // Log the workspace ID

  if (!title) {
    setError("Board title is required");
    return;
  }

  try {
    const newBoard = await saveBoard({
      title,
      background_image: selectedBg,
      workspace,
    });

    if (!newBoard) throw new Error("Failed to create board");

    setBoardState(newBoard);
    setShowBoardForm(false);
    navigate(`/kanban/${newBoard.id}`);
  } catch (err) {
    console.error(err);
    setError("Something went wrong while creating the board.");
  }
};


  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"></div>

      {/* Modal */}
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="relative bg-[#1f1f1f] text-white p-6 rounded-xl w-full max-w-md shadow-xl z-50"
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Create board</h2>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {backgroundOptions.map((url, i) => (
            <div
              key={i}
              onClick={() => setSelectedBg(url)}
              className={`h-12 rounded cursor-pointer border-2 bg-cover bg-center ${
                selectedBg === url ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="Board title*"
          className="w-full p-2 rounded bg-gray-700 text-white mb-1"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <label className="block text-sm mb-1 mt-3">Workspaces</label>

        <select
          value={workspace}
          onChange={(e) => {setWorkspace(e.target.value)
          console.log("Selected workspace:", e.target.value);
          }
        }
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        >
          {workspaces.map((w, i) => {
            return (
              <option key={i} value={w.id}>
                {w.name}
              </option>
            );
          })}
        </select>

        <p className="text-xs text-gray-400 mb-4">
          This Workspace has 7 boards remaining.
          <br />
          Free Workspaces can only have 10 open boards. For unlimited boards,
          upgrade your Workspace.
        </p>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateBoardForm;
