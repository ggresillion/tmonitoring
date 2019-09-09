import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GitlabModule } from './gitlab/gitlab.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { KubernetesModule } from './kubernetes/kubernetes.module';
import { GrafanaModule } from './grafana/grafana.module';
import { AlertManagerModule } from './alert-manager/alert-manager.module';
import { SharedModule } from './shared/shared.module';
import { MenubarModule } from 'primeng/menubar';
import { GridsterModule } from 'angular-gridster2';
import { ButtonModule } from 'primeng/button';
import { DropdownModule, TooltipModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GitlabModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KubernetesModule,
    GrafanaModule,
    AlertManagerModule,
    SharedModule,
    MenubarModule,
    GridsterModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
