import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DashboardService } from '../shared/services/dashboard.service';
import { WidgetComponent } from '../shared/widget/widget.component';

@Component({
  selector: 'app-grafana',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss'],
})
export class GrafanaComponent extends WidgetComponent implements OnInit {

  graphs: SafeHtml[] = [];

  newGraphSnippet = '';

  constructor(private readonly dashboardService: DashboardService,
              private readonly sanitizer: DomSanitizer) {
    super(dashboardService);
  }

  ngOnInit() {
    this.settings = {graphs: []};
    this.getSettings();
    const jGraphs = this.settings.graphs;
    this.graphs = jGraphs.map(g => this.sanitizer.bypassSecurityTrustHtml(g));
    this.isReady = true;
  }

  addGraph() {
    this.graphs.push(this.sanitizer.bypassSecurityTrustHtml(this.newGraphSnippet));
    this.settings.graphs = this.graphs.map(g => g['changingThisBreaksApplicationSecurity']);
  }
}
