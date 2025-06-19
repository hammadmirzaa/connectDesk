import React, { useState } from "react";
import TrashIcon from "../../../assets/icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit } from "@mui/icons-material";
import { Edit2Icon } from "lucide-react";

function TaskCard({ task, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleComplete = (e) => {
    e.stopPropagation();
    updateTask(task.id, task.title, !task.completed);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-black bg-opacity-60
          p-3 h-[100px] min-h-[100px]
          flex items-center rounded-xl
          border-2 border-blue-500/60
          shadow-2xl opacity-70
          cursor-grab
        "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
          bg-black bg-opacity-70 backdrop-blur text-white
          p-3 text-md max-h-[300px] flex items-center
          rounded-xl shadow-2xl cursor-grab border border-white/10
        "
      >
        <textarea
          className="
            w-full min-h-[80px] resize-none border-none rounded
            bg-transparent text-white focus:outline-none
            placeholder:text-gray-400
          "
          value={task.title}
          autoFocus
          onChange={(e) => updateTask(task.id, e.target.value, task.completed)}
          placeholder="Task Content Here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) toggleEditMode();
          }}
        />
      </div>
    );
  }

   return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // onClick={toggleEditMode}
      className="
        bg-white bg-opacity-70 backdrop-blur-lg
        text-black p-3 text-[15px] max-h-[300px]
        flex items-center rounded-xl
        shadow-2xl cursor-pointer mb-2
        relative border border-white/10
        transition hover:border-blue-400/60 hover:ring-2 hover:ring-blue-500/30
      "
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {/* Radio button always shows on hover or if completed */}
      {(mouseIsOver || task.completed) && (
        <div className="absolute left-3 top-3 flex items-center group z-20">
          <button
            key={task?.id}
            onClick={handleComplete}
            tabIndex={-1}
            className={`
              w-5 h-5 rounded-full border-2 
              ${task.completed ? 'border-green-500 bg-green-500' : 'border-gray-400 bg-white'}
              flex items-center justify-center hover:border-blue-500 transition
              relative
            `}
          >
            {/* Show checkmark if completed */}
            {task.completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span
            className="
              opacity-0 group-hover:opacity-100 transition ml-2 px-2 py-1 bg-gray-500 text-white text-xs rounded z-30
              absolute top-0 left-7 pointer-events-none
            "
          >
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </span>
        </div>
      )}

      {/* Main task content */}
      <p
        className={`my-auto w-full overflow-y-auto whitespace-pre-wrap ml-6 ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </p>

      {/* Trash button on hover */}
      {mouseIsOver && (
        <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleEditMode();
          }}
          className="stroke-black absolute right-10 top-3 hover:scale-110 transition"
        >
          <Edit2Icon />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="stroke-black absolute right-3 top-3 hover:scale-110 transition"
        >
          <TrashIcon />
        </button>
        </>
      )}
      
    </div>
    
  );
}

export default TaskCard;
