import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertManagerService } from './alert-manager.service';

@Component({
  selector: 'app-alert-manager',
  templateUrl: './alert-manager.component.html',
  styleUrls: ['./alert-manager.component.scss'],
  providers: [AlertManagerService],
})
export class AlertManagerComponent implements OnInit {

  @Output()
  removeSelf = new EventEmitter();
  @Output()
  updateSettings = new EventEmitter<any>();
  @Input()
  settings: {
    host: string,
    refreshRate: number,
  };
  host = '';
  refreshRate = 5;


  displaySettings = false;

  alerts = [];

  constructor(private readonly alertManagerService: AlertManagerService) {
  }

  ngOnInit() {
    if (!!this.settings) {
      this.host = this.settings.host ? this.settings.host : '';
      this.refreshRate = this.settings.refreshRate ? this.settings.refreshRate : 5;
    }
    this.alertManagerService.setSettings(this.settings);
    if (this.alertManagerService.isConnected()) {
      this.getAlerts();
    }
  }

  saveSettings() {
    this.updateSettings.emit({
      host: this.host,
      refreshRate: this.refreshRate,
    });
    this.displaySettings = false;
    this.alertManagerService.setSettings({
      host: this.host,
      refreshRate: this.refreshRate,
    });
    if (this.alertManagerService.isConnected()) {
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
