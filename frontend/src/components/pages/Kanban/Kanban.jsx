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
  const { boards, addColumn, addTask, deleteTaskApi, deleteColumnApi, updateColumnApi, updateTaskApi, updateColumnPositionApi, updateTaskPositionApi } = UseBoardsContext();
  const { boardId } = useParams();

  useEffect(() => {
    const board = boards?.find((b) => b.id === boardId);
    if (board) {
      setColumns(board?.columns || []);
      const allTasks = board?.columns?.flatMap((column) => column.tasks) || [];
      setTasks(allTasks);
    }
  }, [boards, boardId]);

  console.log("columns:", columns);
  console.log("tasks:", tasks);

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setBoardState({
        ...boardState,
        title: board.title,
        backgroundImage: board.background_image,
      });
    }
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
        <div className="relative z-10 flex flex-col h-full min-h-[81.5vh]">
          <BoardNavbar savedBoards={savedBoards} />
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
                <button
                  onClick={generateNewColumns}
                  className="min-w-[220px] h-[48px] flex items-center gap-2 px-4 bg-black bg-opacity-30 hover:bg-opacity-50 text-gray-100 border-2 border-dashed border-white/30 rounded-2xl font-medium shadow-md transition"
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
      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
      // Update positions on the backend after moving
      updateColumnPosition(newColumns);
      return newColumns;
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
  const isOverAColumn = over.data.current?.type === "Column";

  if (!isActiveTask) return;

  setTasks((prevTasks) => {
    const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
    if (activeIndex === -1) return prevTasks;

    const activeTask = prevTasks[activeIndex];
    let newColumnId = activeTask.columnId;
    let newPosition = activeTask.position;

    // Handle moving to a new column
    if (isOverAColumn) {
      newColumnId = overId;
      newPosition = 0; // Default to first position in new column
    } 
    // Handle reordering within the same column or moving to another column's task
    else if (isOverATask) {
      const overTask = prevTasks.find((task) => task.id === overId);
      if (!overTask) return prevTasks;

      newColumnId = overTask.columnId;
      const overIndex = prevTasks.findIndex((task) => task.id === overId);
      newPosition = overIndex;
    }

    // Don't update if nothing changed
    if (newColumnId === activeTask.columnId && newPosition === activeTask.position) {
      return prevTasks;
    }

    // Create updated task
    const movedTask = {
      ...activeTask,
      columnId: newColumnId,
      position: newPosition
    };

    // Create new tasks array with updated task
    const updatedTasks = [...prevTasks];
    updatedTasks[activeIndex] = movedTask;

    // Sort tasks by position for proper rendering
    updatedTasks.sort((a, b) => a.position - b.position);

    // Call updateTaskPosition with the moved task and new column ID
    updateTaskPosition([movedTask], newColumnId);

    return updatedTasks;
  });
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

  async function updateColumnPosition(updatedColumns) {
    await updateColumnPositionApi(updatedColumns, boardId);
  }

async function updateTaskPosition(taskUpdates, columnId) {
  try {
    const response = await updateTaskPositionApi(taskUpdates, columnId);
    console.log("Task position updated successfully:", response);
  } catch (error) {
    console.error("Failed to update task position:", error);
    // Optionally revert the UI change here
  }
}
}

export default Kanban;
