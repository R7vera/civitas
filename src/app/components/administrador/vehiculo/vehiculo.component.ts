import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { estadoVehiculo, Vehiculo } from '../../../models/vehiculo';
import { Router } from '@angular/router';
import { VehiculoService } from '../../../services/entidades/vehiculo.service';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { TipoVehiculo } from '../../../models/TipoVehiculo';
@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [FormsModule, CommonModule,ToastComponent, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css'
})
export class VehiculoComponent {
  vehiculos: Vehiculo[] = [];
  numberVehiculo: number = 0;
  mostrarModal: boolean = false;

  vehiculoNuevo: Vehiculo = new Vehiculo();
  tipoVehiculo: TipoVehiculo[] = [];
  modalTitulo: string = '';
  modalTipo: string = ''; // 'editar' o 'eliminar'
  vehiculoSeleccionado: Vehiculo | null = null;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private service: VehiculoService,
    private servicetoken: TokenService
  ) {}

  ngOnInit(): void {
    this.servicetoken.logoutIfExpired();
    this.getVehiculos();
    this.getTipoVehiculo();

  }

  mostrarExito(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'success');
  }

  mostrarError(text1: string, text2: string) {
    this.toastService.showToast(`${text1} - ${text2}`, 'error');
  }

  mostrarWarning(text1: string, text2: string) {
    this.toastService.showToast(`${text1} - ${text2}`, 'warning');
  }
  getTipoVehiculo(): void{
    this.service.getAllTiposVehiculo().subscribe({
      next: (response) => {
        this.tipoVehiculo = response.body;

      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }
  getVehiculos(): void {
    this.service.getAllVehiculos().subscribe({
      next: (response) => {
        this.vehiculos = response.body;
        this.numberVehiculo = this.vehiculos.length;
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    });
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  abrirModalEditar(vehiculo: Vehiculo): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Editar Vehículo';
    this.modalTipo = 'editar';
    this.vehiculoSeleccionado = { ...vehiculo }; // Clonar el objeto para evitar cambios en tiempo real
  }

  abrirModalEliminar(id: number): void {
    this.mostrarModal = true;
    this.modalTitulo = 'Eliminar Vehículo';
    this.modalTipo = 'eliminar';
    this.vehiculoSeleccionado = this.vehiculos.find((v) => v.id === id) || null;
  }

  guardarCambios(vehiculo: Vehiculo): void {
    if (!(vehiculo.tipoVehiculo.nombre == '' || vehiculo.placa == '')) {
      console.log(vehiculo);
      this.service.updateVehiculo(vehiculo.id, vehiculo).subscribe({
        next: () => {
          this.ngOnInit();
          this.getVehiculos(); // Actualiza la lista
          this.cerrarModal();
          this.mostrarExito('Actualización Exitosa', 'Vehículo Actualizado');
        },
        error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
      });
    } else {
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo');
      return;
    }
  }

  eliminarVehiculo(id: number): void {
    this.service.deleteVehiculo(id).subscribe({
      next: () => {
        this.getVehiculos(); // Actualiza la lista
        this.cerrarModal();
        this.mostrarExito('Eliminación Exitosa', 'Vehículo Eliminado');
      },
      error: (err) => this.mostrarError('Error', 'Intentar de nuevo')
    });
  }

  abrirModalRegistrar() {
    this.modalTipo = 'registrar';
    this.modalTitulo = 'Registrar Vehículo';
    this.vehiculoSeleccionado = { id: 0, tipoVehiculo: new TipoVehiculo(), placa: '', numeroPisos: 0, estado: estadoVehiculo.Activo }; // Objeto vacío para nuevos registros
    this.mostrarModal = true;
  }

  registrarVehiculo(vehiculo: Vehiculo) {
      // this.vehiculoNuevo.tipoVehiculo = nuevoVehiculo.tipoVehiculo;
      // this.vehiculoNuevo.placa = nuevoVehiculo.placa;
      // this.vehiculoNuevo.numeroPisos = nuevoVehiculo.numeroPisos;
      console.log(vehiculo);
      vehiculo.id = 0;
      this.service.createVehiculo(vehiculo).subscribe({
        next: (response) => {
          this.ngOnInit();
          this.mostrarExito('Registro Exitoso', 'Vehículo agregado');
          this.cerrarModal();
        },
        error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
      });
    

  }
  validarNumeroPisos(): void {
    if (this.vehiculoSeleccionado) {
      if (this.vehiculoSeleccionado.numeroPisos > 2) {
        this.vehiculoSeleccionado.numeroPisos = 2;  // Limita el valor a 2
        this.mostrarError('Valor no permitido', 'Solo se permite 1 o 2 pisos');
      } else if (this.vehiculoSeleccionado.numeroPisos < 1) {
        this.vehiculoSeleccionado.numeroPisos = 1;  // Limita el valor mínimo a 1
        this.mostrarError('Valor no permitido', 'Solo se permite 1 o 2 pisos');
      }
    }
  }
  
  getImagenUrl(tipoVehiculo: string): string {
    switch (tipoVehiculo.toLowerCase()) {
      case 'bus':
        return 'https://motoradiesel.com/dev/wp-content/uploads/2021/09/marco1.jpg';
      case 'combi':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXdr0ptkj9IZ_QHE-ja1jEx-yEFFjCUUDYeg&s';
      case 'auto':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnrogL-oDiWfDHWXb0Hjl2d2zDqr2BiVYsKA&s';
      default:
        return 'url-default-imagen';  // Puedes poner una imagen por defecto si no es ninguno de los tipos mencionados
    }
  }
  
  cerrarModal(): void {
    this.mostrarModal = false;
    this.vehiculoSeleccionado = null;
  }
  isDeparture = true; // Indica si es "Bus De Salida" o "Bus De Retorno"

  busFloors = [
    {
      seats: [
        { id: 1, number: '01', class: 'business', selected: false, reserved: false },
        { id: 2, number: '02', class: 'business', selected: false, reserved: false },
        { id: 3, number: '03', class: 'economy', selected: false, reserved: false },
        { id: 4, number: '04', class: 'economy', selected: false, reserved: false },
        // ... Agrega más asientos según sea necesario
      ],
    },
    {
      seats: [
        { id: 10, number: '10', class: 'economy', selected: false, reserved: true },
        { id: 11, number: '11', class: 'economy', selected: true, reserved: false },
        // ... Asientos del segundo piso
      ],
    },
  ];

  selectBus(isDeparture: boolean): void {
    this.isDeparture = isDeparture;
  }

  toggleSeatSelection(floorIndex: number, seatId: number): void {
    const seat = this.busFloors[floorIndex].seats.find((s) => s.id === seatId);
    if (seat && !seat.reserved) {
      seat.selected = !seat.selected;
    }
  }

}
