import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

// Configul tău Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC75vAqz6yRHpobYnXBE0z1OnUuMDKo5CQ",
  authDomain: "lista-activitati-sopm.firebaseapp.com",
  projectId: "lista-activitati-sopm",
  storageBucket: "lista-activitati-sopm.firebasestorage.app",
  messagingSenderId: "672562658046",
  appId: "1:672562658046:web:7086471b2f847b3293c3af",
  measurementId: "G-LMT9W3EC8B"
};

// Inițializează Firebase App
export const app = initializeApp(firebaseConfig);

// Inițializează Firestore (baza de date)
export const db = getFirestore(app);

// Inițializează Messaging (notificări push)
export const messaging = getMessaging(app);

// Cere permisiunea pentru notificări și întoarce tokenul FCM
export async function requestPushPermission() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey:
        "BIEmQlvbQjKY8fR-__gUF-EvOOcqTqYa7sVylPgydrF4Df749kZEhLKbEKo5zITpZcQOX5flsMBG9XK1fxiTVJI",
      serviceWorkerRegistration: registration
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}

// Notificări primite când aplicația e deschisă
export function onForegroundNotification(callback) {
  onMessage(messaging, (payload) => callback(payload));
}

// Funcții Firestore (CRUD)

// 1. Citește toate task-urile
export async function loadTasks() {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 2. Adaugă un task
export async function addTaskToDB(task) {
  const ref = await addDoc(collection(db, "tasks"), task);
  return ref.id;
}

// 3. Șterge un task
export async function deleteTaskFromDB(id) {
  await deleteDoc(doc(db, "tasks", id));
}

// 4. Actualizează statusul unui task
export async function updateTaskStatus(id, status) {
  await updateDoc(doc(db, "tasks", id), { status });
}
