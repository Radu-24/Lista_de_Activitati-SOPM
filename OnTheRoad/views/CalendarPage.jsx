import React, { useContext, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TasksContext } from "../context/TasksContext";
import { ThemeContext } from "../context/ThemeContext";
import TaskList from "../components/TaskList";

// Helper pentru compararea datelor
function isSameDay(dateA, dateB) {
  if (!dateA || !dateB) return false;
  const dA = new Date(dateA);
  const dB = new Date(dateB);
  return (
    dA.getFullYear() === dB.getFullYear() &&
    dA.getMonth() === dB.getMonth() &&
    dA.getDate() === dB.getDate()
  );
}

export default function CalendarPage() {
  const { tasks } = useContext(TasksContext);
  const { theme, isDarkMode } = useContext(ThemeContext); // Accesăm tema curentă

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Calcule calendaristice
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Luni start

  const emptyDays = Array(startOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...emptyDays, ...days];

  // Filtrare task-uri pentru ziua selectată
  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((t) => isSameDay(t.date, selectedDate));
  }, [tasks, selectedDate]);

  // Schimbare lună
  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    // SafeAreaView aplică culoarea de fundal corectă (Dark/Light)
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView style={{ flex: 1 }}>
        
        {/* HEADER CALENDAR */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            {new Date(year, month).toLocaleString("ro-RO", { month: "long", year: "numeric" })}
          </Text>

          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ZILELE SĂPTĂMÂNII */}
        <View style={[
          styles.weekRow, 
          { borderBottomColor: isDarkMode ? '#334155' : '#e5e7eb' }
        ]}>
          {["L", "Ma", "Mi", "J", "V", "S", "D"].map((d) => (
            <Text key={d} style={[styles.dayName, { color: theme.subtext }]}>{d}</Text>
          ))}
        </View>

        {/* GRID ZILE */}
        <View style={styles.grid}>
          {allDays.map((day, i) => {
            if (day === null) {
              return <View key={i} style={styles.cell} />;
            }

            const cellDate = new Date(year, month, day);
            const isToday = isSameDay(cellDate, today);
            const isSelected = isSameDay(cellDate, selectedDate);
            
            // Numărăm task-urile
            const dayTasksCount = tasks.filter((t) => isSameDay(t.date, cellDate)).length;

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.cell,
                  // Bordură pentru "Azi"
                  isToday && { 
                    borderWidth: 1, 
                    borderColor: '#3b82f6', 
                    borderRadius: 8 
                  },
                  // Fundal pentru "Selectat"
                  isSelected && { 
                    backgroundColor: '#3b82f6', 
                    borderRadius: 8,
                    borderWidth: 0 // Scoatem bordura dacă e selectat
                  },
                ]}
                onPress={() => setSelectedDate(cellDate)}
              >
                <Text style={[
                  styles.cellText,
                  { color: theme.text }, // Culoare text dinamică
                  isSelected && { color: '#fff', fontWeight: 'bold' } // Alb pe selecție
                ]}>{day}</Text>
                
                {/* INDICATORI (Puncte sau Număr) */}
                <View style={styles.indicatorsContainer}>
                  {dayTasksCount > 3 ? (
                     // Cazul > 3: Afișăm numărul
                     <Text style={[
                       styles.countText, 
                       isSelected && { color: '#fff' }
                     ]}>
                       {dayTasksCount}
                     </Text>
                  ) : (
                     // Cazul 1-3: Afișăm puncte
                     Array.from({ length: dayTasksCount }).map((_, idx) => (
                       <View 
                         key={idx} 
                         style={[
                           styles.dot, 
                           { backgroundColor: isSelected ? '#fff' : '#3b82f6' }
                         ]} 
                       />
                     ))
                  )}
                </View>

              </TouchableOpacity>
            );
          })}
        </View>

        {/* LISTA DE JOS */}
        {selectedDate && (
          <View style={[
            styles.tasksContainer, 
            { borderTopColor: isDarkMode ? '#334155' : '#f3f4f6' }
          ]}>
            <Text style={[styles.tasksHeader, { color: theme.text }]}>
              Activități: {selectedDate.toLocaleDateString("ro-RO")}
            </Text>
            
            {tasksForSelectedDay.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Nicio activitate în această zi.
              </Text>
            ) : (
              <TaskList tasks={tasksForSelectedDay} />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header Navigare
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  monthTitle: { fontSize: 18, fontWeight: "bold", textTransform: "capitalize" },
  navBtn: { padding: 10 },
  navText: { fontSize: 24, fontWeight: "bold", color: "#3b82f6" },
  
  // Zilele Săptămânii
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  dayName: {
    width: "14.28%", 
    textAlign: "center",
    fontWeight: "600",
  },
  
  // Grid Calendar
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    aspectRatio: 1, 
    justifyContent: "flex-start", // Textul urcă sus
    alignItems: "center",
    marginVertical: 2,
    paddingTop: 8, // Spațiu sus pentru text
  },
  cellText: { fontSize: 16 },
  
  // Container Indicatori - MĂRIT pt vizibilitate
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    height: 16, // Înălțime suficientă pentru numere
    marginTop: 4, 
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3b82f6',
  },

  // Lista de jos
  tasksContainer: {
    padding: 16,
    borderTopWidth: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  tasksHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  emptyText: { fontStyle: "italic" },
});