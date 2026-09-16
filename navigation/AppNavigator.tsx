import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Pantallas del Cliente
import PeliculasScreen from "../screens/PeliculasScreen";
import ReservaScreen from "../screens/ReservaScreen";
import MapaAsientosScreen from "../screens/MapaAsientosScreen";
import HistorialScreen from "../screens/HistorialScreen";

// Pantallas del Personal
import DashboardScreen from "../screens/DashboardScreen";
import FormularioPeliculaScreen from "../screens/FormularioPeliculasScreen";
import EscanerScreen from "../screens/EscanerScreen";
import PeliculaFila from "../components/PeliculaFila";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import {
  eliminarPelicula,
  cambiarEstadoPelicula,
} from "../redux/slices/peliculasSlice";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const StaffTab = createBottomTabNavigator();

// Pestaña Administrativa de Gestión de Películas
function GestionPeliculasScreen({ navigation }: any) {
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const dispatch = useAppDispatch();

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <TouchableOpacity
        style={adminStyles.btnAdd}
        onPress={() => navigation.navigate("FormularioPelicula")}
      >
        <Text style={adminStyles.btnAddTxt}>+ Agregar Nueva Película</Text>
      </TouchableOpacity>

      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.codigo}
        renderItem={({ item }) => (
          <PeliculaFila
            pelicula={item}
            esPersonal
            onPress={() => {}}
            onEditar={() =>
              navigation.navigate("FormularioPelicula", { pelicula: item })
            }
            onEliminar={() => {
              Alert.alert(
                "Confirmar",
                `¿Desea eliminar la película ${item.nombre}?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => dispatch(eliminarPelicula(item.codigo)),
                  },
                ],
              );
            }}
            onAlternarEstado={() => {
              dispatch(
                cambiarEstadoPelicula({
                  codigo: item.codigo,
                  estado:
                    item.estado === "Disponible"
                      ? "No disponible"
                      : "Disponible",
                }),
              );
            }}
          />
        )}
      />
    </View>
  );
}

const adminStyles = StyleSheet.create({
  btnAdd: {
    backgroundColor: "#E50914",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAddTxt: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

// Flujo de Pestañas del Staff
function StaffTabs({ navigation }: any) {
  return (
    <StaffTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1E1E" },
        headerTintColor: "#FFF",
        tabBarStyle: { backgroundColor: "#1E1E1E", borderTopColor: "#333" },
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#888",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.replace("ClienteTabs")}
          >
            <Text style={{ color: "#E50914", fontWeight: "bold" }}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <StaffTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Estadísticas" }}
      />
      <StaffTab.Screen
        name="Gestion"
        component={GestionPeliculasScreen}
        options={{ title: "Películas" }}
      />
      <StaffTab.Screen
        name="Escaner"
        component={EscanerScreen}
        options={{ title: "Escanear QR" }}
      />
    </StaffTab.Navigator>
  );
}

// Flujo de Pestañas del Cliente
function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1E1E" },
        headerTintColor: "#FFF",
        tabBarStyle: { backgroundColor: "#1E1E1E", borderTopColor: "#333" },
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Cartelera"
        component={PeliculasScreen}
        options={{ title: "Cartelera" }}
      />
      <Tab.Screen
        name="MisBoletos"
        component={HistorialScreen}
        options={{ title: "Mis Boletos" }}
      />
    </Tab.Navigator>
  );
}

// Stack Principal
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1E1E1E" },
          headerTintColor: "#FFF",
        }}
      >
        <Stack.Screen
          name="ClienteTabs"
          component={ClienteTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reserva"
          component={ReservaScreen}
          options={{ title: "Reservar Función" }}
        />
        <Stack.Screen
          name="MapaAsientos"
          component={MapaAsientosScreen}
          options={{ title: "Elegir Asientos" }}
        />

        {/* Zona Protegida del Personal */}
        <Stack.Screen
          name="StaffFlow"
          component={StaffTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FormularioPelicula"
          component={FormularioPeliculaScreen}
          options={{ title: "Datos de Película" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
