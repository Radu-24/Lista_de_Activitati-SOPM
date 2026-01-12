import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { TasksContext } from "../context/TasksContext";

export default function TaskItem({ task }) {
  const { deleteTask, updateStatus } = useContext(TasksContext);
  const [modalVisible, setModalVisible] = useState(false);

  const statusLabel = useMemo(() => {
    const map = { overdue: "Restant", upcoming: "Urmează", completed: "Complet", canceled: "Anulat" };
    return map[task.status] ?? task.status;
  }, [task.status]);

  const priorityLabel = useMemo(() => {
    const map = { 1: "Importantă", 2: "Mediu", 3: "Scăzută" };
    return map[task.priority] ?? "Mediu";
  }, [task.priority]);

  // Am eliminat categoryInfo și categoryLabel

  const formattedDate = useMemo(() => {
    if (!task.date) return "—";
    const d = new Date(task.date);
    if (isNaN(d.getTime())) return task.date;
    return d.toLocaleDateString("ro-RO") + " " + d.toLocaleTimeString("ro-RO", { hour: '2-digit', minute: '2-digit' });
  }, [task.date]);

  const handleStatusChange = (newStatus) => {
    updateStatus(task.id, newStatus);
    setModalVisible(false);
  };

  const confirmDelete = () => {
    Alert.alert("Șterge activitate", "Sigur vrei să ștergi?", [
      { text: "Nu", style: "cancel" },
      { text: "Da", onPress: () => deleteTask(task.id), style: "destructive" },
    ]);
  };

  const getBorderColor = () => {
    switch (task.status) {
      case "overdue": return "#ef4444";
      case "completed": return "#10b981";
      case "canceled": return "#9ca3af";
      default: return "#3b82f6";
    }
  };

  return (
    <>
      <View style={[styles.card, { borderLeftColor: getBorderColor() }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            
            {/* Titlu simplu */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{task.title}</Text>
            </View>
            
            {/* Rândul cu Badge-uri (Status, Prioritate, Preț) */}
            <View style={styles.badgesRow}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={[styles.badge, styles.statusBadge]}>{statusLabel} ▾</Text>
              </TouchableOpacity>
              
              <Text style={[styles.badge, styles.priorityBadge]}>{priorityLabel}</Text>

              {/* Badge Preț (Dacă există) */}
              {task.price > 0 && (
                <Text style={[styles.badge, styles.priceBadge]}>
                  {task.price} RON
                </Text>
              )}
            </View>
          </View>
        </View>

        {task.description ? <Text style={styles.description}>{task.description}</Text> : null}

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>📅 {formattedDate}</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={styles.deleteText}>Șterge</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- MODAL STATUS --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schimbă statusul</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleStatusChange("overdue")}>
              <Text style={[styles.optionText, { color: "#ef4444" }]}>Restant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleStatusChange("upcoming")}>
              <Text style={[styles.optionText, { color: "#3b82f6" }]}>Urmează</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleStatusChange("completed")}>
              <Text style={[styles.optionText, { color: "#10b981" }]}>Complet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleStatusChange("canceled")}>
              <Text style={[styles.optionText, { color: "#6b7280" }]}>Anulat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, styles.cancelOption]} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Renunță</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  badgesRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, fontSize: 12, fontWeight: "600", overflow: "hidden" },
  statusBadge: { backgroundColor: "#e0f2fe", color: "#0369a1" },
  priorityBadge: { backgroundColor: "#f3f4f6", color: "#4b5563" },
  priceBadge: { backgroundColor: "#dcfce7", color: "#166534", borderWidth: 1, borderColor: "#bbf7d0" },
  description: { fontSize: 14, color: "#4b5563", marginBottom: 12, lineHeight: 20 },
  metaContainer: { flexDirection: "row", marginBottom: 12 },
  metaText: { fontSize: 13, color: "#6b7280", marginRight: 16 },
  footer: { flexDirection: "row", justifyContent: "flex-end", borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 12 },
  deleteButton: { backgroundColor: "#fee2e2", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  deleteText: { color: "#991b1b", fontSize: 13, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", width: "80%", borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  optionButton: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  optionText: { fontSize: 16, textAlign: "center", fontWeight: "600" },
  cancelOption: { borderBottomWidth: 0, marginTop: 10 },
  cancelText: { fontSize: 16, textAlign: "center", color: "#ef4444", fontWeight: "bold" },
});