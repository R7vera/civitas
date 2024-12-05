import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// Definir el tipo para los datos del toast
export interface ToastData {
  message?: string;
  type?: 'success' | 'error' | 'warning'; // Puedes añadir otros tipos si lo necesitas
  isLoading?: boolean;  // Aquí agregamos la propiedad isLoading

}


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastData>({}); // Observable de tipo ToastData
  toast$ = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastSubject.next({ message, type });
  }

  hideToast() {
    this.toastSubject.next({});
  }
}