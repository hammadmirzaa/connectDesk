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
    // your predefined list of images
    "https://images.unsplash.com/photo-1581349481708-c42e6accc346?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1607093800858-89f11382d45e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1526403221810-81a6a226eebb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1581092334600-7b01f1dc65b3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
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
