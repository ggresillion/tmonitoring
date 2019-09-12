import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from '../shared/widget/widget.component';
import { SonarqubeService } from './sonarqube.service';
import { DashboardService } from '../shared/services/dashboard.service';
import { Measures } from './measures';

@Component({
  selector: 'app-sonarqube',
  templateUrl: './sonarqube.component.html',
  styleUrls: ['./sonarqube.component.scss']
})
export class SonarqubeComponent extends WidgetComponent implements OnInit {

  measures: Measures;

  constructor(private readonly dashboardService: DashboardService,
              private readonly sonarqubeService: SonarqubeService) {
    super(dashboardService);
  }

  ngOnInit() {
    this.settings = {
      host: '',
      token: '',
      projectKey: '',
      refreshRate: 5,
    };
    this.getSettings();
    this.onSettingsChange();
  }

  onSettingsChange() {
    if (this.settings.host != '') {
      this.isReady = true;
      this.sonarqubeService.setSettings(this.settings);
      this.getMeasures();
    }
  }

  getMeasures() {
    this.sonarqubeService.getMeasures().subscribe(m => this.measures = m);
  }
}
