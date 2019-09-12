import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { Pipeline } from './pipeline';
import { WidgetComponent } from '../shared/widget/widget.component';
import { DashboardService } from '../shared/services/dashboard.service';

@Component({
  selector: 'app-gitlab',
  templateUrl: './gitlab.component.html',
  styleUrls: ['./gitlab.component.scss'],
  providers: [GitlabService],
})
export class GitlabComponent extends WidgetComponent implements OnInit {

  pipelines: Pipeline[] = [];

  constructor(private readonly dashboardService: DashboardService,
              private readonly gitlabService: GitlabService) {
    super(dashboardService);
  }

  ngOnInit() {
    this.settings = {
      host: '',
      token: '',
      refreshRate: 5,
      projectId: 0,
    };
    this.getSettings();
    this.onSettingsChange();
  }

  onSettingsChange() {
    if (this.settings.host != '') {
      this.isReady = true;
      this.gitlabService.setSettings(this.settings);
      this.getPipelines();
    }
  }

  getPipelines() {
    this.gitlabService.getAllPipelines().subscribe(pip => this.pipelines = pip);
  }
}
