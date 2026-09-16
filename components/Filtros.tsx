import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  opciones: string[];
  seleccionado: string;
  alSeleccionar: (opcion: string) => void;
}

export default function Filtros({
  opciones,
  seleccionado,
  alSeleccionar,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {opciones.map((opcion) => {
        const activo = opcion === seleccionado;
        return (
          <TouchableOpacity
            key={opcion}
            onPress={() => alSeleccionar(opcion)}
            style={[styles.boton, activo && styles.botonActivo]}
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>
              {opcion}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  boton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    marginRight: 8,
  },
  botonActivo: {
    backgroundColor: "#E50914",
  },
  texto: {
    color: "#AAA",
    fontSize: 13,
    fontWeight: "600",
  },
  textoActivo: {
    color: "#FFF",
  },
});
