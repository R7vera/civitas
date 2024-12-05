import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardAdmiComponent } from '../dashboard-admi/dashboard-admi.component';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { VehiculoService } from '../../../services/entidades/vehiculo.service';
import { PaisService } from '../../../services/entidades/pais.service';
import { ChoferService } from '../../../services/entidades/chofer.service';
import { NavDashoboardComponent } from '../nav-dashoboard/nav-dashoboard.component';
import { DestinosService } from '../../../services/entidades/destinos.service';
@Component({
  selector: 'app-principal-administrador',
  standalone: true,
  imports: [DashboardAdmiComponent, NavDashoboardComponent],
  templateUrl: './principal-administrador.component.html',
  styleUrls: ['./principal-administrador.component.css'], // Corregido el error en `styleUrls`
})
export class PrincipalAdministradorComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  lengthPais: number = 0;
  lengthDestino: number = 0;
  lengthVehiculos: number = 0;
  lengthChofer: number = 0;
  constructor(
    private service: PaisService, 
    private router: Router, 
    private tokenService: TokenService,
    private DestinoService: DestinosService,
    private serviceVehiculos: VehiculoService,
    private choferService: ChoferService
  ) {}

  ngOnInit(): void {
    // Verificar si el token ha expirado y realizar logout si es necesario
    this.tokenService.logoutIfExpired();
    this.getPaisesLength();
    this.getDestinosLength();
    this.getVehiculos();
    this.getChoferes();
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }
  getChoferes(): void {
    this.choferService.getAllChoferes().subscribe({
      next: (response) => {
        this.lengthChofer = response.body.length || 0;
      },
      error: (error) => console.error('Error al cargar los países:', error),
    });
  }
  getPaisesLength(): void {
    this.service.getAllPaises().subscribe({
      next: (response) => {
        this.lengthPais = response.body.length || 0;
      },
      error: (error) => console.error('Error al cargar los países:', error),
    });
  }
  getVehiculos(): void {
    this.serviceVehiculos.getAllVehiculos().subscribe({
      next: (response) => {
        this.lengthVehiculos = response.body.length || 0;
      },
      error: (error) => console.error('Error al cargar los países:', error),
    });
  }
  getDestinosLength(): void {
    this.DestinoService.getAllDestinos().subscribe({
      next: (response) => {
        this.lengthDestino = response.body.length || 0;
      },
      error: (error) => console.error('Error al cargar los países:', error),
    });
  }

  ngAfterViewInit(): void {
    // Registrar todos los componentes necesarios para Chart.js
    Chart.register(...registerables);

    // Verificar si el canvas está disponible
    const ctx = this.chartCanvas?.nativeElement?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bus 001', 'Bus 002', 'Bus 003', 'Bus 004'], // Vehículos
          datasets: [
            {
              label: 'Pasajes Vendidos',
              data: [45, 30, 50, 20], // Datos simulados
              backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'], // Colores por barra
              borderColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Pasajes Vendidos',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Vehículos',
              },
            },
          },
        },
      });
    } else {
      console.error('No se pudo inicializar el contexto 2D del canvas.');
    }
  }
}
