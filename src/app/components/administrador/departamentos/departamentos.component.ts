import { Component } from '@angular/core';
import { Departamento } from '../../../models/departamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { DepartamentosService } from '../../../services/entidades/departamentos.service';
import { Router } from '@angular/router';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { Pais } from '../../../models/pais';
import { PaisService } from '../../../services/entidades/pais.service';

import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [FormsModule, ToastComponent, CommonModule, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.css'
})
export class DepartamentosComponent {
  departamentos: Departamento[] = [];
  numberDepartamento: number = 0;
  mostrarModal: boolean = false;
  modalTitulo: string = '';
  paises: Pais[] = [];
  modalTipo: string = ''; // 'editar', 'registrar' o 'eliminar'
  departamentoSeleccionado: Departamento | null = null;
  paisSeleccionado: Pais | null = null;
  constructor(
    private router: Router,
    private paisservice: PaisService, private toastService: ToastService,
    private service: DepartamentosService, private servicetoken: TokenService
  ) { }
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
  ngOnInit(): void {
    this.servicetoken.logoutIfExpired();
    this.getDepartamentos();
    this.cargarPaises();

  }

  cargarPaises(): void {
    this.paisservice.getAllPaises().subscribe({
      next: (response) => {
        this.paises = response.body; // Asegúrate de que sea el formato esperado

      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  getDepartamentos(): void {
    this.service.getAllDepartamentos().subscribe({
      next: (response) => {
        this.departamentos = response.body;
        this.numberDepartamento = this.departamentos.length;
    
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  abrirModalEditar(departamento: Departamento): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Editar Departamento';
    this.modalTipo = 'editar';
    this.departamentoSeleccionado = { ...departamento }; // Clonar el objeto para evitar cambios en tiempo real
  }

  abrirModalEliminar(id: number): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Eliminar Departamento';
    this.modalTipo = 'eliminar';
    this.departamentoSeleccionado = this.departamentos.find((p) => p.id === id) || null;
  }

  guardarCambios(departamento: Departamento): void {
   
    if (!(departamento.urlImg === '' || departamento.pais === null || departamento.nombre ==='') ) {
      this.service.updateDepartamento(departamento.id, departamento).subscribe({
        next: () => {
          this.ngOnInit();
          this.getDepartamentos;
          this.cerrarModal();
          this.mostrarExito('Actualizacion Exisitoso', 'Departamento Actualizado');
        },
        error: (err) =>  this.mostrarError('Error', 'Intentar de nuevo')
      });
    }else {
      this.mostrarWarning('Datos No Completados','Intentar de nuevo')
      return;
    }
  }

  eliminarDepartamento(id: number): void {
    this.service.deleteDepartamento(id).subscribe({
      next: () => {
        this.getDepartamentos(); // Actualiza la lista
        this.cargarPaises();
        this.cerrarModal();
        this.mostrarExito('Eliminacion Exisitoso', 'Departamento eliminado');
      },
      error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
    });
  }
  abrirModalRegistrar() {
    this.modalTipo = 'registrar';
    this.modalTitulo = 'Registrar Departamento';
    this.departamentoSeleccionado = new Departamento;// Objeto vacío para nuevos registros
    this.mostrarModal = true;
  }

  registrarDepartamento(departamento: Departamento) {
    if (!(departamento.urlImg === '' || departamento.pais === null || departamento.nombre ==='') ) {

      this.service.createDepartamento(departamento).subscribe({
        next: (response) => {
          console.log(response.message);
          this.ngOnInit();
          this.mostrarExito('Registro Exitoso', 'Departamento agregado');
        },
        error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
      }) // Asigna un ID único (puedes usar tu lógica de backend)

      this.cerrarModal();
    } else {
      this.mostrarWarning('Datos No Completados','Intentar de nuevo')
      return;
    }
  }
  cerrarModal(): void {
    this.mostrarModal = false;
    this.paisSeleccionado = null;
  }

}
