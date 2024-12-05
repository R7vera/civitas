import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chofer } from '../../../models/chofer';
import { ToastComponent } from '../../elements/toast/toast.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { ToastService } from '../../../services/toast.service';
import { ChoferService } from '../../../services/entidades/chofer.service';
import { TipodocumentoService } from '../../../services/registrar/tipodocumento.service';
import { TipoDocumento } from '../../../models/tipoDocumento';
import { TipoLicencia } from '../../../models/tipoLicencia';
@Component({
  selector: 'app-chofer',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './chofer.component.html',
  styleUrl: './chofer.component.css'
})
export class ChoferComponent {
  choferes: Chofer[] = [];
  numeroChoferes: number = 0;
  tipoDocumento: TipoDocumento[]  = [];
  modalVisible: boolean = false;
  modalChofer: Chofer | null = null;
  isDisabled: boolean = true;
  idChoferEliminar: number = 0;
  mostrarModalRegistrarAndEdi: boolean = false;
  modalTituloRegistrarAndEdi: string = '';
  modalTipoRegistrarAndEdi: string = '';
  tipoLicencia: TipoLicencia[] = [];
  choferFormulario: Chofer = new Chofer();

  constructor(
    private toastService: ToastService,
    private tokenService: TokenService,
    private choferesService: ChoferService,
    private serviceDocu: TipodocumentoService
  ) {}

  ngOnInit(): void {
    this.tokenService.logoutIfExpired();
    this.getChoferes();
    this.getTipoDocumento();
    this.getTipoLicencia();
  }

  getTipoLicencia(){
    this.choferesService.getAllTiposLicencia().subscribe({
      next: (response) => {
        this.tipoLicencia = response.body;

      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  mostrarExito(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'success');
  }

  getTipoDocumento(){
    this.serviceDocu.getTiposDocumentos().subscribe({
      next: (response) => {
        this.tipoDocumento = response.body;

      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  mostrarError(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'error');
  }

  getChoferes(): void {

    this.choferesService.getAllChoferes().subscribe({
      next: (response) => {
        this.choferes = response.body;
        this.numeroChoferes = this.choferes.length;
      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  abrirModalEliminar(id: number): void {
    this.mostrarModalRegistrarAndEdi = true;
    this.modalTituloRegistrarAndEdi = 'Eliminar Destino';
    this.modalTipoRegistrarAndEdi = 'eliminar';
    this.idChoferEliminar = id;
  }
  eliminarChofer(id: number): void {
    this.choferesService.deleteChofer(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Eliminación Exitosa', 'Chofer Eliminado');
      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  toggleEstado(chofer: Chofer): void {
    chofer.estado = !chofer.estado;
    this.choferesService.updateChofer(chofer.id, chofer).subscribe({
      next: () => {
        this.ngOnInit();
        this.mostrarExito('Actualización Exitosa', 'Estado Actualizado');
      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  abrirModalRegistrar(): void {
    this.modalTipoRegistrarAndEdi = 'registrar';
    this.modalTituloRegistrarAndEdi = 'Registrar Chofer';
    this.choferFormulario = new Chofer();
    this.mostrarModalRegistrarAndEdi = true;
  }

  verDetalles(chofer: Chofer): void {
    this.modalChofer = chofer;
    this.modalVisible = true;
  }

  abrirModalEditar(chofer: Chofer): void {
    this.mostrarModalRegistrarAndEdi = true;
    this.modalTituloRegistrarAndEdi = 'Editar Chofer';
    this.modalTipoRegistrarAndEdi = 'editar';
    this.choferFormulario = { ...chofer };
  }

  registrarChofer(): void {
    console.log( this.choferFormulario);
    this.choferesService.createChofer(this.choferFormulario).subscribe({
      next: () => {
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Registro Exitoso', 'Chofer Registrado');
      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  editarChofer(): void {
    this.choferesService.updateChofer(this.choferFormulario.id, this.choferFormulario).subscribe({
      next: () => {
        this.ngOnInit();
        this.cerrarModalEditarAndRegis();
        this.mostrarExito('Actualización Exitosa', 'Chofer Actualizado');
      },
      error: () => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  cerrarModalEditarAndRegis(): void {
    this.mostrarModalRegistrarAndEdi = false;
    this.modalChofer = null;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.modalChofer = null;
  }


}
