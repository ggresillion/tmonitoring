import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { Pipeline } from './pipeline';

@Component({
  selector: 'app-gitlab',
  templateUrl: './gitlab.component.html',
  styleUrls: ['./gitlab.component.scss'],
  providers: [GitlabService],
})
export class GitlabComponent implements OnInit {

  @Output()
  removeSelf = new EventEmitter();
  @Output()
  updateSettings = new EventEmitter<any>();
  @Input()
  settings: {
    host: string,
    token: string,
    refreshRate: number,
    projectId: number,
  };
  host = '';
  token = '';
  refreshRate = 5;
  projectId = 0;

  displaySettings = false;

  pipelines: Pipeline[] = [];

  constructor(private readonly gitlabService: GitlabService) {
  }

  ngOnInit() {
    if (!!this.settings) {
      this.host = this.settings.host ? this.settings.host : '';
      this.token = this.settings.token ? this.settings.token : '';
      this.projectId = this.settings.projectId ? this.settings.projectId : 0;
      this.refreshRate = this.settings.refreshRate ? this.settings.refreshRate : 5;
    }
    this.gitlabService.setSettings(this.settings);
    if (this.gitlabService.isConnected()) {
      this.loadPipelines();
    }
  }

  saveSettings() {
    this.updateSettings.emit({
      host: this.host,
      token: this.token,
      projectId: this.projectId,
      refreshRate: this.refreshRate,
    });
    this.displaySettings = false;
    this.gitlabService.setSettings({
      host: this.host,
      token: this.token,
      projectId: this.projectId,
      refreshRate: this.refreshRate,
    });
    if (this.gitlabService.isConnected()) {
      this.loadPipelines();
    }
  }

  loadPipelines() {
    this.gitlabService.getAllPipelines().subscribe(pip => this.pipelines = pip);
  }
}
