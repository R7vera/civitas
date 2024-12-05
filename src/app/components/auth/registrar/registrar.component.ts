import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../../services/registrar/registro.service';
import { Persona } from '../../../models/persona';
import { Usuario, TipoUsuario } from '../../../models/usuario';
import { TipoDocumento } from '../../../models/tipoDocumento';
import { TipodocumentoService } from '../../../services/registrar/tipodocumento.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../elements/toast/toast.component';
import { VideoService } from '../../../services/video/video.service';
@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastComponent],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;
  persona: Persona = new Persona();
  usuario: Usuario = new Usuario();
  confirmPassword: string = '';
  aceptarTerminos: boolean = false;
  showPassword: boolean = false;
  tiposDocumento: TipoDocumento[] = [];
  showTermsModal: boolean = false;

  constructor(
    private videoService: VideoService,
    private toastService: ToastService,
    private router: Router,
    private tipoDocumentoService: TipodocumentoService,
    private registroUsuario: RegistroService,
   
  ) {}
  ngAfterViewInit(): void {
    if (this.videoElementRef) {
      const video = this.videoElementRef.nativeElement;
      video.muted = this.videoService.getVideoMuted();
    }
  }
  ngOnInit(): void {
    this.cargarTiposDocumento();
    this.usuario.tipoUsuario = TipoUsuario.Cliente; 

  }

  onInput(event: any): void {
    const value = event.target.value;
    const tipoDocumentoId = this.persona.tipoDocumento.id;
  
    // Definir las expresiones regulares para cada tipo de documento
    const validaciones: { [key: number]: RegExp } = {
      1: /^[0-9]{0,8}$/, // DNI: Solo números, máximo 8 dígitos
      2: /^[A-Z]{0,2}[0-9]{0,8}$/, // Pasaporte: Letras (1-2) + números (0-8)
      3: /^[0-9]{0,10}$/, // Cédula de Identidad: Solo números, máximo 10 dígitos
      4: /^[A-Z]*[0-9]*$/, // Carnet de Extranjería: Letras seguidas de números
      5: /^[0-9]{0,9}$/, // Licencia de Conducir: Solo números, máximo 9 dígitos
      6: /^PTP[0-9]*$/, // PTP: Letras "PTP" seguidas de números
      7: /^[A-Z]*$/, // Certificado Consular: Solo letras
    };
  
    // Obtener la expresión regular según el tipo de documento seleccionado
    const regex = validaciones[tipoDocumentoId];
  
    if (regex) {
      // Filtrar solo los caracteres válidos (usar la expresión regular para el conjunto completo)
      const validChars = value.split('').map((char: string) => {
        return regex.test(char) ? char : ''; // Si el carácter es válido, se mantiene, si no, se elimina
      }).join(''); // Unir los caracteres válidos
  
      // Si el valor filtrado es diferente al valor original, significa que hubo caracteres no válidos
      if (validChars !== value) {
        this.toastService.showToast('Formato inválido para el tipo de documento seleccionado.', 'warning');
      }
  
      // Establecer el valor filtrado en el campo de entrada
      event.target.value = validChars;
  
      // Actualizar el modelo con el valor filtrado
      this.persona.documentoIdentidad = validChars;
    }
  }
  
  
  
  
  onEmailInput(event: any): void {
    const value = event.target.value;

    // Expresión regular para validar un correo electrónico básico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Verifica si el correo es válido
    if (value && !emailRegex.test(value)) {
      // Muestra un mensaje de advertencia si el correo no es válido
      this.toastService.showToast('Correo electrónico no válido. Por favor, ingresa un correo electrónico válido.', 'warning');
    }
  }
  cargarTiposDocumento(): void {
    this.tipoDocumentoService.getTiposDocumentos().subscribe(
      (response) => {
        if (response.ok) {
          this.tiposDocumento = response.body;  // Guardar los tipos de documento en el array
        }
      },
      (error) => {
        this.mostrarError('Error Obtener', error);
        
      }
    );

  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  save() {

    this.registroUsuario.createUsuario(this.usuario).subscribe({
      next: (response) => {
        this.mostrarExito('Registro exitoso', 'Bienvenido a Civitas');
    
          this.router.navigate(['/login']); // Cambia la ruta después de 3 segundos
      
      },
      error: (err) => {
        let errorMessage = 'Error Desconocido'; // Mensaje por defecto
  
        // Revisa la respuesta de error
        if (err.error && err.error.message) {
          errorMessage = err.error.message; // Accede al mensaje de error desde el cuerpo de la respuesta
        } else if (err.message) {
          errorMessage = err.message; // Si el error contiene un mensaje estándar
        }
      
        // Mostrar el error
        this.mostrarError(errorMessage, 'Intentar de nuevo');
      }
    });
  }
  openTermsModal() {
    this.showTermsModal = true;
  }

  // Cierra el modal de términos y condiciones
  closeTermsModal() {
    this.showTermsModal = false;
  }

  onSubmit(): void {
    if (!this.validarCampos()) return;

    this.usuario.persona = this.persona;
    this.save();
   
    

    // Aquí puedes hacer la lógica para enviar los datos del usuario al backend
  }

  validarCampos(): boolean {
    if (!this.persona.nombres || !this.persona.apellidoPaterno || !this.persona.apellidoMaterno || !this.persona.tipoDocumento.id || !this.persona.documentoIdentidad || !this.usuario.correo || !this.usuario.usuario || !this.usuario.contrasenia || !this.confirmPassword) {
      this.mostrarWarning('Datos No Completados', 'Intentar de nuevo');
      return false;
    }

    if (this.usuario.contrasenia !== this.confirmPassword) {
      this.mostrarError('Las contraseñas no coinciden', 'Verifica nuevamente');
      return false;
    }

    if (!this.aceptarTerminos) {
      this.mostrarError('Debes aceptar', 'Nuestros Términos');
      return false;
    }

    return true;
  }

  mostrarError(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'error');
  }

  mostrarWarning(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'warning');
  }

  mostrarExito(text1: string, text2: string): void {
    this.toastService.showToast(`${text1} - ${text2}`, 'success');
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

}
