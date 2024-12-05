import { Distrito } from "./Distrito";

export class Destinos {
    id: number;
    direccionSalida: Distrito;
    direccionLlegada: Distrito;
    kilometros: number;
    estado: Boolean;
    horas: number;
    costoBase: number;

    // Constructor con parámetros
    constructor(id: number,
        direccionSalida: Distrito,
        direccionLlegada: Distrito,
        kilometros: number,
        estado: Boolean,
        horas: number,
        costoBase: number) {
        this.id = id ?? 0;
        this.direccionSalida = direccionSalida ?? null;
        this.direccionLlegada = direccionLlegada ?? null;
        this.kilometros = kilometros ?? 0;
        this.estado = estado ?? true;
        this.horas = horas ?? 0;
        this.costoBase = costoBase ?? 0;
    }

    // Constructor vacío
}
