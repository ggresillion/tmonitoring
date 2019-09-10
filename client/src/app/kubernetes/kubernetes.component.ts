import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { KubernetesService } from './kubernetes.service';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-kubernetes',
  templateUrl: './kubernetes.component.html',
  styleUrls: ['./kubernetes.component.scss'],
  providers: [KubernetesService]
})
export class KubernetesComponent implements OnInit {

  @Output()
  removeSelf = new EventEmitter();
  @Output()
  updateSettings = new EventEmitter<any>();
  @Input()
  settings: {
    token: string,
    host: string,
    refreshRate: number,
  };

  host = '';
  token = '';
  refreshRate = 5;

  isLoading = true;

  options = {
    legend: {
      display: false,
    },
  };

  deploymentsOptions = {
    ...this.options,
    title: {
      display: true,
      text: 'Deployments'
    }
  };

  podsOptions = {
    ...this.options,
    title: {
      display: true,
      text: 'Pods'
    }
  };

  replicaSetsOptions = {
    ...this.options,
    title: {
      display: true,
      text: 'ReplicaSets'
    }
  };

  statefulSetsOptions = {
    ...this.options,
    title: {
      display: true,
      text: 'StatefulSets'
    }
  };


  data = {
    labels: ['Running', 'Pending', 'Failed'],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#73bf69',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
  };

  deploymentsData = JSON.parse(JSON.stringify(this.data));
  podsData = JSON.parse(JSON.stringify(this.data));
  replicaSetsData = JSON.parse(JSON.stringify(this.data));
  statefulSetsData = JSON.parse(JSON.stringify(this.data));

  @ViewChild('deploymentChart') deploymentChart: UIChart;
  @ViewChild('podsChart') podsChart: UIChart;
  @ViewChild('replicaSetsChart') replicaSetsChart: UIChart;
  @ViewChild('statefulSetsChart') statefulSetsChart: UIChart;

  summary = {
    deployments: [],
    pods: [],
    replicaSets: [],
    statefulSets: [],
  };

  displaySettings = false;

  constructor(private readonly kubernetesService: KubernetesService) {
  }

  ngOnInit() {
    if (!!this.settings) {
      this.host = this.settings.host ? this.settings.host : '';
      this.token = this.settings.token ? this.settings.token : '';
      this.refreshRate = this.settings.refreshRate ? this.settings.refreshRate : 5;
    }
    this.kubernetesService.setSettings(this.settings);
    if (this.kubernetesService.isConnected()) {
      this.loadSummary();
    }
  }


  saveSettings() {
    this.updateSettings.emit({
      host: this.host,
      token: this.token,
      refreshRate: this.refreshRate,
    });
    this.displaySettings = false;
    this.kubernetesService.setSettings({
      host: this.host,
      token: this.token,
      refreshRate: this.refreshRate,
    });
    if (this.kubernetesService.isConnected()) {
      this.loadSummary();
    }
  }

  loadSummary() {
    this.kubernetesService.getSummary().subscribe((sum: any) => {
      this.summary = sum;
      const deploymentsData = [
        sum.deployments.reduce((ac, val) => ac + (val.status === 'Running' ? 1 : 0), 0),
        sum.deployments.reduce((ac, val) => ac + (val.status === 'Pending' ? 1 : 0), 0),
        sum.deployments.reduce((ac, val) => ac + (val.status === 'Failed' ? 1 : 0), 0)
      ];
      const podsData = [
        sum.pods.reduce((ac, val) => ac + (val.status === 'Running' ? 1 : 0), 0),
        sum.pods.reduce((ac, val) => ac + (val.status === 'Pending' ? 1 : 0), 0),
        sum.pods.reduce((ac, val) => ac + (val.status === 'Failed' ? 1 : 0), 0)
      ];
      const replicaSetsData = [
        sum.replicaSets.reduce((ac, val) => ac + (val.status === 'Running' ? 1 : 0), 0),
        sum.replicaSets.reduce((ac, val) => ac + (val.status === 'Pending' ? 1 : 0), 0),
        sum.replicaSets.reduce((ac, val) => ac + (val.status === 'Failed' ? 1 : 0), 0)
      ];
      if (!!sum.statefulSets) {
        const statefulSetsData = [
          sum.statefulSets.reduce((ac, val) => ac + (val.status === 'Running' ? 1 : 0), 0),
          sum.statefulSets.reduce((ac, val) => ac + (val.status === 'Pending' ? 1 : 0), 0),
          sum.statefulSets.reduce((ac, val) => ac + (val.status === 'Failed' ? 1 : 0), 0)
        ];
        if (!statefulSetsData.every((val, i) => this.statefulSetsData.datasets[0].data[i] === val)) {
          this.statefulSetsData.datasets[0].data = statefulSetsData;
          this.statefulSetsData.reinit();
        }
      }
      if (!deploymentsData.every((val, i) => this.deploymentsData.datasets[0].data[i] === val)) {
        this.deploymentsData.datasets[0].data = deploymentsData;
        this.deploymentChart.reinit();
      }
      if (!podsData.every((val, i) => this.podsData.datasets[0].data[i] === val)) {
        this.podsData.datasets[0].data = podsData;
        this.podsChart.reinit();
      }
      if (!replicaSetsData.every((val, i) => this.replicaSetsData.datasets[0].data[i] === val)) {
        this.replicaSetsData.datasets[0].data = replicaSetsData;
        this.replicaSetsChart.reinit();
      }
    });
    this.isLoading = false;
  }
}
