import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { ToastComponent } from '../../elements/toast/toast.component';
import { Programacion } from '../../../models/Programacion';
import { Destinos } from '../../../models/destinos';
import { Vehiculo } from '../../../models/vehiculo';
import { VehiculoService } from '../../../services/entidades/vehiculo.service';
import { DestinosService } from '../../../services/entidades/destinos.service';
import { ProgramacionService } from '../../../services/entidades/programacion.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-programacion',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './programacion.component.html',
  styleUrl: './programacion.component.css'
})
export class ProgramacionComponent {
  programacionSeleccionada: Programacion = new Programacion();
  programaciones: Programacion[] = [];
  destinos: Destinos[] = [];
  vehiculos: Vehiculo[] = [];
  mostrarModal: boolean = false;
  modalTipo: string = ''; // 'editar', 'registrar', 'eliminar'
  modalTitulo: string = '';
  detallesSeleccionada: any;
  mostrarDetalles = false;
  urlImg: string = '';
  constructor(
    private programacionService: ProgramacionService,
    private destinosService: DestinosService,
    private vehiculoService: VehiculoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    
    this.cargarDestinos();
    this.cargarVehiculos();
    this.cargarProgramaciones();
  }
  obtenerDestinoNombre(idDestino: number): string {
    const destino = this.destinos.find(d => d.id === idDestino);
    return destino ? `${destino.direccionSalida.nombre} - ${destino.direccionLlegada.nombre}` : 'Destino no encontrado';
  }

  obtenerImg(idDestino: number): string {
    const destino = this.destinos.find(d => d.id === idDestino);
    return destino ? destino.direccionLlegada.urlImg : 'Destino no encontrado';
  }

  obtenerVehiculoNombre(idVehiculo: number): string {
    const destino = this.vehiculos.find(d => d.id === idVehiculo);
    return destino ? `${destino.placa} - ${destino.tipoVehiculo.nombre}` : 'Destino no encontrado';
  }
  cargarProgramaciones(): void {
    this.programacionService.getAllProgramaciones().subscribe(
      (data) => {
        this.programaciones = data.body; // Asumiendo que el backend devuelve un objeto con la propiedad 'body'
      },
      (error) => {
        console.error('Error al obtener las programaciones', error);
      }
    );
  }

  verDetalles(programacion: any): void {
    this.detallesSeleccionada = programacion;
    this.mostrarDetalles = true;
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
  }
  mostrarExito(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'success');
  }

  mostrarError(text1: string, text2: string) {
    // Muestra un mensaje de error personalizado
    this.toastService.showToast(`${text1} - ${text2}`, 'error');
  }

  mostrarWarning(text1: string, text2: string) {
    // Muestra un mensaje de error personalizado
    this.toastService.showToast(`${text1} - ${text2}`, 'warning');
  }
  cargarDestinos() {
    this.destinosService.getAllDestinos().subscribe((destinos) => {
      this.destinos = destinos.body;
    });
  }

  cargarVehiculos() {
    this.vehiculoService.getAllVehiculos().subscribe((vehiculos) => {
      this.vehiculos = vehiculos.body;
    });
  }

  abrirModalRegistrar() {
    this.modalTipo = 'registrar';
    this.modalTitulo = 'Registrar Programación';
    this.programacionSeleccionada = new Programacion();
    this.mostrarModal = true;
  }

  abrirModalEditar(programacion: Programacion) {
    this.modalTipo = 'editar';
    this.modalTitulo = 'Editar Programación';
    this.programacionSeleccionada = { ...programacion };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  registrarProgramacion(programacion: Programacion) {
    console.log(programacion);
    this.programacionService.createProgramacion(programacion).subscribe({
      next: (response) => {
        this.ngOnInit();
        this.cerrarModal();
        this.mostrarExito('Registro Existoso', 'Programacion Registrada');
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }

  guardarCambios(programacion: Programacion) {
    this.programacionService.updateProgramacion(programacion.id, programacion).subscribe({
      next: (response) => {
        this.ngOnInit();
        this.cerrarModal();
        this.mostrarExito('Actualizacion Existoso', 'Programacion Actualizado');
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }

  eliminarProgramacion(id: number) {
    this.programacionService.deleteProgramacion(id).subscribe({
      next: (response) => {
        this.ngOnInit();
        this.cerrarModal();
        this.mostrarExito('Eliminacion Existoso', 'Programacion Eliminada');
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }
}
