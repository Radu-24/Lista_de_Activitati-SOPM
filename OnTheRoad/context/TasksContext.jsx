// src/context/TasksContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { Alert } from "react-native"; // Import Nativ
import {
  loadTasks,
  addTaskToDB,
  deleteTaskFromDB,
  updateTaskStatus,
} from "../firebase"; // Ajustează calea dacă e nevoie

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadTasks();
        setTasks(data);
      } catch (error) {
        console.error("Eroare la încărcarea task-urilor:", error);
        Alert.alert("Eroare", "Nu am putut încărca task-urile.");
      }
    }
    fetchData();
  }, []);

  const addTask = useCallback(async (task) => {
    // Adăugăm un try-catch și aici pentru siguranță
    try {
      const finalTask = { ...task, status: task.status ?? "upcoming" };
      const id = await addTaskToDB(finalTask);
      setTasks((prev) => [...prev, { ...finalTask, id }]);
    } catch (error) {
      Alert.alert("Eroare", "Nu am putut adăuga task-ul.");
      console.error(error);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    // optimist update
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTaskFromDB(id);
    } catch (err) {
      console.error("deleteTaskFromDB failed:", err);
      setTasks(prevTasks); // rollback
      Alert.alert("Eroare", "Ștergerea a eșuat. Restaurăm lista.");
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
      // 3) rollback
      if (before) setTasks(before);
      Alert.alert("Eroare", "Nu pot salva statusul. Verifică conexiunea.");
    }
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask, updateStatus }}>
      {children}
    </TasksContext.Provider>
  );
}