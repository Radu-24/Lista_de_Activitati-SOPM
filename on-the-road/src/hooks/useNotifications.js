import { useEffect } from "react";
import { requestPushPermission, onForegroundNotification } from "../firebase";

export default function useNotifications() {
  useEffect(() => {
    let unsubscribe;

    async function init() {
      try {
        // 1. Cerem permisiune și obținem tokenul FCM
        const token = await requestPushPermission();

        if (token) {
          console.log("Token FCM (salvează-l ca să trimiți notificări):", token);
          // Aici, în mod normal, trimiți tokenul la backend-ul tău:
          // await fetch("/api/save-fcm-token", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ token }),
          // });
        } else {
          console.warn("Nu s-a obținut token FCM (utilizatorul a refuzat sau browserul nu suportă).");
        }

        // 2. Listener pentru notificările primite cât timp aplicația este în foreground
        unsubscribe = onForegroundNotification((payload) => {
          if (!payload || !payload.notification) return;

          const { title, body } = payload.notification;

          // Dacă browserul permite Notification API și permisiunea este 'granted'
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title || "Reminder activitate", {
              body: body || "",
              icon: "/icon.png", // opțional, dacă ai un icon
            });
          } else {
            // fallback simplu dacă nu avem permisiune / suport
            alert(`${title || "Reminder activitate"}\n${body || ""}`);
          }
        });
      } catch (err) {
        console.error("Eroare la inițializarea notificărilor:", err);
      }
    }

    init();

    // Cleanup: dezabonăm listener-ul când componenta se demontează
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);
}
