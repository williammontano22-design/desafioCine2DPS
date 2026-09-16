import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Pelicula } from "../types/pelicula";

export default function ReservaScreen({ route, navigation }: any) {
  const { pelicula }: { pelicula: Pelicula } = route.params;

  const horariosDisponibles =
    pelicula.horarios && pelicula.horarios.length > 0
      ? pelicula.horarios
      : ["15:00", "18:00", "21:00"];

  const [fecha] = useState("2026-09-20");
  const [horaSeleccionada, setHoraSeleccionada] = useState(
    horariosDisponibles[0],
  );
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const handleSiguiente = () => {
    if (!nombre.trim()) {
      Alert.alert("Validación", "El nombre del cliente es obligatorio.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Validación", "Ingrese un correo electrónico válido.");
      return;
    }

    navigation.navigate("MapaAsientos", {
      pelicula,
      fecha,
      hora: horaSeleccionada,
      cliente: { nombre, email },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{pelicula.nombre}</Text>
      <Text style={styles.sub}>
        {pelicula.salaAsignada} | Precio por entrada: $
        {pelicula.precio.toFixed(2)}
      </Text>

      <Text style={styles.label}>Selecciona la Hora de la Función:</Text>
      <View style={styles.horariosGrid}>
        {horariosDisponibles.map((h) => (
          <TouchableOpacity
            key={h}
            style={[
              styles.horaBtn,
              horaSeleccionada === h && styles.horaBtnActiva,
            ]}
            onPress={() => setHoraSeleccionada(h)}
          >
            <Text
              style={[
                styles.horaTexto,
                horaSeleccionada === h && styles.horaTextoActiva,
              ]}
            >
              {h}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fecha:</Text>
      <Text style={styles.fechaEstatica}>{fecha}</Text>

      <Text style={styles.label}>Nombre completo del comprador:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Juan Pérez"
        placeholderTextColor="#777"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="juan@ejemplo.com"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.btnContinuar} onPress={handleSiguiente}>
        <Text style={styles.btnTexto}>Seleccionar Asientos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  sub: {
    fontSize: 15,
    color: "#FFB300",
    marginBottom: 20,
  },
  label: {
    color: "#CCC",
    fontSize: 14,
    marginTop: 15,
    marginBottom: 6,
    fontWeight: "600",
  },
  fechaEstatica: {
    color: "#FFF",
    fontSize: 16,
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
  },
  horariosGrid: {
    flexDirection: "row",
    gap: 10,
  },
  horaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#262626",
    borderRadius: 8,
  },
  horaBtnActiva: {
    backgroundColor: "#E50914",
  },
  horaTexto: {
    color: "#AAA",
    fontWeight: "bold",
  },
  horaTextoActiva: {
    color: "#FFF",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 15,
  },
  btnContinuar: {
    backgroundColor: "#E50914",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  btnTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
