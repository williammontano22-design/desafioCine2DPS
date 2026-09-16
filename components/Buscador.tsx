import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface Props {
  valor: string;
  alCambiar: (texto: string) => void;
  placeholder?: string;
}

export default function Buscador({
  valor,
  alCambiar,
  placeholder = "Buscar por nombre, género, sala...",
}: Props) {
  return (
    <View style={styles.contenedor}>
      <TextInput
        value={valor}
        onChangeText={alCambiar}
        placeholder={placeholder}
        placeholderTextColor="#888"
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
});
