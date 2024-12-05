export class TipoLicencia {
    id: number;
    nombre: string

    constructor(
        id?: number,
        nombre?: string,
 
    ) {
        this.id = id ?? 0; // Valor predeterminado si no se pasa un ID
        this.nombre = nombre ?? ''; // Valor predeterminado si no se pasa un nombre
       
    }
}