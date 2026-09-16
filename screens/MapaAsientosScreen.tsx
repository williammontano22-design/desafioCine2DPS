import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ocuparAsientos } from "../redux/slices/salasSlice";
import { crearReserva } from "../redux/slices/reservasSlice";
import Asiento from "../components/Asiento";
import { EstadoAsiento } from "../types/asiento";

const FILAS = ["A", "B", "C", "D"];
const COLUMNAS = [1, 2, 3, 4, 5];

export default function MapaAsientosScreen({ route, navigation }: any) {
  const { pelicula, fecha, hora, cliente } = route.params;
  const dispatch = useAppDispatch();

  const funcionKey = `${pelicula.codigo}_${pelicula.salaAsignada}_${fecha}_${hora}`;

  // Obtener ocupados de Redux
  const ocupaciones = useAppSelector((state) => state.salas.ocupaciones);
  const asientosOcupados = useMemo(() => {
    const funcion = ocupaciones.find((o) => o.funcionKey === funcionKey);
    return funcion ? funcion.asientosOcupados : [];
  }, [ocupaciones, funcionKey]);

  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const toggleAsiento = (id: string) => {
    if (asientosOcupados.includes(id)) {
      Alert.alert(
        "Asiento no disponible",
        "Este asiento ya se encuentra reservado.",
      );
      return;
    }
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((s) => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const total = seleccionados.length * pelicula.precio;

  const confirmarCompra = () => {
    if (seleccionados.length === 0) {
      Alert.alert(
        "Selección requerida",
        "Debes seleccionar al menos un asiento.",
      );
      return;
    }

    const codigoReserva = `RES-${Date.now().toString().slice(-6)}`;

    // Guardar ocupación en Redux
    dispatch(ocuparAsientos({ funcionKey, asientos: seleccionados }));

    // Crear ticket / reserva
    dispatch(
      crearReserva({
        codigoReserva,
        codigoPelicula: pelicula.codigo,
        nombrePelicula: pelicula.nombre,
        sala: pelicula.salaAsignada,
        fecha,
        hora,
        asientos: seleccionados,
        totalPagado: total,
        cliente,
        usado: false,
        creadoEn: new Date().toISOString(),
      }),
    );

    Alert.alert(
      "¡Compra Exitosa!",
      `Reserva creada con código: ${codigoReserva}`,
      [
        {
          text: "Ver Mis Boletos",
          onPress: () =>
            navigation.navigate("ClienteTabs", { screen: "MisBoletos" }),
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pantallaLabel}>PANTALLA</Text>
      <View style={styles.pantallaCurva} />

      <View style={styles.mapa}>
        {FILAS.map((fila) => (
          <View key={fila} style={styles.fila}>
            {COLUMNAS.map((num) => {
              const id = `${fila}${num}`;
              let estado: EstadoAsiento = "disponible";
              if (asientosOcupados.includes(id)) estado = "ocupado";
              else if (seleccionados.includes(id)) estado = "seleccionado";

              return (
                <Asiento
                  key={id}
                  id={id}
                  estado={estado}
                  onPress={() => toggleAsiento(id)}
                />
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.leyenda}>
        <View style={styles.itemLeyenda}>
          <View style={[styles.cuadro, { backgroundColor: "#388E3C" }]} />
          <Text style={styles.leyendaTxt}>Libre</Text>
        </View>
        <View style={styles.itemLeyenda}>
          <View style={[styles.cuadro, { backgroundColor: "#FFB300" }]} />
          <Text style={styles.leyendaTxt}>Tu selección</Text>
        </View>
        <View style={styles.itemLeyenda}>
          <View style={[styles.cuadro, { backgroundColor: "#D32F2F" }]} />
          <Text style={styles.leyendaTxt}>Ocupado</Text>
        </View>
      </View>

      <View style={styles.resumen}>
        <Text style={styles.resumenTxt}>
          Asientos: {seleccionados.join(", ") || "Ninguno"}
        </Text>
        <Text style={styles.resumenTxt}>Cantidad: {seleccionados.length}</Text>
        <Text style={styles.totalTxt}>Total a Pagar: ${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.btnComprar,
          seleccionados.length === 0 && styles.btnDeshabilitado,
        ]}
        disabled={seleccionados.length === 0}
        onPress={confirmarCompra}
      >
        <Text style={styles.btnTexto}>Confirmar y Pagar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  pantallaLabel: {
    color: "#888",
    letterSpacing: 4,
    fontSize: 12,
    marginBottom: 6,
  },
  pantallaCurva: {
    width: "90%",
    height: 8,
    backgroundColor: "#E50914",
    borderRadius: 4,
    marginBottom: 30,
  },
  mapa: {
    marginBottom: 20,
  },
  fila: {
    flexDirection: "row",
  },
  leyenda: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 15,
  },
  itemLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cuadro: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  leyendaTxt: {
    color: "#BBB",
    fontSize: 12,
  },
  resumen: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 10,
    marginVertical: 15,
  },
  resumenTxt: {
    color: "#CCC",
    fontSize: 15,
    marginBottom: 4,
  },
  totalTxt: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  btnComprar: {
    backgroundColor: "#E50914",
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnDeshabilitado: {
    backgroundColor: "#555",
  },
  btnTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
