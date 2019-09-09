import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { timer } from 'rxjs';
import { flatMap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class KubernetesService {

  private token: string;
  private host: string;
  private refreshDelay = 5000;

  constructor(private readonly http: HttpClient) {
  }

  isConnected() {
    return !!this.token;
  }

  setSettings(settings: any) {
    if (!settings) {
      return;
    }
    this.token = settings.token;
    this.host = settings.host;
    this.refreshDelay = settings.refreshDelay ? settings.refreshDelay * 1000 : 5000;
  }

  getSummary() {
    return timer(0, this.refreshDelay).pipe(flatMap(() =>
      this.http.get(
        environment.api
        + '/kubernetes/iboost-preprod/summary?token='
        + this.token + '&host=' + this.host
      )
    ));
  }
}
