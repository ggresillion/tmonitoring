import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrafanaComponent } from './grafana.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GrafanaComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DialogModule,
    ChipsModule,
    FormsModule,
    ButtonModule,
    SharedModule
  ],
  exports: [
    GrafanaComponent
  ]
})
export class GrafanaModule { }
