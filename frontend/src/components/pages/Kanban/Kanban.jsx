import React, { useMemo, useState } from "react";
import PlusIcons from "../../../assets/icons/PlusIcons";
import ColumnsContainer from "./ColumnsContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import SharedLayout from "../../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { UseGlobalContext } from "../../../context/GlobalContext";
import BoardNavbar from "./BoardNavbar";

function Kanban() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeTask, setActiveTask] = useState(null);

const { boardState, saveBoardState, savedBoards, setBoardState } = UseGlobalContext();

  console.log(boardState, "boardState");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

const handleSave = () => {
  saveBoardState(columns, tasks);
};

const handleLoad = (boardId) => {
  const board = savedBoards.find((b) => b.id === boardId);
  if (board) {
    setColumns(board.columns);
    setTasks(board.tasks);
    setBoardState({ ...boardState, title: board.title, selectedBg: board.selectedBg });
  }
};




  return (
    <SharedLayout>
    <div className="w-full" >
<BoardNavbar
  onSave={handleSave}
  onLoad={handleLoad}
  savedBoards={savedBoards}
/>
    <div className="m-auto flex min-h-[90%] w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"
    style={{backgroundImage: ` ${boardState.selectedBg ? `url(${boardState.selectedBg})`:`` }  `, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4 ">
          <div className="flex gap-2 ">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnsContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={generateNewColumns}
            className="
            text-white
    h-[30px]
    w-[250px]
    min-w-[250px]
    bg-mainBackgroundColor
    border-2
    border-columnBackgroundColor
    p-4
   [#1565C0]
    hover:ring-2
    flex
    justify-center
    items-center
    gap-2
    rounded-2xl
    "
          >
            <PlusIcons /> Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnsContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
    </div>
    </SharedLayout>
  );
  function generateNewColumns() {
    const columnsAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnsAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteColumn(id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }
  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if(!isActiveTask) return;

    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex(
          (task) => task.id === activeId
        );
        const overIndex = tasks.findIndex(
          (task) => task.id === overId
        );
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";
    if (isOverAColumn) {
        setTasks((tasks) => {
        const activeIndex = tasks.findIndex(
          (task) => task.id === activeId
        );
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          title,
        };
      }
      return col;
    });
    setColumns(newColumns);
  }

  function createTask(id) {
    const newTask = {
      id: generateId(),
      title: `Task ${tasks.length + 1}`,
      columnId: id,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, title) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;

      return { ...task, title };
    });
    setTasks(newTasks);
  }
}

export default Kanban;
