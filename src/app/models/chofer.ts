import { Persona } from "./persona";
import { TipoLicencia } from "./tipoLicencia";

export class Chofer {
    id: number;
    persona: Persona;
    numeroLicencia: string;
    tipoLicencia: TipoLicencia;
    estado: boolean;
  
    constructor(
      id?: number,
      persona?: Persona,
      numeroLicencia?: string,
      tipoLicencia?: TipoLicencia,
      estado?: boolean
    ) {
      this.id = id ?? 0;
      this.persona = persona ?? new Persona();
      this.numeroLicencia = numeroLicencia ?? '';
      this.tipoLicencia = tipoLicencia ?? new TipoLicencia();
      this.estado = estado ?? true;
    }
  }
  