import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SonarqubeComponent } from './sonarqube.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [SonarqubeComponent],
  exports: [
    SonarqubeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ButtonModule
  ]
})
export class SonarqubeModule { }
