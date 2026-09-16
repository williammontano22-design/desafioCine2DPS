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
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  agregarPelicula,
  editarPelicula,
} from "../redux/slices/peliculasSlice";
import { Pelicula } from "../types/pelicula";

export default function FormularioPeliculaScreen({ route, navigation }: any) {
  const peliculaAEditar: Pelicula | undefined = route.params?.pelicula;
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector((state) => state.peliculas.items);

  const [codigo, setCodigo] = useState(peliculaAEditar?.codigo || "");
  const [nombre, setNombre] = useState(peliculaAEditar?.nombre || "");
  const [genero, setGenero] = useState(peliculaAEditar?.genero || "");
  const [duracion, setDuracion] = useState(
    peliculaAEditar ? peliculaAEditar.duracion.toString() : "",
  );
  const [clasificacion, setClasificacion] = useState(
    peliculaAEditar?.clasificacion || "TP",
  );
  const [salaAsignada, setSalaAsignada] = useState(
    peliculaAEditar?.salaAsignada || "Sala 1",
  );
  const [precio, setPrecio] = useState(
    peliculaAEditar ? peliculaAEditar.precio.toString() : "",
  );

  const guardar = () => {
    // Validaciones exigidas por el PDF
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre de la película es obligatorio.");
      return;
    }
    if (!codigo.trim()) {
      Alert.alert("Error", "El código de la película es obligatorio.");
      return;
    }
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      Alert.alert(
        "Error",
        "El precio debe ser un número válido igual o mayor a cero.",
      );
      return;
    }
    const duracionNum = parseInt(duracion, 10);
    if (isNaN(duracionNum) || duracionNum <= 0) {
      Alert.alert("Error", "La duración debe ser un número positivo.");
      return;
    }

    if (!peliculaAEditar) {
      const existe = peliculas.some(
        (p) => p.codigo.toLowerCase() === codigo.trim().toLowerCase(),
      );
      if (existe) {
        Alert.alert(
          "Error de Código",
          "Ya existe una película registrada con ese código.",
        );
        return;
      }
    }

    const payload: Pelicula = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      genero: genero.trim() || "Acción",
      duracion: duracionNum,
      clasificacion: clasificacion.trim(),
      salaAsignada: salaAsignada.trim(),
      precio: precioNum,
      estado: peliculaAEditar?.estado || "Disponible",
      horarios: peliculaAEditar?.horarios || ["15:00", "18:30", "21:00"],
    };

    if (peliculaAEditar) {
      dispatch(editarPelicula(payload));
      Alert.alert("Éxito", "Película actualizada correctamente.");
    } else {
      dispatch(agregarPelicula(payload));
      Alert.alert("Éxito", "Película agregada al catálogo.");
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Código único:</Text>
      <TextInput
        style={[styles.input, peliculaAEditar && styles.inputBloqueado]}
        value={codigo}
        onChangeText={setCodigo}
        editable={!peliculaAEditar}
        placeholder="Ej. PEL-99"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Nombre de la película:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Avatar 3"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Género:</Text>
      <TextInput
        style={styles.input}
        value={genero}
        onChangeText={setGenero}
        placeholder="Ej. Aventura / Sci-Fi"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Duración (minutos):</Text>
      <TextInput
        style={styles.input}
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="numeric"
        placeholder="120"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Clasificación:</Text>
      <TextInput
        style={styles.input}
        value={clasificacion}
        onChangeText={setClasificacion}
        placeholder="TP, +12, +15, +18"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Sala Asignada:</Text>
      <TextInput
        style={styles.input}
        value={salaAsignada}
        onChangeText={setSalaAsignada}
        placeholder="Sala 1"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Precio de Entrada ($):</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        placeholder="5.00"
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
        <Text style={styles.btnTexto}>
          {peliculaAEditar ? "Guardar Cambios" : "Agregar Película"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
  },
  label: {
    color: "#CCC",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputBloqueado: {
    opacity: 0.5,
  },
  btnGuardar: {
    backgroundColor: "#E50914",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  btnTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
