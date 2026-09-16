export interface Pelicula {
  codigo: string;
  nombre: string;
  genero: string;
  duracion: number; // minutos
  clasificacion: string;
  salaAsignada: string;
  precio: number;
  estado: "Disponible" | "No disponible";
  horarios?: string[];
}
