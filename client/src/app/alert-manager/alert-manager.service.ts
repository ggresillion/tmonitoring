import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { AlertService } from '../shared/services/alert.service';
import { AlertLevel } from '../shared/model/alert-level';
import { timer } from 'rxjs';
import { flatMap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertManagerService {

  private host: string;
  private refreshDelay = 5000;

  constructor(
    private readonly http: HttpClient,
    private readonly alertService: AlertService
  ) {
  }

  isConnected() {
    return !!this.host;
  }

  setSettings(settings: any) {
    if (!settings) {
      return;
    }
    this.host = settings.host;
    this.refreshDelay = settings.refreshDelay ? settings.refreshDelay * 1000 : 5000;
  }

  getAlerts() {
    return timer(0, this.refreshDelay).pipe(flatMap(() =>
      this.http.get<any>(environment.api + '/alert-manager/alerts?host='+this.host)
        .pipe(map(res => res.data))
        .pipe(tap(res => {
          if (res.length !== 0) {
            this.alertService.setAlertLevel(AlertLevel.Danger);
          } else {
            this.alertService.setAlertLevel(AlertLevel.None);
          }
        }))
    ));
  }
}
