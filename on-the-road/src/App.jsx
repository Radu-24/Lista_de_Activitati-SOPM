import AppShell from "./components/layout/AppShell";
import { TasksProvider } from "./context/TasksContext";
import useNotifications from "./hooks/useNotifications";
import useLocalReminders from "./hooks/useLocalReminders";

export default function App() {
  return (
    <TasksProvider>
      <AppWithHooks />
    </TasksProvider>
  );
}

// Componentă internă care are acces la TasksContext
function AppWithHooks() {
  // FCM-ul tău existent (pentru push din Firebase)
  useNotifications();

  // Notificări locale simple, programate în browser
  useLocalReminders();

  return <AppShell />;
}
