import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GitlabComponent} from "./gitlab.component";
import {CardModule} from "primeng/card";
import { InputTextModule, SplitButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
      GitlabComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    SplitButtonModule,
    FormsModule,
    InputTextModule,
    SharedModule
  ],
  exports: [
      GitlabComponent
  ]
})
export class GitlabModule { }
