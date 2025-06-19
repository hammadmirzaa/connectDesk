import React, { useMemo, useState } from "react";
import TrashIcon from "../../../assets/icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcons from "../../../assets/icons/PlusIcons";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

function ColumnsContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

   const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const [comments, setComments] = useState([]);


   const handleComment = (text) => {
    setComments([
      ...comments,
      { user: "Ali", text, date: new Date().toLocaleString() }
    ]);
  };
    const handleStatusChange = (id, completed) => {
    setSelectedTask({ ...selectedTask, completed });

  };

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-black bg-opacity-80 w-[300px] rounded-2xl flex flex-col opacity-40 border-2 "
      />
    );
  }

  return (
    <>
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-white bg-opacity-80 backdrop-blur-lg
        text-black w-[300px] min-h-[120px] max-h-[90vh]
        rounded-2xl flex flex-col shadow-2xl mb-4 mr-4 border border-white/10
        transition
      "
    >
      
      <div
        onClick={() => setEditMode(true)}
        {...attributes}
        {...listeners}
        className="
          bg-white bg-opacity-90 h-[50px] cursor-grab rounded-2xl rounded-b-none
          p-3 font-bold border-b border-white/10 flex items-center justify-between select-none
        "
      >
        <div className="flex gap-2 items-center">
          {!editMode && <span className="truncate max-w-[180px]">{column.title}</span>}
          {editMode && (
            <input
              className="bg-black focus:border-blue-400 border border-white/20 text-white rounded outline-none px-2 py-1"
              type="text"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              autoFocus
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-gray-800 rounded px-1 py-1 transition"
          onClick={(e) => {
            e.stopPropagation();
            deleteColumn(column.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-2 flex-1 overflow-x-hidden overflow-y-auto min-h-[10px]"  >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <div onClick={() => { setSelectedTask(task); setShowModal(true); }} >
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
            </div>
          ))}
        </SortableContext>
      </div>

      <button
        className="
          flex gap-2 items-center
          bg-white
          border border-white/10 rounded-2xl px-4 py-2 mx-2 mb-3
          text-black hover:bg-white/10 active:bg-black transition
          font-medium
        "
        onClick={() => createTask(column.id)}
      >
        <PlusIcons /> Add a Task
      </button>

    </div>
            <TaskModal
        open={showModal}
        task={selectedTask}
        comments={comments}
        onClose={() => setShowModal(false)}
        onComment={handleComment}
        onStatusChange={handleStatusChange}
      />
      </>
  );
}

export default ColumnsContainer;
