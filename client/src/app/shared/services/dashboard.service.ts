import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  nextId = 1;

  dashboardSubject = new BehaviorSubject([]);

  constructor() {
    const sDashboard = localStorage.getItem('dashboard');
    if(!!sDashboard){
      const dashboard = JSON.parse(sDashboard);
      this.dashboardSubject.next(dashboard);
      this.nextId = Math.max(dashboard.map(w => w.id));
    }
  }

  addWidget(name: string) {
    const d = this.dashboardSubject.value;
    d.push({x: 0, y: 0, cols: 2, rows: 2, component: name, id: this.nextId});
    this.updateDashboard(d);
    this.nextId++;
  }

  getActiveWidgets() {
    return this.dashboardSubject.asObservable();
  }

  updateDashboard(dashboard) {
    this.dashboardSubject.next(dashboard);
    this.persistDashboard();
  }

  persistDashboard(){
    localStorage.setItem('dashboard', JSON.stringify(this.dashboardSubject.value));
  }

  removeWidget(index: number) {
    const d = this.dashboardSubject.value;
    console.log(d)
    d.splice(index, 1);
    this.updateDashboard(d);
  }

  updateSettings(index: number, settings: any){
    console.log(settings)
    const d = this.dashboardSubject.value;
    d[index].settings = settings;
    this.updateDashboard(d);
  }
}
