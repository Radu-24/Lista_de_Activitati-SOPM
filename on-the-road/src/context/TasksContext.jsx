import { createContext, useState, useEffect, useCallback } from "react";
import {
  loadTasks,
  addTaskToDB,
  deleteTaskFromDB,
  updateTaskStatus,
} from "../firebase";

export const TasksContext = createContext();

function isOverdue(task) {
  if (!task.date) return false;
  if (task.status === "completed" || task.status === "canceled") return false;

  const now = new Date();
  const taskDate = new Date(task.date);

  if (Number.isNaN(taskDate.getTime())) return false;

  return taskDate < now;
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // 🔹 Load initial tasks
  useEffect(() => {
    async function fetchData() {
      const data = await loadTasks();

      // recalculăm overdue la pornire
      const normalized = data.map((task) => {
        if (isOverdue(task)) {
          return { ...task, status: "overdue" };
        }
        return task;
      });

      setTasks(normalized);
    }

    fetchData();
  }, []);

  // 🔹 Revalidează periodic statusul (overdue)
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (isOverdue(task) && task.status !== "overdue") {
            updateTaskStatus(task.id, "overdue");
            return { ...task, status: "overdue" };
          }
          return task;
        })
      );
    }, 60 * 1000); // la fiecare minut

    return () => clearInterval(interval);
  }, []);

  // 🔹 Add task
  const addTask = useCallback(async (task) => {
    const finalTask = {
      ...task,
      status: isOverdue(task) ? "overdue" : task.status ?? "upcoming",
    };

    const id = await addTaskToDB(finalTask);
    setTasks((prev) => [...prev, { ...finalTask, id }]);
  }, []);

  // 🔹 Delete task
  const deleteTask = useCallback(async (id) => {
    await deleteTaskFromDB(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // 🔹 Update status (manual)
  const updateStatus = useCallback(async (id, newStatus) => {
    await updateTaskStatus(id, newStatus);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        updateStatus,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
