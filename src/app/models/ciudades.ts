export class Ciudades{
    id: number;
    nombre: string;
    url: string;
    pais: string;
    departamento: string;

    constructor(id?: number, departamento?: string, nombre?: string, url?: string, pais?: string) {
        this.id = id ?? 0;
        this.nombre = nombre ?? '';
        this.url = url ?? '';
        this.pais = pais ?? '';
        this.departamento = departamento ?? '';
    }
}