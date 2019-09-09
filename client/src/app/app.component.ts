import { Component, OnInit } from '@angular/core';
import { AlertService } from './shared/services/alert.service';
import { AlertLevel } from './shared/model/alert-level';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DashboardService } from './shared/services/dashboard.service';

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

  constructor(
    private readonly alertService: AlertService,
    private readonly dashboardService: DashboardService,
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

  onDashboardChange(){
    this.dashboardService.persistDashboard();
  }
}
