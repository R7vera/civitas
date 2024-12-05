import { TipoVehiculo } from "./TipoVehiculo";

export enum estadoVehiculo {
   Activo = 'Activo', Inactivo = 'Inactivo'
}

export class Vehiculo {
    id: number;
    tipoVehiculo: TipoVehiculo;  // Relación con TipoVehiculo
    placa: string;
    numeroPisos: number;
    estado: estadoVehiculo;  // Puede ser 'Activo', 'Inactivo', etc.

    constructor(
        id?: number,
        tipoVehiculo?: TipoVehiculo,
        placa?: string,
        numeroPisos?: number,
        estado?: estadoVehiculo  // Valor predeterminado 'Activo'
    ) {
        this.id = id ?? 0;
        this.tipoVehiculo = tipoVehiculo ?? new TipoVehiculo();
        this.placa = placa ?? '';
        this.numeroPisos = numeroPisos ?? 0;
        this.estado = estado ?? estadoVehiculo.Activo;
    }
}
