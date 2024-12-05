import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/inicioSesion/token.service';
@Component({
  selector: 'app-navegador',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './navegador.component.html',
  styleUrl: './navegador.component.css'
})
export class NavegadorComponent {
  usuario: string = '';
  correo: string = '';
  isMenuOpen = false;

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    const user = this.tokenService.getUsuario();
    this.usuario = user?.usuario ?? 'INDEFINIDO';
    this.correo = user?.correo ?? 'INDEFINIDO';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // Detectar clics fuera del menú para cerrarlo
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-button') && !target.closest('#user-dropdown')) {
      this.closeMenu();
    }
  }
  signOut() {
    // Llamar al servicio de logout
    this.tokenService.logout();
  }
}
