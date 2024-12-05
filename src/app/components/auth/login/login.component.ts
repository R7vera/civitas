import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';
import { VideoService } from '../../../services/video/video.service';
import { LoginService } from '../../../services/inicioSesion/login.service';
import { TokenService } from '../../../services/inicioSesion/token.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  aceptarTerminos: boolean = false;
  showPassword: boolean = false;
  showTermsModal: boolean = false;

  constructor(private tokenService: TokenService, private loginService: LoginService, private videoService: VideoService, private toastService: ToastService, private router: Router) {}
  ngAfterViewInit(): void {
    if (this.videoElementRef) {
      const video = this.videoElementRef.nativeElement;
      video.muted = this.videoService.getVideoMuted();
    }
  }
  


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (!this.username || !this.password) {
      this.mostrarWarning('Datos No Completados','Intentar de nuevo')
      return;
    }

    if (!this.aceptarTerminos) {
      this.mostrarError('Debes aceptar','Nuestro Terminos')
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: (response)=>{
        const responseRol = response.body.tipoUsuario;
        this.mostrarExito('Inicio Sesion exitoso', 'Bienvenido a Civitas');
        this.tokenService.setToken(response.body.token);
        this.tokenService.setUsuario(response.body);
        this.tokenService.setExpiirationDate(response.body.duracionTk);
        if( responseRol === 'Cliente'){
          this.router.navigate(['/principalcliente']);
        }else if( responseRol === 'Administrador'){
          this.router.navigate(['/dashboard-admi']);
        }
      },
      error: (err) =>{
        let errorMessage = 'Error Desconocido';
        if (err.error && err.error.message) {

          errorMessage = err.error.message; // Accede al mensaje de error desde el cuerpo de la respuesta
        } else if (err.message) {
          errorMessage = err.message; // Si el error contiene un mensaje estándar
        }
      
        // Mostrar el error
        this.mostrarError(errorMessage, 'Intentar de nuevo');
      }
    })

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
  navigateToRegister(): void {
    this.router.navigate(['/registrar']);
  }

  openTermsModal() {
    this.showTermsModal = true;
  }

  // Cierra el modal de términos y condiciones
  closeTermsModal() {
    this.showTermsModal = false;
  }
}


