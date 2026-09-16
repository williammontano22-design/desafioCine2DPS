import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OcupacionKey {
  funcionKey: string; // Formato: `${codigoPelicula}_${sala}_${fecha}_${hora}`
  asientosOcupados: string[];
}

interface SalasState {
  ocupaciones: OcupacionKey[];
}

const initialState: SalasState = {
  ocupaciones: [],
};

const salasSlice = createSlice({
  name: "salas",
  initialState,
  reducers: {
    ocuparAsientos: (
      state,
      action: PayloadAction<{ funcionKey: string; asientos: string[] }>,
    ) => {
      const item = state.ocupaciones.find(
        (o) => o.funcionKey === action.payload.funcionKey,
      );
      if (item) {
        item.asientosOcupados = [
          ...new Set([...item.asientosOcupados, ...action.payload.asientos]),
        ];
      } else {
        state.ocupaciones.push({
          funcionKey: action.payload.funcionKey,
          asientosOcupados: action.payload.asientos,
        });
      }
    },
  },
});

export const { ocuparAsientos } = salasSlice.actions;
export default salasSlice.reducer;
