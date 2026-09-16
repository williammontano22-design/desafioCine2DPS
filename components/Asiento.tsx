import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { EstadoAsiento } from "../types/asiento";

interface Props {
  id: string;
  estado: EstadoAsiento;
  onPress: () => void;
}

export default function Asiento({ id, estado, onPress }: Props) {
  const getBackgroundColor = () => {
    switch (estado) {
      case "ocupado":
        return "#D32F2F"; // Rojo
      case "seleccionado":
        return "#FFB300"; // Amarillo / Dorado
      case "disponible":
      default:
        return "#388E3C"; // Verde
    }
  };

  return (
    <TouchableOpacity
      disabled={estado === "ocupado"}
      onPress={onPress}
      style={[styles.asiento, { backgroundColor: getBackgroundColor() }]}
    >
      <Text style={styles.texto}>{id}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  asiento: {
    width: 48,
    height: 44,
    margin: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  texto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});
