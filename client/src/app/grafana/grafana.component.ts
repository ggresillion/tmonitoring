import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DashboardService } from '../shared/services/dashboard.service';

@Component({
  selector: 'app-grafana',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss'],
})
export class GrafanaComponent implements OnInit {

  @Output()
  removeSelf = new EventEmitter<void>();
  @Output()
  updateSettings = new EventEmitter<any>();
  @Input()
  settings: {
    graphs: string[],
  };

  displayAddGraph = false;
  isEditMode = false;

  graphs: SafeHtml[] = [];

  newGraphSnippet = '';

  constructor(
    private readonly sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    if (!this.settings || !this.settings.graphs) {
      this.updateSettings.emit({graphs: []});
      this.settings = {graphs: []};
    }
    const jGraphs = this.settings.graphs;
    this.graphs = jGraphs.map(g => this.sanitizer.bypassSecurityTrustHtml(g));
  }

  closeModal() {
    this.displayAddGraph = false;
    this.newGraphSnippet = '';
  }

  addGraph() {
    this.graphs.push(this.sanitizer.bypassSecurityTrustHtml(this.newGraphSnippet));
    this.settings.graphs = this.graphs.map(g => g['changingThisBreaksApplicationSecurity']);
    this.updateSettings.emit(this.settings);
    this.closeModal();
  }
}
