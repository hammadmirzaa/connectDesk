import React, { useEffect, useMemo, useState } from "react";
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
import { useParams } from "react-router-dom";
import { UseGlobalContext } from "../../../context/GlobalContext";
import BoardNavbar from "./BoardNavbar";
import { UseBoardsContext } from "../../../context/BoardsContext";

function Kanban() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeTask, setActiveTask] = useState(null);
  const { boardState, setBoardState, savedBoards } = UseGlobalContext();
  const { boards, addColumn, addTask, deleteTaskApi, deleteColumnApi, updateColumnApi, updateTaskApi } = UseBoardsContext();
  const { boardId } = useParams();

  

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setColumns(board?.columns || []);
      const allTasks = board?.columns?.flatMap((column) => column.tasks) || [];
      setTasks(allTasks);
    }
  }, [boards, boardId]);

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setBoardState({
        ...boardState,
        title: board.title,
        backgroundImage: board.background_image,
      });
    }
    // eslint-disable-next-line
  }, [boardId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <SharedLayout>
      <div className="w-full h-full relative">
        {/* Glassy Board Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: boardState.backgroundImage
              ? `url(${boardState.backgroundImage})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.90) blur(1px)",
            transition: "all 0.4s"
          }}
        />
        <div className="absolute inset-0 z-0 bg-black bg-opacity-60" />
        {/* Main content */}
        <div className="relative z-10 flex flex-col h-full min-h-[81.5vh]">
          <BoardNavbar savedBoards={savedBoards} />
          {/* Columns Row */}
          <div className="flex-1 px-10 py-8 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-4 items-start min-h-[120px] pb-8">
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="flex gap-4 items-start min-h-[120px] pb-8">
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
                      tasks={tasks.filter(
                        (task) => task.columnId === column.id
                      )}
                    />
                  ))}
                </SortableContext>
                {/* Add Column Glassy Button */}
                <button
                  onClick={generateNewColumns}
                  className="
                    min-w-[220px] h-[48px] flex items-center gap-2 px-4
                    bg-black bg-opacity-30 hover:bg-opacity-50 text-gray-100
                    border-2 border-dashed border-white/30 rounded-2xl
                    font-medium shadow-md
                    transition
                  "
                >
                  <PlusIcons /> Add another list
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
        </div>
      </div>
    </SharedLayout>
  );

  // ----- HANDLERS (all logic unchanged) -----
  async function generateNewColumns() {
    const columnsAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      board: boardId,
    };
    setColumns([...columns, columnsAdd]);
    await addColumn(columnsAdd);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  async function deleteColumn(id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
    await deleteColumnApi(id);
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

    if (!isActiveTask) return;

    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";
    if (isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  async function updateColumn(id, title) {
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
    await updateColumnApi({ id, title });
  }

  async function createTask(id) {
    const newTask = {
      id: generateId(),
      title: `Task ${tasks.length + 1}`,
      columnId: id,
    };
    setTasks([...tasks, newTask]);
    await addTask(newTask);
  }

  async function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    await deleteTaskApi(id);
  }

  async function updateTask(id, title, completed) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, title };
    });
    setTasks(newTasks);
    await updateTaskApi({ id, title, completed });
  }
}

export default Kanban;
