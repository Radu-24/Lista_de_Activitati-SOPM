import { createContext, useState, useEffect, useCallback } from "react";
import {
  loadTasks,
  addTaskToDB,
  deleteTaskFromDB,
  updateTaskStatus,
} from "../firebase";

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadTasks();
      setTasks(data);
    }
    fetchData();
  }, []);

  const addTask = useCallback(async (task) => {
    const finalTask = { ...task, status: task.status ?? "upcoming" };
    const id = await addTaskToDB(finalTask);
    setTasks((prev) => [...prev, { ...finalTask, id }]);
  }, []);

  const deleteTask = useCallback(async (id) => {
    // optimist
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTaskFromDB(id);
    } catch (err) {
      console.error("deleteTaskFromDB failed:", err);
      setTasks(prevTasks); // rollback
    }
  }, [tasks]);

  const updateStatus = useCallback(async (id, newStatus) => {
    // 1) Update UI imediat (optimist)
    let before;
    setTasks((prev) => {
      before = prev;
      return prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    });

    // 2) Persistă în Firestore
    try {
      await updateTaskStatus(id, newStatus);
    } catch (err) {
      console.error("updateTaskStatus failed:", err);
      // 3) rollback dacă Firestore a eșuat
      if (before) setTasks(before);
      alert("Nu pot salva statusul (Firestore). Verifică Rules/permisiuni.");
    }
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, updateStatus }}>
      {children}
    </TasksContext.Provider>
  );
}
