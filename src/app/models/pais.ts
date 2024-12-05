export class Pais {
    id: number;
    nombre: string;
    url: string;

    constructor(id?: number, nombre?: string, url?: string) {
        this.id = id ?? 0;
        this.nombre = nombre ?? '';
        this.url = url ?? '';
    }
}
