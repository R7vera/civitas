import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/inicioSesion/token.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
@Component({
  selector: 'app-nav-dashoboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nav-dashoboard.component.html',
  styleUrl: './nav-dashoboard.component.css'
})
export class NavDashoboardComponent {
  usuario: string = '';
  correo: string = '';
  isMenuOpen = false;
  
  constructor(private tokenService: TokenService, private dashboardService: DashboardService) {}

  ngOnInit() {
    const user = this.tokenService.getUsuario();
    this.usuario = user?.usuario ?? 'INDEFINIDO';
    this.correo = user?.correo ?? 'INDEFINIDO';

  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.user-menu')) {
      this.isMenuOpen = false;
    }
  }


  onBurgerClick() {
    // Cambia el estado de visibilidad
    this.dashboardService.toggleDashboard();
  }
  signOut() {
    // Llamar al servicio de logout
    this.tokenService.logout();
  }
}
