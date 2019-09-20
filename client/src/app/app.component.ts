import { Component, OnInit } from '@angular/core';
import { AlertService } from './shared/services/alert.service';
import { AlertLevel } from './shared/model/alert-level';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DashboardService } from './shared/services/dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'menuAnimation',
      [
        transition(
          ':enter',
          [
            style({width: 0, opacity: 0}),
            animate('0.2s ease-out',
              style({width: '100%', opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({width: '100%', opacity: 1}),
            animate('0.2s ease-in',
              style({width: 0, opacity: 0}))
          ]
        )
      ]
    ),
    trigger(
      'toggleAnimation',
      [
        state(
          '1',
          style({transform: 'rotate(45deg)'})
        ),
        state(
          '0',
          style({transform: 'rotate(0)'})
        ),
        transition(
          '1 => 0',
          animate(100)
        ),
        transition(
          '0 => 1',
          animate(100)
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit {

  options: GridsterConfig = {
    displayGrid: DisplayGrid.OnDragAndResize,
    itemChangeCallback: () => this.onDashboardChange(),
    gridType: GridType.Fit,
    pushItems: true,
    swap: false,
    draggable: {
      delayStart: 0,
      enabled: true,
      ignoreContentClass: 'gridster-item-content',
      ignoreContent: false,
      dragHandleClass: 'drag-handler',
      dropOverItems: false,
    },
    resizable: {
      enabled: true
    }
  };

  isMenuOpen = false;

  alertLevel = AlertLevel.None;

  dashboard = [];

  displayImportConfiguration = false;

  base64Config = '';

  constructor(
    private readonly alertService: AlertService,
    private readonly dashboardService: DashboardService,
    private readonly messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.dashboardService.getActiveWidgets().subscribe(d => this.dashboard = d);
    this.alertService.getAlertLevel().subscribe(a => this.alertLevel = a);
  }

  addWidget(name: string) {
    this.dashboardService.addWidget(name);
    this.isMenuOpen = false;
  }

  onDashboardChange() {
    this.dashboardService.persistDashboard();
  }

  shareConfiguration() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.dashboardService.getAllSettingsAsBase64();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.messageService.add({
      severity: 'success',
      summary: 'Copied to clipboard',
      detail: 'You can now share your configuration',
    });
  }

  importConfiguration(){
      this.dashboardService.importSettingsFromBase64(this.base64Config);
      this.closeImportConfiguration();
      this.messageService.add({
        severity: 'success',
        summary: 'Configuration imported',
        detail: 'Your configuration is now loaded',
      })
  }

  closeImportConfiguration(){
    this.base64Config = '';
    this.displayImportConfiguration = false;
  }
}
