import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardVisible = new BehaviorSubject<boolean>(false); // Estado inicial: oculto
  dashboardVisible$ = this.dashboardVisible.asObservable();

  toggleDashboard() {
    this.dashboardVisible.next(!this.dashboardVisible.value);
  }
}
