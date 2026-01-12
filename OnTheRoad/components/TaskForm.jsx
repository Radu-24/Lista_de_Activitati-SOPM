import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TasksContext } from "../context/TasksContext";

export default function TaskForm() {
  const { addTask } = useContext(TasksContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "2",
    status: "upcoming",
    price: "",
  });
  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date");

  const handleSubmit = () => {
    if (!form.title.trim()) {
      Alert.alert("Eroare", "Titlul este obligatoriu!");
      return;
    }

    const simpleId = Date.now().toString() + Math.random().toString(36).slice(2);

    addTask({
      id: simpleId, 
      title: form.title,
      description: form.description,
      date: date.toISOString(),
      status: form.status,
      priority: Number(form.priority),
      price: form.price ? Number(form.price) : 0,
    });

    setForm({ title: "", description: "", priority: "2", status: "upcoming", price: "" });
    setDate(new Date());
    Alert.alert("Succes", "Activitate salvată!");
  };

  const onDateChange = (event, selectedDate) => {
    // Dacă utilizatorul dă Cancel (valabil Android/iOS modal)
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    const currentDate = selectedDate || date;
    
    // LOGICĂ SPECIALĂ:
    if (Platform.OS === 'android') {
      // Android: Trebuie să închidem și să redeschidem pentru Oră
      setShowDatePicker(false);
      setDate(currentDate);
      if (mode === 'date') {
        setMode('time');
        // Mic delay ca să nu se suprapună animațiile
        setTimeout(() => setShowDatePicker(true), 100);
      } else {
        setMode('date'); // Reset pentru data viitoare
      }
    } else {
      // iOS: Suportă "datetime" nativ, deci doar salvăm și închidem
      setShowDatePicker(false);
      setDate(currentDate);
    }
  };

  const showPicker = () => {
    setMode("date");
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Activitate Nouă</Text>
      
      {/* TITLU */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Titlu</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Revizie mașină..."
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
        />
      </View>

      {/* DESCRIERE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descriere</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalii suplimentare..."
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* COST */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cost Estimat (RON)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          keyboardType="numeric"
          value={form.price}
          onChangeText={(text) => setForm({ ...form, price: text })}
        />
      </View>

      {/* DATA & PRIORITATE */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Data & Ora</Text>
          <TouchableOpacity style={styles.dateButton} onPress={showPicker}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString("ro-RO")} {date.toLocaleTimeString("ro-RO", { hour: '2-digit', minute: '2-digit'})}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              // iOS primește "datetime" direct. Android primește ce e în state (date sau time).
              mode={Platform.OS === 'ios' ? 'datetime' : mode}
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Prioritate</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.priority}
              onValueChange={(val) => setForm({ ...form, priority: val })}
              style={styles.picker}
            >
              <Picker.Item label="Importantă" value="1" />
              <Picker.Item label="Mediu" value="2" />
              <Picker.Item label="Scăzută" value="3" />
            </Picker>
          </View>
        </View>
      </View>

      {/* STATUS */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.status}
            onValueChange={(val) => setForm({ ...form, status: val })}
            style={styles.picker}
          >
            <Picker.Item label="Urmează" value="upcoming" />
            <Picker.Item label="Complet" value="completed" />
            <Picker.Item label="Restant" value="overdue" />
            <Picker.Item label="Anulat" value="canceled" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Salvează Activitatea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05, // Shadow funcționează nativ pe iOS
    shadowRadius: 5,
    elevation: 2,       // Elevation pentru Android
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111", marginBottom: 15 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f9fafb" },
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  dateButton: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, backgroundColor: "#f9fafb", alignItems: "center" },
  dateText: { fontSize: 14, color: "#111" },
  pickerContainer: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, backgroundColor: "#f9fafb", height: 50, justifyContent: 'center' },
  picker: { height: 50, width: "100%" },
  saveButton: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});