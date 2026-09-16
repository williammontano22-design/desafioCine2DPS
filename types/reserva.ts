export interface Reserva {
  codigoReserva: string;
  codigoPelicula: string;
  nombrePelicula: string;
  sala: string;
  fecha: string;
  hora: string;
  asientos: string[];
  totalPagado: number;
  cliente: {
    nombre: string;
    email: string;
  };
  usado: boolean;
  creadoEn: string;
}
