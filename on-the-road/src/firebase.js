import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC75vAqz6yRHpobYnXBE0z1OnUuMDKo5CQ",
  authDomain: "lista-activitati-sopm.firebaseapp.com",
  projectId: "lista-activitati-sopm",
  storageBucket: "lista-activitati-sopm.firebasestorage.app",
  messagingSenderId: "672562658046",
  appId: "1:672562658046:web:7086471b2f847b3293c3af",
  measurementId: "G-LMT9W3EC8B",
};

// Init Firebase
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Messaging
export const messaging = getMessaging(app);

/* ================================
   NOTIFICĂRI
================================ */
export async function requestPushPermission() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey:
        "BIEmQlvbQjKY8fR-__gUF-EvOOcqTqYa7sVylPgydrF4Df749kZEhLKbEKo5zITpZcQOX5flsMBG9XK1fxiTVJI",
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}

export function onForegroundNotification(callback) {
  onMessage(messaging, (payload) => callback(payload));
}

/* ================================
   FIRESTORE – CRUD CORECT
================================ */

// 1️⃣ Load tasks — ID REAL din Firestore
export async function loadTasks() {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((d) => ({
    id: d.id,        // 🔑 ID DOCUMENT
    ...d.data(),    // ❌ fără câmp id în document
  }));
}

// 2️⃣ Add task — NU salvăm `id` în document
export async function addTaskToDB(task) {
  const { id, ...cleanTask } = task; // 🔥 eliminăm id dacă există
  const ref = await addDoc(collection(db, "tasks"), cleanTask);
  return ref.id;
}

// 3️⃣ Delete task
export async function deleteTaskFromDB(id) {
  await deleteDoc(doc(db, "tasks", id));
}

// 4️⃣ Update status — FUNCȚIONEAZĂ ACUM
export async function updateTaskStatus(id, status) {
  await updateDoc(doc(db, "tasks", id), { status });
}
