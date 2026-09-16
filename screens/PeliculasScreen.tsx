import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useAppSelector } from "../redux/hooks";
import Buscador from "../components/Buscador";
import Filtros from "../components/Filtros";
import PeliculaFila from "../components/PeliculaFila";

export default function PeliculasScreen({ navigation }: any) {
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const [busqueda, setBusqueda] = useState("");
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");

  // Obtener géneros únicos para los chips
  const generos = useMemo(() => {
    const list = peliculas.map((p) => p.genero);
    return ["Todos", ...Array.from(new Set(list))];
  }, [peliculas]);

  // Filtrar solo disponibles para el cliente y aplicar búsqueda dinámica
  const peliculasFiltradas = useMemo(() => {
    return peliculas
      .filter((p) => p.estado === "Disponible")
      .filter((p) => {
        const matchesGenero =
          generoSeleccionado === "Todos" || p.genero === generoSeleccionado;
        const query = busqueda.toLowerCase().trim();
        const matchesQuery =
          !query ||
          p.nombre.toLowerCase().includes(query) ||
          p.genero.toLowerCase().includes(query) ||
          p.clasificacion.toLowerCase().includes(query) ||
          p.salaAsignada.toLowerCase().includes(query);
        return matchesGenero && matchesQuery;
      });
  }, [peliculas, busqueda, generoSeleccionado]);

  // Autenticación Biométrica obligatoria para ingresar a la Zona de Personal
  const handleAccesoPersonal = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert(
          "Acceso Denegado",
          "El dispositivo no cuenta con hardware biométrico compatible.",
        );
        return;
      }
      const inscripcion = await LocalAuthentication.isEnrolledAsync();
      if (!inscripcion) {
        Alert.alert(
          "Biometría no configurada",
          "Configure una huella o reconocimiento facial en el dispositivo.",
        );
        return;
      }

      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación del Personal",
        cancelLabel: "Cancelar",
        fallbackLabel: "Usar PIN/Contraseña",
      });

      if (resultado.success) {
        navigation.navigate("StaffFlow");
      } else {
        Alert.alert(
          "Autenticación Fallida",
          "No se pudo verificar la identidad.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el sensor biométrico.");
    }
  };

  return (
    <View style={styles.container}>
      <Buscador valor={busqueda} alCambiar={setBusqueda} />
      <Filtros
        opciones={generos}
        seleccionado={generoSeleccionado}
        alSeleccionar={setGeneroSeleccionado}
      />

      <FlatList
        data={peliculasFiltradas}
        keyExtractor={(item) => item.codigo}
        renderItem={({ item }) => (
          <PeliculaFila
            pelicula={item}
            onPress={() => navigation.navigate("Reserva", { pelicula: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.textoVacio}>
              No hay películas disponibles con ese criterio.
            </Text>
          </View>
        }
      />

      {/* Botón discreto de acceso al personal */}
      <TouchableOpacity
        style={styles.botonDiscreto}
        onPress={handleAccesoPersonal}
      >
        <Text style={styles.textoBotonDiscreto}>🔒 Acceso del Personal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  vacio: {
    padding: 30,
    alignItems: "center",
  },
  textoVacio: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  botonDiscreto: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    borderTopWidth: 1,
    borderTopColor: "#2B2B2B",
  },
  textoBotonDiscreto: {
    color: "#666",
    fontSize: 13,
    fontWeight: "bold",
  },
});
