import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
const BoardsContext = createContext();
export const UseBoardsContext = () => useContext(BoardsContext);

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
const apiUrl = process.env.REACT_APP_API_URL;
console.log("API URL:", process.env.REACT_APP_API_URL);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      loadBoards();
    }
    console.log("token:", token);
  }, []);

  const loadBoards = async () => {
  const token = Cookies.get("access_token");
    try {
      const res = await fetch(`${apiUrl}/api/boards/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setBoards(data);
    } catch (error) {
      console.error("Error loading boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveBoard = async (board) => {
  const token = Cookies.get("access_token");

    const isUpdate = !!board.id;
    const url = `${apiUrl}/api/boards/${
      isUpdate ? board.id + "/" : ""
    }`;

    try {
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        body: JSON.stringify(board),
      });

      const savedBoard = await res.json();

      if (isUpdate) {
        setBoards((prev) =>
          prev.map((b) => (b.id === savedBoard.id ? savedBoard : b))
        );
      } else {
        setBoards((prev) => [...prev, savedBoard]);
      }
      loadBoards()
      return savedBoard;
    } catch (error) {
      console.error("Error saving board:", error);
    }
  };

  const addColumn = async (column) => {
  const token = Cookies.get("access_token");

    try {
      const res = await fetch(`${apiUrl}/api/columns/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        body: JSON.stringify(column),
      });
      const newColumn = await res.json();
      loadBoards();
      return newColumn;
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const updateColumnApi = async (column) => {
  const token = Cookies.get("access_token");

    try {
      const res = await fetch(
        `${apiUrl}/api/columns/${column.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
            Accept: "application/json",
          },
          body: JSON.stringify(column),
        }
      );
      const updatedColumn = await res.json();
      await loadBoards();
      return updatedColumn;
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  const updateTaskApi = async (task) => {
  const token = Cookies.get("access_token");

    try {
      const res = await fetch(`${apiUrl}/api/tasks/${task.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        body: JSON.stringify(task),
      });
      const updatedTask = await res.json();
      await loadBoards();
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteColumnApi = async (columnId) => {
    try {
      await fetch(`${apiUrl}/api/columns/${columnId}/`, {
        method: "DELETE",
      });
      await loadBoards();
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const addTask = async (task) => {
  const token = Cookies.get("access_token");

    try {
      const res = await fetch(`${apiUrl}/api/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      loadBoards();
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

const deleteTaskApi = async (taskId) => {
  try {

    const response = await fetch(`${apiUrl}/api/tasks/${taskId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete task");
    }

    loadBoards();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

  useEffect(() => {
    if (token) {
      loadBoards();
    }
  }, [token]);

    const updateColumnPositionApi = async (columns, boardId) => {
    const response = await fetch(`${apiUrl}/api/boards/${boardId}/update-column-positions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positions: columns.map((col, index) => ({ column_id: col.id, position: index })) }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update column positions');
  };

async function updateTaskPositionApi(updatedTasks, columnId) {
  try {
    const payload = {
      positions: updatedTasks.map(task => ({
        task_id: task.id,
        position: task.position,
        column_id: task.columnId || columnId 
      }))
    };

    console.log("Sending task update:", payload);
    
    const response = await fetch(`${apiUrl}/api/columns/${columnId}/update-task-positions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task positions');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task positions:", error);
    // Optionally revert the UI change here
    throw error;
  }
}

const handleRemoveMember = async (boardId, userId) => {
  console.log("Removing member:", userId);
  try {
    const response = await fetch(`${apiUrl}/api/boards/${boardId}/remove-member/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Failed to remove member");
    }

    loadBoards(); 
  } catch (error) {
    console.error("Remove member error:", error.message);
  }
};



  return (
    <BoardsContext.Provider
      value={{
        boards,
        setBoards,
        loadBoards,
        saveBoard,
        loading,
        addColumn,
        deleteColumnApi,
        addTask,
        deleteTaskApi,
        updateTaskApi,
        updateColumnApi,
        token,
        updateColumnPositionApi,
        updateTaskPositionApi,
        handleRemoveMember
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
