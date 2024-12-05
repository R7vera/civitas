import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService, ToastData } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toastData: ToastData = {};
  isHiding = false;

  constructor(public toastService: ToastService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe((data: ToastData) => {
      this.toastData = data;

      if (this.toastData.message) {
        this.startLoadingBar();
      }
    });
  }

  startLoadingBar() {
    this.toastData.isLoading = true;
    setTimeout(() => {
      this.toastData.isLoading = false;
      this.startHideToast();
    }, 5000);
  }

  startHideToast() {
    this.isHiding = true;
    setTimeout(() => {
      this.toastService.hideToast();
      this.isHiding = false;
    }, 1000);
  }

  onTransitionEnd() {
    if (this.isHiding) {
      this.toastService.hideToast();
    }
  }

  get bgColor() {
    switch (this.toastData.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-800';
    }
  }

  get loadingBarColor() {
    switch (this.toastData.type) {
      case 'success':
        return 'bg-green-700';
      case 'error':
        return 'bg-red-700';
      case 'warning':
        return 'bg-yellow-700';
      default:
        return 'bg-gray-600';
    }
  }

  get iconSvg(): SafeHtml {
    let svg = '';
    switch (this.toastData.type) {
      case 'success':
        svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
               </svg>`;
        break;
      case 'error':
        svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
               </svg>`;
        break;
      case 'warning':
        svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856C18.68 21 20 19.683 20 18.117V5.883C20 4.317 18.683 3 17.117 3H6.883C5.317 3 4 4.317 4 5.883v12.234C4 19.683 5.317 21 6.883 21z"></path>
               </svg>`;
        break;
      default:
        svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6"></path>
               </svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
