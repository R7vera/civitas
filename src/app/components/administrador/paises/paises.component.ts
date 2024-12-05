import { Component } from '@angular/core';
import { Pais } from '../../../models/pais';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { PaisService } from '../../../services/entidades/pais.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [FormsModule, CommonModule,ToastComponent, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.css'
})
export class PaisesComponent {
    paises: Pais[] = []
    numberPais: number = 0;
    mostrarModal: boolean = false;

    paisNuevo: Pais = new Pais();

    modalTitulo: string = '';
    modalTipo: string = ''; // 'editar' o 'eliminar'
    paisSeleccionado: Pais | null = null;

    constructor(
      private router: Router, private toastService: ToastService,
      private service: PaisService, private servicetoken: TokenService){}

    ngOnInit(): void{
      this.servicetoken.logoutIfExpired();
      this.getPaises();
      console.log(this.getPaises());
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
    getPaises(): void{
      this.service.getAllPaises().subscribe({
        next: (response) => {
          this.paises = response.body;
          this.numberPais = this.paises.length;
        },
        error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
      })
    }

    navigateTo(url: string){
      this.router.navigate([url]);
    }
    abrirModalEditar(pais: Pais): void {
      this.mostrarModal = true;
      this.modalTitulo = 'Editar País';
      this.modalTipo = 'editar';
      this.paisSeleccionado = { ...pais }; // Clonar el objeto para evitar cambios en tiempo real
    }
  
    abrirModalEliminar(id: number): void {
      this.mostrarModal = true;
      this.modalTitulo = 'Eliminar País';
      this.modalTipo = 'eliminar';
      this.paisSeleccionado = this.paises.find((p) => p.id === id) || null;
    }
  
    guardarCambios(pais: Pais): void {
      if (!(pais.nombre == '' || pais.url == '')) {
        this.service.updatePais(pais.id, pais).subscribe({
          next: () => {
            this.ngOnInit();
            this.getPaises(); // Actualiza la lista
            this.cerrarModal();
            this.mostrarExito('Actualizacion Existoso', 'Pais Actualizado');
          },
          error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
        });
      }else {
        this.mostrarWarning('Datos No Completados','Intentar de nuevo')
        return;
      }
    }
  
    eliminarPais(id: number): void {
      this.service.deletePais(id).subscribe({
        next: () => {
          this.getPaises(); // Actualiza la lista
          this.cerrarModal();
          this.mostrarExito('Eliminacion Exitoso', 'Pais eliminado');
        },
        error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
      });
    }
    abrirModalRegistrar() {
      this.modalTipo = 'registrar';
      this.modalTitulo = 'Registrar País';
      this.paisSeleccionado = { id: 0, nombre: '', url: '' }; // Objeto vacío para nuevos registros
      this.mostrarModal = true;
  }
  
  registrarPais(nuevoPais: { nombre: string; url: string }) {
      if (nuevoPais.nombre && nuevoPais.url) {
          this.paisNuevo.nombre = nuevoPais.nombre;
          this.paisNuevo.url = nuevoPais.url;
          this.paisNuevo.id = 0;
          this.service.createPais(this.paisNuevo).subscribe({
            next: (response) => {
              this.ngOnInit();
              this.mostrarExito('Registro Exisitoso', 'Pais agregado');
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
