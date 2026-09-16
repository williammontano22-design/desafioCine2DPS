import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reserva } from "../../types/reserva";

interface ReservasState {
  items: Reserva[];
}

const initialState: ReservasState = {
  items: [],
};

const reservasSlice = createSlice({
  name: "reservas",
  initialState,
  reducers: {
    crearReserva: (state, action: PayloadAction<Reserva>) => {
      state.items.unshift(action.payload);
    },
    marcarBoletoUsado: (state, action: PayloadAction<string>) => {
      const reserva = state.items.find(
        (r) => r.codigoReserva === action.payload,
      );
      if (reserva) {
        reserva.usado = true;
      }
    },
  },
});

export const { crearReserva, marcarBoletoUsado } = reservasSlice.actions;
export default reservasSlice.reducer;
