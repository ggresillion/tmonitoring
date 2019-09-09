import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './services/alert.service';

@NgModule({
  providers: [
    AlertService
  ],
  imports: [
    CommonModule,
  ]
})
export class SharedModule {
}
