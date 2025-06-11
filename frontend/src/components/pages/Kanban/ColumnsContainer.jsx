import React, { useMemo, useState } from "react";
import TrashIcon from "../../../assets/icons/TrashIcon";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcons from "../../../assets/icons/PlusIcons";
import TaskCard from "./TaskCard";

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
        className="bg-columnBackgroundColor
        text-white
    w-[300px]
    h-auto
    rounded-2xl
    flex
    flex-col
    justify-space-between
    opacity-40
    border-2
    border-rose-500
    "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor
      text-white
    w-[300px]
    h-auto
    rounded-2xl
    flex
    flex-col
    justify-space-between
    text-sm
    "
    >
      <div
        onClick={() => setEditMode(true)}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor text-md h-[50px] cursor-grab rounded-2xl rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between "
      >
        <div className="flex gap-2 items-center ">
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              type="text"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => {
                setEditMode(false);
              }}
              autoFocus
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor
      rounded px-1 py-1 "
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto ">
        <SortableContext items={tasksIds} >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-2xl px-4 py-1 border-x-columnBackgroundColor hover:bg-mainBackgroundColor  active:bg-black "
        onClick={() => createTask(column.id)}
      >
        {" "}
        <PlusIcons /> Add Task
      </button>
    </div>
  );
}

export default ColumnsContainer;
