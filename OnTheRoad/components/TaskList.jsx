import React, { useContext, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TasksContext } from "../context/TasksContext";
import TaskItem from "./TaskItem";

// 1. Primim prop-ul 'filter'
export default function TaskList({ tasks: tasksProp, filter }) {
  const { tasks: contextTasks } = useContext(TasksContext);

  const tasks = tasksProp ?? contextTasks;

  const groups = useMemo(() => {
    const g = {
      overdue: [],
      upcoming: [],
      completed: [],
      canceled: [],
    };
    for (const t of tasks) {
      if (g[t.status]) g[t.status].push(t);
    }
    return g;
  }, [tasks]);

  // Logica de "Empty State" (modificată să țină cont de filtru)
  const isEmpty = !tasks || !tasks.length;
  // Dacă avem filtru, verificăm doar grupul respectiv. Dacă nu, toate.
  const isFilterEmpty = filter ? groups[filter].length === 0 : Object.values(groups).every(arr => !arr.length);

  if (isEmpty || isFilterEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Nicio activitate</Text>
        <Text style={styles.emptyText}>
          {filter ? "Nu există activități în această categorie." : "Lista este goală."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 2. Randare Condițională bazată pe 'filter' */}
      
      {(!filter || filter === 'overdue') && (
        <TaskSection title="Restante" code="overdue" tasks={groups.overdue} color="#ef4444" />
      )}
      
      {(!filter || filter === 'upcoming') && (
        <TaskSection title="Urmează" code="upcoming" tasks={groups.upcoming} color="#3b82f6" />
      )}
      
      {(!filter || filter === 'completed') && (
        <TaskSection title="Completate" code="completed" tasks={groups.completed} color="#10b981" />
      )}
      
      {(!filter || filter === 'canceled') && (
        <TaskSection title="Anulate" code="canceled" tasks={groups.canceled} color="#9ca3af" />
      )}
    </View>
  );
}

function TaskSection({ title, tasks, color }) {
  if (!tasks || !tasks.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        <View style={[styles.countBadge, { backgroundColor: color }]}>
          <Text style={styles.countText}>{tasks.length}</Text>
        </View>
      </View>

      <View>
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Eliminăm padding-ul de aici că îl are părintele
  },
  emptyContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#374151" },
  emptyText: { color: "#6b7280", marginTop: 8, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginRight: 10 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  countText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});