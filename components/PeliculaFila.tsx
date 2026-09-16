import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Pelicula } from "../types/pelicula";

interface Props {
  pelicula: Pelicula;
  onPress: () => void;
  esPersonal?: boolean;
  onEditar?: () => void;
  onEliminar?: () => void;
  onAlternarEstado?: () => void;
}

export default function PeliculaFila({
  pelicula,
  onPress,
  esPersonal = false,
  onEditar,
  onEliminar,
  onAlternarEstado,
}: Props) {
  const disponible = pelicula.estado === "Disponible";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{pelicula.nombre}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: disponible ? "#2E7D32" : "#C62828" },
            ]}
          >
            <Text style={styles.badgeTexto}>{pelicula.estado}</Text>
          </View>
        </View>

        <Text style={styles.subtitulo}>
          {pelicula.genero} • {pelicula.duracion} min • {pelicula.clasificacion}
        </Text>
        <Text style={styles.salaYPrecio}>
          {pelicula.salaAsignada} | Precio: ${pelicula.precio.toFixed(2)}
        </Text>
      </View>

      {esPersonal && (
        <View style={styles.accionesPersonal}>
          <TouchableOpacity
            onPress={onAlternarEstado}
            style={[styles.btnAccion, styles.btnToggle]}
          >
            <Text style={styles.btnTexto}>
              {disponible ? "Desactivar" : "Activar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onEditar}
            style={[styles.btnAccion, styles.btnEdit]}
          >
            <Text style={styles.btnTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onEliminar}
            style={[styles.btnAccion, styles.btnDelete]}
          >
            <Text style={styles.btnTexto}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2F2F2F",
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titulo: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeTexto: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 2,
  },
  salaYPrecio: {
    color: "#FFB300",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
  },
  accionesPersonal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
    gap: 8,
  },
  btnAccion: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnToggle: {
    backgroundColor: "#444",
  },
  btnEdit: {
    backgroundColor: "#1976D2",
  },
  btnDelete: {
    backgroundColor: "#D32F2F",
  },
  btnTexto: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
