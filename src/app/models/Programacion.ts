import { Destinos } from "./destinos";
import { Distrito } from "./Distrito";
import { Vehiculo } from "./vehiculo";

export class Programacion {
    id: number;
    fechaSalida: Date;
    fechaLlegada: Date;
    idVehiculo: number; // Puedes reemplazar 'any' con la clase correspondiente de Vehiculo
    idDestino: number;  // Puedes reemplazar 'any' con la clase correspondiente de Destinos

    constructor(id?: number, FechaSalida?: Date, FechaLlegada?: Date, vehiculo?: number, destino?: number) {
        this.id = id ?? 0;
        this.fechaSalida = FechaSalida ?? new Date();
        this.fechaLlegada = FechaLlegada ?? new Date();
        this.idVehiculo = vehiculo ?? 0;
        this.idDestino = destino ?? 0;
    }
}
