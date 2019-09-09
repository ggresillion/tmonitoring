import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertLevel } from '../model/alert-level';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertLevelSubject = new BehaviorSubject(AlertLevel.None);

  constructor() {
  }

  setAlertLevel(alertLevel: AlertLevel) {
    this.alertLevelSubject.next(alertLevel);
  }

  getAlertLevel(): Observable<AlertLevel> {
    return this.alertLevelSubject.asObservable();
  }
}
