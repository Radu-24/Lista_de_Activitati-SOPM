import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Pt iconița Lună/Soare

import { TasksContext } from "../context/TasksContext";
import { ThemeContext } from "../context/ThemeContext"; // 1. Import Context Temă

export default function HomePage() {
  const { tasks } = useContext(TasksContext);
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext); // 2. Extragem tema
  const navigation = useNavigation();

  const stats = useMemo(() => {
    const totalCost = tasks.reduce((sum, t) => {
      const price = Number(t.price); 
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return {
      total: tasks.length,
      upcoming: tasks.filter((t) => t.status === "upcoming").length,
      overdue: tasks.filter((t) => t.status === "overdue").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      canceled: tasks.filter((t) => t.status === "canceled").length,
      totalCost: totalCost,
    };
  }, [tasks]);

  const handleStatPress = (filterType) => {
    navigation.navigate("Activități", { statusFilter: filterType });
  };

  return (
    // 3. Aplicăm culoarea de fundal dinamică
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* HEADER CU BUTON DARK MODE */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>OnTheRoad</Text>
            <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>Jurnalul mașinii tale</Text>
          </View>
          
          {/* Buton Toggle */}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={theme.iconColor} 
            />
          </TouchableOpacity>
        </View>

        {/* CARD BUGET */}
        <View style={[styles.card, { backgroundColor: theme.budgetCard }]}>
          <Text style={styles.budgetLabel}>Costuri Estimate (Total)</Text>
          <Text style={styles.budgetValue}>{stats.totalCost} RON</Text>
          <Text style={styles.budgetNote}>Calculat pe baza activităților adăugate</Text>
        </View>

        {/* CARD STATISTICI */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Statistici Activități</Text>
          <Text style={[styles.cardSubtitle, { color: theme.subtext }]}>Apasă pe o căsuță pentru detalii</Text>
          
          <View style={styles.statsGrid}>
            <StatBox 
              label="Urmează" 
              value={stats.upcoming} 
              color="#3b82f6" 
              bg={isDarkMode ? "rgba(59, 130, 246, 0.15)" : "#eff6ff"} // Ajustare fină pt dark mode
              textColor={theme.text}
              onPress={() => handleStatPress('upcoming')}
            />
            <StatBox 
              label="Restante" 
              value={stats.overdue} 
              color="#ef4444" 
              bg={isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#fef2f2"}
              textColor={theme.text}
              onPress={() => handleStatPress('overdue')}
            />
            <StatBox 
              label="Complet" 
              value={stats.completed} 
              color="#10b981" 
              bg={isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5"}
              textColor={theme.text}
              onPress={() => handleStatPress('completed')}
            />
            <StatBox 
              label="Anulate" 
              value={stats.canceled} 
              color="#6b7280" 
              bg={isDarkMode ? "rgba(107, 114, 128, 0.15)" : "#f3f4f6"}
              textColor={theme.text}
              onPress={() => handleStatPress('canceled')}
            />
          </View>

          <View style={[styles.totalRow, { borderTopColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
            <Text style={[styles.totalLabel, { color: theme.subtext }]}>Total Intrări</Text>
            <Text style={[styles.totalValue, { color: theme.text }]}>{stats.total}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componenta StatBox primește acum textColor dinamic
function StatBox({ label, value, color, bg, textColor, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.statBox, { backgroundColor: bg }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  
  // Header nou flexibil
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  headerSubtitle: { fontSize: 16 },
  themeButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(150,150,150, 0.1)', // Cerc subtil în spate
  },

  card: { borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  
  budgetLabel: { color: "#94a3b8", fontSize: 14, fontWeight: "600", textTransform: "uppercase" },
  budgetValue: { color: "#4ade80", fontSize: 36, fontWeight: "bold", marginVertical: 8 },
  budgetNote: { color: "#64748b", fontSize: 12, fontStyle: "italic" },
  
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 16 },
  
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 },
  statBox: { width: "48%", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 14, fontWeight: "600" },
  
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 16, borderTopWidth: 1 },
  totalLabel: { fontSize: 16, fontWeight: "600" },
  totalValue: { fontSize: 18, fontWeight: "bold" },
});