import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private videoMuted: boolean = true; // El video estará silenciado por defecto

  // Método para obtener el estado de mute
  getVideoMuted(): boolean {
    return this.videoMuted;
  }


}
