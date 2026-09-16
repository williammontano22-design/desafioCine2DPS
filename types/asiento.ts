export type EstadoAsiento = "disponible" | "seleccionado" | "ocupado";

export interface AsientoModel {
  id: string;
  fila: string;
  numero: number;
  estado: EstadoAsiento;
}

export interface Sala {
  id: string;
  nombre: string;
  filas: number;
  columnas: number;
}
