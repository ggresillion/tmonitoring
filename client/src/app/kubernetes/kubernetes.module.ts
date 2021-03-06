import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubernetesComponent } from './kubernetes.component';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    KubernetesComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    SharedModule
  ],
  providers: [],
  exports: [
    KubernetesComponent
  ]
})
export class KubernetesModule {
}
