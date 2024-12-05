import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Distrito } from '../../../models/Distrito';
import { Pais } from '../../../models/pais';
import { Ciudades } from '../../../models/ciudades';
import { Router } from '@angular/router';
import { DistritoService } from '../../../services/entidades/distrito.service';
import { DepartamentosService } from '../../../services/entidades/departamentos.service';
import { PaisService } from '../../../services/entidades/pais.service';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { CiudadesService } from '../../../services/entidades/ciudades.service';
import { Departamento } from '../../../models/departamento';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';

import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';

@Component({
  selector: 'app-distrito',
  standalone: true,
  imports: [FormsModule, ToastComponent, CommonModule, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './distrito.component.html',
  styleUrl: './distrito.component.css'
})
export class DistritoComponent {
  distrito: Distrito[] = [];
  numeroDistritos: number = 0;
  mostrarModal: boolean = false;
  modalTitulo: string = '';
  modalTipo: string = ''; // 'editar', 'registrar' o 'eliminar'
  distritoSeleccionado: Distrito | null = null;
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  ciudades: Ciudades[] = [];

  departamentosFiltrados: Departamento[] = [];
  ciudadFiltrados: Ciudades[] = [];

  constructor(
    private router: Router,
    private ciudadService: CiudadesService,
    private servicetoken: TokenService,
    private paisService: PaisService,
    private toastService: ToastService,
    private departamentoService: DepartamentosService,
    private servicioDistrito: DistritoService
  ) { }

  ngOnInit(): void {
    this.servicetoken.logoutIfExpired();
    this.getCiudades();
    this.getPaises();
    this.getDistritos();
    this.getDepartamento();
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
  getDistritos(): void {
    this.servicioDistrito.getAllDistritos().subscribe({
      next: (response) => {
        this.distrito = response.body;
        this.numeroDistritos = this.distrito.length;
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  getCiudades(): void {
    this.ciudadService.getAllCiudades().subscribe({
      next: (response) => {
        this.ciudades = response.body;
        this.filtrarCiudad();
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  onPaisChange(): void {
    this.filtrarDepartamentos();
  }

  onDepartamentoChange(): void {
    this.filtrarCiudad();
  }
  filtrarCiudad(): void {
    if (this.distritoSeleccionado?.departamento) {
      this.ciudadFiltrados = this.ciudades.filter(ciudad =>
        ciudad?.departamento === this.distritoSeleccionado?.departamento
      );
    } else {
      this.ciudadFiltrados = [];
    }
  }
  // Filtrar departamentos basados en el país seleccionado
  filtrarDepartamentos(): void {
    if (this.distritoSeleccionado?.pais) {
      this.departamentosFiltrados = this.departamentos.filter(departamento =>
        departamento?.pais.nombre === this.distritoSeleccionado?.pais
      );
    } else {
      this.departamentosFiltrados = [];
    }
  }

  getDepartamento(): void {
    this.departamentoService.getAllDepartamentos().subscribe({
      next: (response) => {
        this.departamentos = response.body;
        this.filtrarDepartamentos();
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }
  getPaises(): void {
    this.paisService.getAllPaises().subscribe({
      next: (response) => {
        this.paises = response.body;
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }
  abrirModalEditar(distrito: Distrito): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Editar Distrito';
    this.modalTipo = 'editar';
    this.distritoSeleccionado = { ...distrito }; // Clonar el objeto para evitar cambios en tiempo real

    // Filtrar los departamentos y ciudades basados en los valores seleccionados
    this.filtrarDepartamentos();  // Esto asegura que el departamento ya seleccionado esté disponible
    this.filtrarCiudad();         // Esto asegura que la ciudad ya seleccionada esté disponible
  }

  guardarCambios(distrito: Distrito): void {
    if (!(distrito.ciudad == '' || distrito.departamento == '' || distrito.direccion == '' || distrito.nombre == '' || distrito.pais ==
      '' || distrito.referencia == '' || distrito.urlImg == ''

    )) {
      this.servicioDistrito.updateDistrito(distrito.id, distrito).subscribe({
        next: () => {
          this.ngOnInit();
          this.getCiudades(); // Actualiza la lista
          this.cerrarModal();
          this.mostrarExito('Actualizacion Exisitoso', 'Distrito Actualizado');
        },
        error: (err) => this.mostrarError('Error', 'Intentar de nuevo'),
      });
    } else {
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo')
      return;
    }
  }
  eliminarCiudad(id: number): void {
    this.servicioDistrito.deleteDistrito(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.getCiudades(); // Actualiza la lista
        this.cerrarModal();
        this.mostrarExito('Eliminacion Exisitoso', 'Ciudad eliminado');
      },
      error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
    });
  }
  registrarCiudad(distrito: Distrito) {
    if (!(distrito.ciudad == '' || distrito.departamento == '' || distrito.direccion == '' || distrito.nombre == '' || distrito.pais ==
      '' || distrito.referencia == '' || distrito.urlImg == ''

    )) {

      this.servicioDistrito.createDistrito(distrito).subscribe({
        next: (response) => {
          this.ngOnInit();
          this.getCiudades(); // Actualiza la lista
          this.cerrarModal();
          console.log(response.message);
        },
        error: (error) => console.error('Error al registrar la Departamento:', error),
      }) // Asigna un ID único (puedes usar tu lógica de backend)
      this.cerrarModal();
    }else{
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo')
      return;
    }
     

  }
  abrirModalEliminar(id: number): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Eliminar Distrito';
    this.modalTipo = 'eliminar';
    this.distritoSeleccionado = this.distrito.find((p) => p.id === id) || null;
  }

  abrirModalRegistrar() {
    this.modalTipo = 'registrar';
    this.modalTitulo = 'Registrar Distrito';
    this.distritoSeleccionado = new Distrito();// Objeto vacío para nuevos registros
    this.mostrarModal = true;
  }
  cerrarModal(): void {
    this.mostrarModal = false;
    this.distritoSeleccionado = null;
  }
}
