import { Pais } from './pais';

export class Departamento {
    id: number;
    nombre: string;
    urlImg: string;
    pais: Pais;

    constructor(id?: number, nombre?: string, urlImg?: string, pais?: Pais) {
        this.id = id ?? 0;
        this.nombre = nombre ?? '';
        this.urlImg = urlImg ?? '';
        this.pais = pais ?? new Pais();
    }
}
