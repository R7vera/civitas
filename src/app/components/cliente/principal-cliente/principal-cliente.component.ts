import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CiudadesService } from '../../../services/entidades/ciudades.service';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { NavegadorComponent } from '../navegador/navegador.component';
import { ProgramacionService } from '../../../services/entidades/programacion.service';
import { Ciudades } from '../../../models/ciudades';
import { Programacion } from '../../../models/Programacion';
import { Destinos } from '../../../models/destinos';
import { DestinosService } from '../../../services/entidades/destinos.service';
@Component({
  selector: 'app-principal-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule, NavegadorComponent],
  templateUrl: './principal-cliente.component.html',
  styleUrl: './principal-cliente.component.css'
})
export class PrincipalClienteComponent {
  cities: Ciudades[] = [];
  programac: Programacion[] = [];
  destinos: Destinos[] = [];
  resultados: Destinos[] = [];
  programaSelec: Programacion[] = [];

  filtros = {
    salida: '',
    llegada: '',
    horario: ''
  };
  constructor(
    private cityService: CiudadesService,
    private destinosService: DestinosService,
    private programService: ProgramacionService
  ) { }

  ngOnInit(): void {
    // Cargar ciudades y programas desde las APIs
    this.cityService.getAllCiudades().subscribe((citiesData) => {
      this.cities = citiesData.body;

    });
    this.cargarDestinos();
    this.programService.getAllProgramaciones().subscribe((programsData) => {
      this.programac = programsData.body;
      console.log('Programaciones asignadas a this.programac:', this.programac);
    });

  }
  obtenerImg(idDestino: number): string {
    const destino = this.destinos.find(d => d.id === idDestino);
    return destino ? destino.direccionLlegada.urlImg : 'Destino no encontrado';
  }
  buscarDestinos() {

    for (let desti of this.destinos) {
      if (desti.direccionLlegada.nombre.toUpperCase() === this.filtros.llegada.toUpperCase() && desti.direccionSalida.nombre.toUpperCase() === this.filtros.salida.toUpperCase()) {
        for (let progr of this.programac) {
          const dateTime = progr.fechaSalida;
          const date = new Date(dateTime);

          // Extraer solo la fecha en formato YYYY-MM-DD
          const formattedDate = date.toISOString().split('T')[0];
          if (formattedDate === this.filtros.horario){
            this.programaSelec.push(progr);
          }
        }
       
      }
    }

    console.log(this.resultados);
  }

  cargarDestinos() {
    this.destinosService.getAllDestinos().subscribe((destinos) => {
      this.destinos = destinos.body;
      console.log(this.destinos);
    });
  }
  obtenerDestinoNombreDestinoSalida(idDestino: number): string {

    const destino = this.destinos.find(d => d.id === idDestino);
    return destino ? destino.direccionSalida.nombre : 'Destino no encontrado';
  }

  // Filtrar ciudades por nombre o programación

}
