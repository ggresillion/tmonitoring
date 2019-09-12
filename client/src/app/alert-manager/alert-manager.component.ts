import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertManagerService } from './alert-manager.service';
import { WidgetComponent } from '../shared/widget/widget.component';
import { DashboardService } from '../shared/services/dashboard.service';

@Component({
  selector: 'app-alert-manager',
  templateUrl: './alert-manager.component.html',
  styleUrls: ['./alert-manager.component.scss'],
  providers: [AlertManagerService],
})
export class AlertManagerComponent extends WidgetComponent implements OnInit {

  alerts = [];

  constructor(private readonly dashboardService: DashboardService,
              private readonly alertManagerService: AlertManagerService) {
    super(dashboardService);
  }

  ngOnInit() {
    this.settings = {
      host: '',
      refreshRate: 5,
    };
    this.getSettings();
    this.onSettingsChange();
  }

  onSettingsChange() {
    if (this.settings.host != '') {
      this.isReady = true;
      this.alertManagerService.setSettings(this.settings);
      this.getAlerts();
    }
  }

  getAlerts() {
    this.alertManagerService.getAlerts().subscribe(alerts => this.alerts = alerts);
  }

  getLabels(alert) {
    return Object.keys(alert.labels).map(key => ({key, value: alert.labels[key]}));
  }

  getAnnotations(alert) {
    return Object.keys(alert.annotations).map(key => ({key, value: alert.annotations[key]}));
  }

}
