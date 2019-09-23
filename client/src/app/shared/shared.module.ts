import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './services/alert.service';
import { WidgetComponent } from './widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from './services/dashboard.service';
import { TruncatePipe } from './pipes/truncate.pipe';

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
    WidgetComponent,
    TruncatePipe
  ],
  declarations: [WidgetComponent, TruncatePipe]
})
export class SharedModule {
}
