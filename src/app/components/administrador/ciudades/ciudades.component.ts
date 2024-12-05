import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ciudades } from '../../../models/ciudades';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { CiudadesService } from '../../../services/entidades/ciudades.service';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { Pais } from '../../../models/pais';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';

import { DepartamentosService } from '../../../services/entidades/departamentos.service';
import { PaisService } from '../../../services/entidades/pais.service';
import { Departamento } from '../../../models/departamento';
@Component({
  selector: 'app-ciudades',
  standalone: true,
  imports: [FormsModule, ToastComponent, CommonModule, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './ciudades.component.html',
  styleUrl: './ciudades.component.css'
})
export class CiudadesComponent {
  ciudades: Ciudades[] = [];
  numeroCiudades: number = 0;
  mostrarModal: boolean = false;
  modalTitulo: string = '';
  modalTipo: string = ''; // 'editar', 'registrar' o 'eliminar'
  ciudadeSeleccionado: Ciudades | null = null;
  paises: Pais[] = [];
  departamentos: Departamento[] = [];

  departamentosFiltrados: Departamento[] = [];
  constructor(
    private router: Router,
    private ciudadService: CiudadesService,
    private servicetoken: TokenService,
    private paisService: PaisService,
    private toastService: ToastService,
    private departamentoService: DepartamentosService
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
    this.getCiudades();
    this.getPaises();
    this.getDepartamento();
  }
  onPaisChange(): void {
    this.filtrarDepartamentos();
  }
  filtrarDepartamentos(): void {
    if (this.ciudadeSeleccionado?.pais) {
      // Filtra departamentos según el país seleccionado
      this.departamentosFiltrados = this.departamentos.filter(departamento =>
        departamento.pais.nombre === this.ciudadeSeleccionado?.pais
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
      error: (error) => console.error('Error al cargar Paises:', error.error),
    })
  }
  getPaises(): void {
    this.paisService.getAllPaises().subscribe({
      next: (response) => {
        this.paises = response.body;
      },
      error: (error) => console.error('Error al cargar Paises:', error.error),
    })
  }

  getCiudades(): void {
    this.ciudadService.getAllCiudades().subscribe({
      next: (response) => {
        this.ciudades = response.body;
        this.numeroCiudades = this.ciudades.length;

      },
      error: (error) => console.error('Error al cargar Departamentos:', error.error),
    });
  }

  abrirModalEditar(ciudad: Ciudades): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Editar Ciudad';
    this.modalTipo = 'editar';
    this.ciudadeSeleccionado = { ...ciudad }; // Clonar el objeto para evitar cambios en tiempo real
    this.filtrarDepartamentos();  // Esto asegura que el departamento ya seleccionado esté disponible

  }
  guardarCambios(ciudad: Ciudades): void {
    if (!(ciudad.departamento == '' || ciudad.nombre == '' || ciudad.pais == '' || ciudad.url == ''
    )) {

      this.ciudadService.updateCiudad(ciudad.id, ciudad).subscribe({
        next: () => {
          this.ngOnInit();
          this.getCiudades(); // Actualiza la lista
          this.cerrarModal();
          this.mostrarExito('Actualizacion Exisitoso', 'Ciudades Actualizado');
        },
        error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
      });
    } else {
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo')
      return;
    } 
  }
  eliminarCiudad(id: number): void {
    this.ciudadService.deleteCiudad(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.getCiudades(); // Actualiza la lista
        this.cerrarModal();
        this.mostrarExito('Eliminacion Exisitoso', 'Ciudad eliminado');
      },
      error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
    });
  }
  registrarCiudad(ciudad: Ciudades) {
    if (!(ciudad.departamento == '' || ciudad.nombre == '' || ciudad.pais == '' || ciudad.url == ''
    )) {

      this.ciudadService.createCiudad(ciudad).subscribe({
        next: (response) => {
          this.ngOnInit();
          this.getCiudades(); // Actualiza la lista
          this.cerrarModal();
          this.mostrarExito('Registro Exitoso', 'Ciudad agregado');

        },
        error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
      }) // Asigna un ID único (puedes usar tu lógica de backend)
      this.cerrarModal();

    } else {
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo')
      return;
    }
  }
  abrirModalEliminar(id: number): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Eliminar Ciudad';
    this.modalTipo = 'eliminar';
    this.ciudadeSeleccionado = this.ciudades.find((p) => p.id === id) || null;
  }

  abrirModalRegistrar() {
    this.modalTipo = 'registrar';
    this.modalTitulo = 'Registrar Ciudad';
    this.ciudadeSeleccionado = new Ciudades();// Objeto vacío para nuevos registros
    this.mostrarModal = true;
  }
  cerrarModal(): void {
    this.mostrarModal = false;
    this.ciudadeSeleccionado = null;
  }
}
