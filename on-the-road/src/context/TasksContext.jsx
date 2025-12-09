import { createContext, useState, useEffect } from "react";
import {
  loadTasks,
  addTaskToDB,
  deleteTaskFromDB,
  updateTaskStatus
} from "../firebase";

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Încarcă task-urile din Firestore la pornirea aplicației
  useEffect(() => {
    async function fetchData() {
      const data = await loadTasks();
      setTasks(data);
    }
    fetchData();
  }, []);

  // Adaugă un task
  const addTask = async (task) => {
    const id = await addTaskToDB(task); // salvăm în Firestore
    setTasks((prev) => [...prev, { ...task, id }]);
  };

  // Șterge un task
  const deleteTask = async (id) => {
    await deleteTaskFromDB(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Actualizează statusul unui task
  const updateStatus = async (id, newStatus) => {
    await updateTaskStatus(id, newStatus);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        updateStatus
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
