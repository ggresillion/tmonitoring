import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pipeline } from './pipeline';
import { timer } from 'rxjs';
import { flatMap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  private token: string;
  private host: string;
  private projectId: number;
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
    this.projectId = settings.projectId;
    this.refreshDelay = settings.refreshDelay ? settings.refreshDelay * 1000 : 5000;
  }

  getAllPipelines() {
    return timer(0, this.refreshDelay).pipe(flatMap(() =>
      this.http.get<Pipeline[]>(
        environment.api +
        '/gitlab/pipelines?host=' + this.host +
        '&token=' + this.token
        + '&projectId=' + this.projectId)
    ));
  }
}
