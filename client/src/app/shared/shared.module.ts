import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './services/alert.service';
import { WidgetComponent } from './widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  providers: [
    AlertService,
    DashboardService,
  ],
  imports: [
    CommonModule,
    ButtonModule,
  ],
  exports: [
    WidgetComponent
  ],
  declarations: [WidgetComponent]
})
export class SharedModule {
}
