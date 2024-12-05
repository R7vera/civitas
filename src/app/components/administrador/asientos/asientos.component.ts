import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../elements/toast/toast.component';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { Vehiculo } from '../../../models/vehiculo';
import { VehiculoService } from '../../../services/entidades/vehiculo.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-asientos',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './asientos.component.html',
  styleUrl: './asientos.component.css'
})
export class AsientosComponent {
  vehicleType: string = ''; // Tipo de vehículo seleccionado (e.g., bus)
  totalSeats: number = 0; // Total de asientos ingresados por el usuario
  seatMatrix: any[][] = []; // Matriz que representará los asientos
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];
  constructor(private toastService: ToastService,private service: VehiculoService){

  }
  ngOnInit(){
    this.getVehiculos();
    console.log(this.vehiculosFiltrados);
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
  getVehiculos(){
    this.service.getAllVehiculos().subscribe({
      next: (response) => {
        this.vehiculos = response.body;
        this.filterSelectedVehicles();
      },
      error: (error) => this.mostrarError('Error', 'Intentar de nuevo'),
    })
  }
  filterSelectedVehicles(): void {
    this.vehiculosFiltrados = this.vehiculos.filter(vehicle => vehicle.tipoVehiculo.nombre === 'BUS');
  }
  generateSeats(): void {
    // Limpiar matriz previa
    this.seatMatrix = [];
  
    if (this.vehicleType === 'BUS') {
      const columns = 4; // Para un bus, usamos siempre 4 columnas
      let seatNumber = 1;
      const rows = Math.ceil(this.totalSeats / columns); // Calcular número de filas
  
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
          // Insertar dos asientos, dejar un espacio (null), e insertar dos más
          if (j === 2) {
            row.push(null); // Espacio para el pasillo
          }
          if (seatNumber <= this.totalSeats) {
            row.push({
              number: seatNumber, // Número del asiento
              selected: false, // Indica si está seleccionado
            });
            seatNumber++;
          } else {
            row.push(null); // Espacio vacío si no hay más asientos
          }
        }
        this.seatMatrix.push(row);
      }
    } else if (this.vehicleType === 'combi') {
      let seatNumber = 1;
      const rows = Math.ceil(this.totalSeats / 3); // Dividimos en grupos de 3 (máximo 3 asientos por fila)
  
      for (let i = 0; i < rows; i++) {
        const row = [];
        if (i === 0) {
          // Primera fila con la distribución: Espacio, Espacio, Asiento, Asiento
          row.push(null, null); // Espacios vacíos
          if (seatNumber <= this.totalSeats) {
            row.push(
              { number: seatNumber++, selected: false },
              { number: seatNumber++, selected: false }
            );
          }
        } else {
          // Filas siguientes con la distribución: Asiento, Asiento, Espacio, Asiento
          if (seatNumber <= this.totalSeats) {
            row.push({ number: seatNumber++, selected: false });
          } else {
            row.push(null);
          }
          if (seatNumber <= this.totalSeats) {
            row.push({ number: seatNumber++, selected: false });
          } else {
            row.push(null);
          }
          row.push(null); // Espacio vacío
          if (seatNumber <= this.totalSeats) {
            row.push({ number: seatNumber++, selected: false });
          } else {
            row.push(null);
          }
        }
  
        // Asegurar que la última fila tenga siempre 4 columnas
        while (row.length < 4) {
          row.push(null);
        }
  
        this.seatMatrix.push(row);
      }
    }
  }
  
  
  

  toggleSeatSelection(seat: any): void {
    seat.selected = !seat.selected; // Cambiar estado de selección
  }
}
