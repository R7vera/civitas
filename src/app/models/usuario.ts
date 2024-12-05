import { Persona } from "./persona";
export enum TipoUsuario {
    Cliente = 'Cliente',
    Administrador = 'Administrador',
    Vendedor = 'Vendedor'
}

export class Usuario {
    id: number;
    persona: Persona; // Relación con Persona
    correo: string;
    usuario: string;
    contrasenia: string;
    tipoUsuario: TipoUsuario; // Tipo enumerado
   

    constructor(
        id?: number,
        persona?: Persona,
        correo?: string,
        usuario?: string,
        contrasenia?: string,
        tipoUsuario?: TipoUsuario,
       
    ) {
        this.id = id ?? 0;
        this.persona = persona ?? new Persona();
        this.correo = correo ?? '';
        this.usuario = usuario ?? '';
        this.contrasenia = contrasenia ?? '';
        this.tipoUsuario = tipoUsuario ?? TipoUsuario.Cliente; // Valor por defecto
    }
}