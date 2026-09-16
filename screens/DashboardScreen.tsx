import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAppSelector } from "../redux/hooks";

export default function DashboardScreen() {
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const reservas = useAppSelector((state) => state.reservas.items);
  const ocupaciones = useAppSelector((state) => state.salas.ocupaciones);

  const stats = useMemo(() => {
    const totalPeliculas = peliculas.length;
    const totalIngresos = reservas.reduce((acc, r) => acc + r.totalPagado, 0);
    const boletosVendidos = reservas.reduce(
      (acc, r) => acc + r.asientos.length,
      0,
    );

    const totalAsientosOcupados = ocupaciones.reduce(
      (acc, o) => acc + o.asientosOcupados.length,
      0,
    );

    // Cada función tiene capacidad de 20 asientos (4x5)
    const capacidadTotal = Math.max(ocupaciones.length * 20, 20);
    const asientosDisponibles = Math.max(
      0,
      capacidadTotal - totalAsientosOcupados,
    );

    // Película más reservada
    const conteoPeliculas: { [nombre: string]: number } = {};
    reservas.forEach((r) => {
      conteoPeliculas[r.nombrePelicula] =
        (conteoPeliculas[r.nombrePelicula] || 0) + r.asientos.length;
    });

    let topPelicula = "Ninguna";
    let maxBoletos = 0;
    Object.entries(conteoPeliculas).forEach(([nombre, cant]) => {
      if (cant > maxBoletos) {
        maxBoletos = cant;
        topPelicula = `${nombre} (${cant} boletos)`;
      }
    });

    return {
      totalPeliculas,
      totalFunciones: ocupaciones.length,
      boletosVendidos,
      asientosDisponibles,
      asientosOcupados: totalAsientosOcupados,
      totalIngresos,
      topPelicula,
    };
  }, [peliculas, reservas, ocupaciones]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dashboard Administrativo</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.label}>Ingresos Generados</Text>
          <Text style={[styles.valor, { color: "#4CAF50" }]}>
            ${stats.totalIngresos.toFixed(2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Boletos Vendidos</Text>
          <Text style={styles.valor}>{stats.boletosVendidos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Total Películas</Text>
          <Text style={styles.valor}>{stats.totalPeliculas}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Funciones Registradas</Text>
          <Text style={styles.valor}>{stats.totalFunciones}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Asientos Ocupados</Text>
          <Text style={[styles.valor, { color: "#D32F2F" }]}>
            {stats.asientosOcupados}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Asientos Libres</Text>
          <Text style={[styles.valor, { color: "#388E3C" }]}>
            {stats.asientosDisponibles}
          </Text>
        </View>
      </View>

      <View style={[styles.card, styles.cardAncha]}>
        <Text style={styles.label}>Película Más Taquillera / Reservada</Text>
        <Text style={[styles.valor, { fontSize: 16, marginTop: 4 }]}>
          {stats.topPelicula}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#121212",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: "#1E1E1E",
    width: "48%",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardAncha: {
    width: "100%",
    marginTop: 12,
  },
  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  valor: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
});
