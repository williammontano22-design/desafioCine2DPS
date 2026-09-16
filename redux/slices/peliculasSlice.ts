import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pelicula } from "../../types/pelicula";

interface PeliculasState {
  items: Pelicula[];
}

const initialState: PeliculasState = {
  items: [
    {
      codigo: "PEL-01",
      nombre: "Interestelar",
      genero: "Ciencia Ficción",
      duracion: 169,
      clasificacion: "+12",
      salaAsignada: "Sala 1",
      precio: 5.5,
      estado: "Disponible",
      horarios: ["15:00", "18:30", "21:00"],
    },
    {
      codigo: "PEL-02",
      nombre: "El Padrino",
      genero: "Drama",
      duracion: 175,
      clasificacion: "+18",
      salaAsignada: "Sala 2",
      precio: 6.0,
      estado: "Disponible",
      horarios: ["16:00", "20:00"],
    },
  ],
};

const peliculasSlice = createSlice({
  name: "peliculas",
  initialState,
  reducers: {
    agregarPelicula: (state, action: PayloadAction<Pelicula>) => {
      state.items.push(action.payload);
    },
    editarPelicula: (state, action: PayloadAction<Pelicula>) => {
      const idx = state.items.findIndex(
        (p) => p.codigo === action.payload.codigo,
      );
      if (idx !== -1) state.items[idx] = action.payload;
    },
    eliminarPelicula: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.codigo !== action.payload);
    },
    cambiarEstadoPelicula: (
      state,
      action: PayloadAction<{
        codigo: string;
        estado: "Disponible" | "No disponible";
      }>,
    ) => {
      const item = state.items.find((p) => p.codigo === action.payload.codigo);
      if (item) item.estado = action.payload.estado;
    },
  },
});

export const {
  agregarPelicula,
  editarPelicula,
  eliminarPelicula,
  cambiarEstadoPelicula,
} = peliculasSlice.actions;
export default peliculasSlice.reducer;
