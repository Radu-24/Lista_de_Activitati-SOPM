import React, { useContext } from "react";
import { Platform, View } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Context
import { TasksProvider } from "./context/TasksContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext"; 

// Views
import HomePage from "./views/HomePage";
import TasksPage from "./views/TasksPage";
import CalendarPage from "./views/CalendarPage";

const Tab = createBottomTabNavigator();

function AppTabs() {
  const insets = useSafeAreaInsets();
  // 1. Accesăm tema curentă
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Culorile iconițelor (Albastru activ, Gri inactiv)
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: isDarkMode ? "#94a3b8" : "gray", // Gri mai deschis pe dark mode
        tabBarStyle: { 
          // 2. Înălțime dinamică (calculată corect anterior)
          height: 60 + (insets.bottom > 0 ? insets.bottom : 20), 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10, 
          
          // 3. CULORI DINAMICE (Aici e fix-ul)
          backgroundColor: theme.card, // Devine #1e293b pe Dark Mode
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#334155' : '#f3f4f6', // Bordură subtilă pe Dark
          
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Acasă") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Activități") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Acasă" component={HomePage} />
      <Tab.Screen name="Activități" component={TasksPage} />
      <Tab.Screen name="Calendar" component={CalendarPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TasksProvider>
          {/* Putem pasa și tema nativă pentru tranziții corecte */}
          <NavigationContainer>
            <AppTabs />
          </NavigationContainer>
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}