import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { marcarBoletoUsado } from "../redux/slices/reservasSlice";

export default function EscanerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);
  const dispatch = useAppDispatch();
  const reservas = useAppSelector((state) => state.reservas.items);

  if (!permission) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.texto}>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.texto}>
          Se requiere acceso a la cámara para validar boletos.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnTexto}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (escaneado) return;
    setEscaneado(true);

    const reserva = reservas.find((r) => r.codigoReserva === data);

    if (!reserva) {
      Alert.alert(
        "Boleto Inválido",
        `El código ${data} no coincide con ninguna reserva.`,
        [{ text: "Aceptar", onPress: () => setEscaneado(false) }],
      );
      return;
    }

    if (reserva.usado) {
      Alert.alert(
        " ⚠️ALERTA: Boleto Usado",
        `Este boleto (${data}) ya ha sido ingresado previamente.`,
        [{ text: "Aceptar", onPress: () => setEscaneado(false) }],
      );
      return;
    }

    // Marcar como usado en Redux y persistir
    dispatch(marcarBoletoUsado(data));
    Alert.alert(
      "✅ Boleto Válido",
      `Acceso confirmado:\n\nPelícula: ${reserva.nombrePelicula}\nAsientos: ${reserva.asientos.join(", ")}\nCliente: ${reserva.cliente.nombre}`,
      [{ text: "Listo", onPress: () => setEscaneado(false) }],
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={escaneado ? undefined : handleBarcodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.marco} />
        <Text style={styles.instruccion}>
          Enfoca el código QR del boleto del cliente
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  texto: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#E50914",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnTexto: {
    color: "#FFF",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  marco: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  instruccion: {
    color: "#FFF",
    marginTop: 20,
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
