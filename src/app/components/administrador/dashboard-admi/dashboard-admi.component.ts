import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
@Component({
  selector: 'app-dashboard-admi',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-admi.component.html',
  styleUrl: './dashboard-admi.component.css'
})
export class DashboardAdmiComponent {
  @ViewChild('midashboard') miDiv!: ElementRef;
  isVisible: boolean = false;
  isDropdownOpen = false; 
  isEquipo = false;
  isDestinos = false;
  constructor(
    private router: Router,
    private dashboardService: DashboardService) {}
  ngOnInit() {
    // Suscripción al cambio de visibilidad
    this.dashboardService.dashboardVisible$.subscribe((visible) => {
      this.isVisible = visible;
      this.toggleSidebarVisibility();
    });
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  // Este método se llama cada vez que cambia la visibilidad
  toggleSidebarVisibility() {
    if (this.isVisible && window.innerWidth < 1024 ) { // Solo para pantallas no `lg`
      this.miDiv.nativeElement.classList.remove('hidden');
    } else {
      this.miDiv.nativeElement.classList.add('hidden');
    }
  }


  togleDestinos(){
    this.isDestinos = !this.isDestinos;
  }
  toglePaises(){
    this.router.navigate(['/']);
  }

  togleTeam(){
    this.isEquipo = !this.isEquipo;
  }
  // Listener para el cambio de tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.toggleSidebarVisibility();
  }
  navigateTo(url: string){
    this.router.navigate([url]);
  }
}
