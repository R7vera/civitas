import { Component } from '@angular/core';
import { Destinos } from '../../../models/destinos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { DestinosService } from '../../../services/entidades/destinos.service';
import { Distrito } from '../../../models/Distrito';
import { DistritoService } from '../../../services/entidades/distrito.service';
@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, DashboardAdmiComponent , NavDashoboardComponent],
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.css'
})
export class DestinosComponent {
  destinos: Destinos[] = [];
  numeroDestino: number = 0;

  modalVisible: boolean = false;
  modalDestino: Destinos | null = null
  isDisabled: boolean = true; 
  idDestinoEliminar: number = 0;
  mostrarModalRegistrarAndEdi: boolean = false;
  modalTituloRegistrarAndEdi: string = '';
  modalTipoRegistrarAndEdi: string = '';


  distritosDisponiblesSalida: Distrito[] = [];
  distritosDisponiblesLlegadas: Distrito[] = [];
  distritos: Distrito[] = [];

  destinoFormulario: Destinos = { // Crear un objeto genérico para el formulario
    id: 0,
    kilometros: 0,
    horas: 0,
    direccionSalida: new Distrito,
    direccionLlegada: new Distrito,
    costoBase: 0,
    estado: true
  };

  constructor(
    private toastService: ToastService,
    private servicetoken: TokenService,
    private destinosService: DestinosService,
    private distritoService: DistritoService
  ) { }
  ngOnInit(): void{
    this.servicetoken.logoutIfExpired();
    this.getDestinos();
    this.getDistritos();
  }
  mostrarExito(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'success');
  }
  actualizarDistritos(): void {
    this.distritosDisponiblesSalida = this.distritos.filter(
      (distrito) => distrito.nombre !== this.destinoFormulario.direccionLlegada.nombre
    );
    this.distritosDisponiblesLlegadas = this.distritos.filter(
      (distrito) => distrito.nombre !== this.destinoFormulario.direccionSalida.nombre
    );
  }

  mostrarError(text1: string, text2: string) {
    // Muestra un mensaje de error personalizado
    this.toastService.showToast(`${text1} - ${text2}`, 'error');
  }

  mostrarWarning(text1: string, text2: string) {
    // Muestra un mensaje de error personalizado
    this.toastService.showToast(`${text1} - ${text2}`, 'warning');
  }

  getDestinos(): void{
    this.destinosService.getAllDestinos().subscribe({
      next: (response) =>{
        this.destinos = response.body;
        this.numeroDestino = this.destinos.length;
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }

  getDistritos(): void{
    this.distritoService.getAllDistritos().subscribe({
      next: (response) =>{
        this.distritos = response.body;
        this.distritosDisponiblesSalida = [...this.distritos];
        this.distritosDisponiblesLlegadas = [...this.distritos]; 
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }

  eliminarDestino(id: number) {
    console.log('Eliminar destino con ID', id);
    this.destinosService.deteleDestino(id).subscribe({
      next: () =>{
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Eliminacion Exitoso', 'Actualizado');
      },
      error: (err) =>  this.mostrarError('Error', 'Intentar de nuevo')
    })
  }

  toggleEstado(destino: Destinos): void {
    destino.estado = !destino.estado;
    console.log('Nuevo estado', destino.estado);
    this.destinosService.updateDestinos(destino.id, destino).subscribe({
      next: () =>{
        this.ngOnInit();
        this.mostrarExito('Actualizacion Exitoso', 'Estado Actualizado');
      },
      error: (err) =>  this.mostrarError('Error', 'Intentar de nuevo')
    })
    // Lógica para cambiar el estado en la base de datos si es necesario
    // this.destinoService.actualizarEstado(destino).subscribe();
  }

  verDetalles(destino: Destinos): void {
    this.modalDestino = destino;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.modalDestino = null;
  }


  
  // Método para registrar un nuevo destino
  registrarDestino() {
    // this.getDestinos()
    // const existeDestino = this.distritos.some(
    //   (destino) =>
    //     this.destinoFormulario.direccionSalida.nombre === this.destinoFormulario.direccionSalida.nombre &&
    //   this.destinoFormulario.direccionLlegada.nombre === this.destinoFormulario.direccionLlegada.nombre
    // );
  
    // if (existeDestino) {
    //   this.destinoFormulario.direccionLlegada =new Distrito,
    //   this.destinoFormulario.direccionSalida =new Distrito,
    //   this.getDistritos();
    //   this.mostrarError('Destino ya registrado', 'El destino seleccionado ya existe.');
    //   return; // No continuar con la creación.
    // }
    this.destinosService.crearDestinos(this.destinoFormulario).subscribe({
      next: () => {
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Actualizacion Exisitoso', 'Departamento Actualizado');
      },
      error: (err) =>  this.mostrarError('Error', 'Intentar de nuevo')
    });
  }

  // Método para editar un destino existente
  editarDestino() {
    this.mostrarExito('Actualizacion Exitoso', 'Estado Actualizado');
    this.destinosService.updateDestinos(this.destinoFormulario.id, this.destinoFormulario).subscribe({
      next: () => {
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Actualizacion Exisitoso', 'Departamento Actualizado');
      },
      error: (err) =>  this.mostrarError('Error', 'Intentar de nuevo')
    });
  }

  abrirModalRegistrar() {
    this.modalTipoRegistrarAndEdi = 'registrar';
    this.modalTituloRegistrarAndEdi = 'Registrar Destino';
    this.destinoFormulario = { // Crear un objeto genérico para el formulario
      id: 0,
      kilometros: 0,
      horas: 0,
      direccionSalida: new Distrito,
      direccionLlegada: new Distrito,
      costoBase: 0,
      estado: true
    };// Objeto vacío para nuevos registros
    this.mostrarModalRegistrarAndEdi = true;
  }

  abrirModalEditar(destino: Destinos): void {
    this.mostrarModalRegistrarAndEdi = true;
    this.modalTituloRegistrarAndEdi = 'Editar Destino';
    this.modalTipoRegistrarAndEdi = 'editar';
    this.destinoFormulario = { ...destino };
  }
  abrirModalEliminar(id: number): void {
    this.mostrarModalRegistrarAndEdi = true;
    this.modalTituloRegistrarAndEdi = 'Eliminar Destino';
    this.modalTipoRegistrarAndEdi = 'eliminar';
    this.idDestinoEliminar = id;
  }

  cerrarModalEditarAndRegis(): void {
    this.mostrarModalRegistrarAndEdi = false;
    this.modalDestino = null;
  }
}
