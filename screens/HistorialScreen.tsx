import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useAppSelector } from "../redux/hooks";

export default function HistorialScreen() {
  const reservas = useAppSelector((state) => state.reservas.items);

  return (
    <View style={styles.container}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.codigoReserva}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ticket}>
            <View style={styles.ticketHeader}>
              <Text style={styles.pelicula}>{item.nombrePelicula}</Text>
              <Text
                style={[
                  styles.estadoBoleto,
                  { color: item.usado ? "#D32F2F" : "#4CAF50" },
                ]}
              >
                {item.usado ? "UTILIZADO" : "VÁLIDO"}
              </Text>
            </View>

            <Text style={styles.detalle}>
              Función: {item.sala} | {item.fecha} {item.hora}
            </Text>
            <Text style={styles.detalle}>
              Asientos: {item.asientos.join(", ")}
            </Text>
            <Text style={styles.detalle}>Cliente: {item.cliente.nombre}</Text>
            <Text style={styles.precio}>
              Total: ${item.totalPagado.toFixed(2)}
            </Text>

            <View style={styles.qrContenedor}>
              <QRCode
                value={item.codigoReserva}
                size={110}
                color="#000"
                backgroundColor="#FFF"
              />
              <Text style={styles.codigoTxt}>{item.codigoReserva}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.textoVacio}>
              No has realizado ninguna compra todavía.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  list: {
    padding: 16,
  },
  ticket: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pelicula: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  estadoBoleto: {
    fontWeight: "bold",
    fontSize: 13,
  },
  detalle: {
    color: "#BBB",
    fontSize: 14,
    marginVertical: 2,
  },
  precio: {
    color: "#FFB300",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 6,
  },
  qrContenedor: {
    alignItems: "center",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  codigoTxt: {
    color: "#888",
    marginTop: 6,
    letterSpacing: 2,
    fontSize: 13,
  },
  vacio: {
    padding: 40,
    alignItems: "center",
  },
  textoVacio: {
    color: "#777",
    fontSize: 15,
  },
});
