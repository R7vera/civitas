export class Distrito {
    id: number;
    nombre: string;
    urlImg: string;
    direccion: string;
    referencia: string;
    ciudad: string;
    pais: string;
    departamento: string;

    constructor(id?: number, direccion?: string, referencia?: string, ciudad?: string, departamento?: string, nombre?: string, urlImg?: string, pais?: string) {
        this.id = id ?? 0;
        this.nombre = nombre ?? '';
        this.urlImg = urlImg ?? '';
        this.pais = pais ?? '';
        this.departamento = departamento ?? '';
        this.ciudad = ciudad ?? '';
        this.referencia = referencia ?? '';
        this.direccion = direccion ?? '';
    }
  }
  