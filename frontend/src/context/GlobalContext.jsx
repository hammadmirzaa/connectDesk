import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const UseGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [boardState, setBoardState] = useState({
    title: "My Kanban Board",
    backgroundImage:
      "https://images.unsplash.com/photo-1498079022511-d15614cb1c02",
    tasks: {},
    columns: {},
  });

  const [savedBoards, setSavedBoards] = useState([]);

  const saveBoardState = (columns, tasks) => {
    const newBoard = {
      id: Date.now(),
      title: boardState.title,
      selectedBg: boardState.selectedBg,
      columns,
      tasks,
    };
    setSavedBoards((prev) => [...prev, newBoard]);
    console.log("✅ Board saved:", newBoard);
  };
  return (
    <GlobalContext.Provider
      value={{
        showBoardForm,
        setShowBoardForm,
        boardState,
        setBoardState,
        saveBoardState,
        savedBoards,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
