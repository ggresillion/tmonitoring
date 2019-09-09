import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertManagerComponent } from './alert-manager.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';

@NgModule({
  declarations: [AlertManagerComponent],
  exports: [
    AlertManagerComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule
  ]
})
export class AlertManagerModule { }
