import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent {

  @Input()
  settings?: any;
  @Input()
  title?: string;
  @Input()
  subtitle?: string;
  @Input()
  id: number;
  @Input()
  isReady: boolean = false;

  @Output()
  settingsChange? = new EventEmitter<any>();

  displaySettings = false;

  constructor(private readonly ds: DashboardService) {
  }

  getSettings() {
    this.settings = {...this.settings, ...this.ds.getSettings(this.id)};
  }

  saveSettings() {
    this.ds.updateSettings(this.id, this.settings);
    this.displaySettings = false;
    this.settingsChange.emit();
  }

  closeSettings() {
    this.displaySettings = false;
  }

  removeSelf() {
    this.ds.removeWidget(this.id);
  }
}
