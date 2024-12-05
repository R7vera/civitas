import { TipoDocumento } from "./tipoDocumento";
export class Persona {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  documentoIdentidad: string;
  tipoDocumento: TipoDocumento; // Relación con la clase TipoDocumento
  constructor(
    id?: number,
    nombres?: string,
    apellidoPaterno?: string,
    apellidoMaterno?: string,
    documentoIdentidad?: string,
    tipoDocumento?: TipoDocumento,

  ) {
    this.id = id ?? 0;
    this.nombres = nombres ?? '';
    this.apellidoPaterno = apellidoPaterno ?? '';
    this.apellidoMaterno = apellidoMaterno ?? '';
    this.documentoIdentidad = documentoIdentidad ?? '';
    this.tipoDocumento = tipoDocumento ?? new TipoDocumento(); // Relación inicializada con un objeto por defecto

  }
}