import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"; // Pentru fundal complet

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { ThemeContext } from "../context/ThemeContext"; // Import Context

export default function TasksPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme, isDarkMode } = useContext(ThemeContext); // Accesăm tema

  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    if (route.params?.statusFilter) {
      setActiveFilter(route.params.statusFilter);
    }
  }, [route.params]);

  const filterOptions = [
    { key: null, label: "Toate" },
    { key: "upcoming", label: "Urmează" },
    { key: "overdue", label: "Restante" },
    { key: "completed", label: "Complet" },
    { key: "canceled", label: "Anulate" },
  ];

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    navigation.setParams({ statusFilter: null });
  };

  const getActiveStyle = (key) => {
    // Stilurile colorate rămân la fel, dar putem ajusta bordurile pt dark mode
    switch (key) {
      case null: 
        return { container: { backgroundColor: '#2563eb', borderColor: '#2563eb' }, text: { color: '#ffffff' } };
      case "upcoming": 
        return { container: { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', borderColor: '#bfdbfe' }, text: { color: '#3b82f6' } };
      case "overdue": 
        return { container: { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', borderColor: '#fecaca' }, text: { color: '#ef4444' } };
      case "completed": 
        return { container: { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', borderColor: '#a7f3d0' }, text: { color: '#10b981' } };
      case "canceled": 
        return { container: { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', borderColor: '#e5e7eb' }, text: { color: isDarkMode ? '#9ca3af' : '#374151' } };
      default: return { container: {}, text: {} };
    }
  };

  return (
    // Folosim SafeAreaView pt a colora tot ecranul
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* FORMULAR */}
          {activeFilter === null && (
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: theme.text }]}>Adaugă Activitate</Text>
              {/* Notă: TaskForm va rămâne alb (card style) ceea ce e ok pentru contrast */}
              <TaskForm />
            </View>
          )}

          {/* FILTRE */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.key;
                const activeStyle = isActive ? getActiveStyle(option.key) : {};

                return (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.filterChip,
                      // Stil default dinamic (Dark vs Light)
                      { 
                        backgroundColor: theme.card, 
                        borderColor: isDarkMode ? '#334155' : '#e5e7eb' 
                      },
                      isActive && activeStyle.container
                    ]}
                    onPress={() => handleFilterChange(option.key)}
                  >
                    <Text style={[
                      styles.filterText,
                      { color: theme.subtext }, // Text default
                      isActive && [activeStyle.text, { fontWeight: 'bold' }]
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* LISTA */}
          <View style={styles.section}>
            <View style={styles.listHeaderRow}>
              <Text style={[styles.sectionHeader, { color: theme.text }]}>Lista Activităților</Text>
              {activeFilter !== null && (
                 <Text style={styles.filterIndicator}>
                   (Filtru: {filterOptions.find(o => o.key === activeFilter)?.label})
                 </Text>
              )}
            </View>
            <TaskList filter={activeFilter} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: { marginBottom: 24, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, marginRight: 8, elevation: 1,
  },
  filterText: { fontWeight: '600', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 12, marginLeft: 4 },
  listHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  filterIndicator: { marginLeft: 8, color: '#2563eb', fontWeight: '600', fontSize: 14, paddingBottom: 2 }
});