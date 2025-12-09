import { useEffect, useContext } from "react";
import { TasksContext } from "../context/TasksContext";

export default function useLocalReminders() {
  const { tasks } = useContext(TasksContext);

  useEffect(() => {
    console.log("🔔 useLocalReminders: pornit");
    console.log("📌 Tasks primite în hook:", tasks);

    // verificare suport browser
    if (typeof window === "undefined") {
      console.log("❌ Not in browser");
      return;
    }

    if (!("Notification" in window)) {
      console.log("❌ Browser NU suportă Notification API");
      return;
    }

    console.log("ℹ Browser suportă notificări: DA");

    // cerem permisiune
    console.log("ℹ Permisiune notificări:", Notification.permission);

    if (Notification.permission === "default") {
      console.log("🔄 Cer permisiune utilizatorului…");
      Notification.requestPermission().then((perm) => {
        console.log("🔍 Rezultat permisiune:", perm);
      });
    }

    if (Notification.permission !== "granted") {
      console.log("❌ Permisiune NEACORDATĂ → ies");
      return;
    }

    const now = Date.now();
    const timeouts = [];

    tasks.forEach((task) => {
      console.log("➡ Verific task:", task);

      if (!task.date) {
        console.log("⚠ Ignorat (fără dată):", task.title);
        return;
      }

      if (task.status !== "upcoming") {
        console.log("⚠ Ignorat (nu e upcoming):", task.title);
        return;
      }

      const time = new Date(task.date).getTime();
      if (Number.isNaN(time)) {
        console.log("⚠ Dată invalidă:", task.date);
        return;
      }

      const diff = time - now;
      console.log(`⏱ Diferență timp pentru "${task.title}":`, diff, "ms");

      if (diff <= 0) {
        console.log("⚠ Ignorat (în trecut):", task.title);
        return;
      }

      if (diff > 7 * 24 * 60 * 60 * 1000) {
        console.log("⚠ Ignorat (prea departe în viitor):", task.title);
        return;
      }

      console.log("⏳ Programez reminder pentru:", task.title);

      const timeoutId = setTimeout(() => {
        console.log("🔔 Trimit notificare pentru:", task.title);

        try {
          new Notification("Reminder activitate", {
            body:
              (task.title || "Activitate") +
              (task.description ? `\n${task.description}` : ""),
          });
        } catch (e) {
          console.log("❌ Eroare la notificare, folosesc alert()");
          alert(
            `Reminder activitate:\n${task.title}${
              task.description ? "\n" + task.description : ""
            }`
          );
        }
      }, diff);

      timeouts.push(timeoutId);
    });

    console.log("✅ Notificări programate:", timeouts.length);

    return () => {
      console.log("♻ Curăț timeout-urile");
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [tasks]);
}
