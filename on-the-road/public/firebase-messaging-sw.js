/* global firebase, importScripts */

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC75vAqz6yRHpobYnXBE0z1OnUuMDKo5CQ",
  authDomain: "lista-activitati-sopm.firebaseapp.com",
  projectId: "lista-activitati-sopm",
  storageBucket: "lista-activitati-sopm.firebasestorage.app",
  messagingSenderId: "672562658046",
  appId: "1:672562658046:web:7086471b2f847b3293c3af"
});

const messaging = firebase.messaging();

// Notificări când aplicația e închisă / tab-ul nu e activ
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
