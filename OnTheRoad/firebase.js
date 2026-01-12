// firebase.js (Versiunea React Native)
import { initializeApp } from "firebase/app";
// ATENȚIE: Am scos getMessaging și getToken - nu funcționează așa pe mobil
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// Config Firebase (Rămâne la fel)
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

// Firestore (Funcționează perfect cu SDK-ul JS)
export const db = getFirestore(app);

/* ================================
   NOTIFICĂRI - ELIMINAT TEMPORAR
================================ */
// API-ul de Web Messaging (Service Workers) nu există în React Native.
// Vom înlocui această secțiune în Pasul 3 cu `expo-notifications`.

/* ================================
   FIRESTORE – CRUD (Neschimbat)
================================ */

// 1️⃣ Load tasks
export async function loadTasks() {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// 2️⃣ Add task
export async function addTaskToDB(task) {
  const { id, ...cleanTask } = task;
  const ref = await addDoc(collection(db, "tasks"), cleanTask);
  return ref.id;
}

// 3️⃣ Delete task
export async function deleteTaskFromDB(id) {
  await deleteDoc(doc(db, "tasks", id));
}

// 4️⃣ Update status
export async function updateTaskStatus(id, status) {
  await updateDoc(doc(db, "tasks", id), { status });
}