import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SonarqubeService {

  private token: string;
  private host: string;
  private projectKey: string;
  private refreshDelay = 5000;

  constructor(private readonly http: HttpClient) {
  }

  setSettings(settings: any) {
    if (!settings) {
      return;
    }
    this.token = settings.token;
    this.host = settings.host;
    this.projectKey = settings.projectKey;
    this.refreshDelay = settings.refreshDelay ? settings.refreshDelay * 1000 : 5000;
  }

  getMeasures() {
    return this.http.get<any>(
      environment.api
      + '/sonarqube/' + this.projectKey
      + '/measures?host=' + this.host
      + '&token=' + this.token);
  }

}
