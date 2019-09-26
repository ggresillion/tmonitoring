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

  graphs: { name: string, snippet: SafeHtml }[] = [];

  newGraph = {
    name: '',
    snippet: '',
  };

  constructor(private readonly dashboardService: DashboardService,
              private readonly sanitizer: DomSanitizer) {
    super(dashboardService);
  }

  ngOnInit() {
    this.getSettings();
    this.settings = {graphs: [], ...this.settings};
    const jGraphs = this.settings.graphs;
    this.graphs = jGraphs.map(g => ({
      name: g.name,
      snippet: this.sanitizer.bypassSecurityTrustHtml(g.snippet)
    }));
    this.setIsReady();
  }

  setIsReady() {
    this.isReady = this.graphs.length > 0;
  }

  addGraph() {
    this.graphs.push({
      name: this.newGraph.name,
      snippet: this.sanitizer.bypassSecurityTrustHtml(this.newGraph.snippet),
    });
    this.settings.graphs = this.graphs.map(g => ({
      name: g.name,
      snippet: g.snippet['changingThisBreaksApplicationSecurity'],
    }));
    this.setIsReady();
    this.newGraph = {name: '', snippet: ''};
  }

  deleteGraph(i: number) {
    this.graphs.splice(i, 1);
    this.settings.graphs.splice(i, 1);
    this.setIsReady();
  }
}
