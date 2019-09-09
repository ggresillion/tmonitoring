import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GitlabComponent} from "./gitlab.component";
import {CardModule} from "primeng/card";
import { InputTextModule, SplitButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
      GitlabComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    SplitButtonModule,
    FormsModule,
    InputTextModule
  ],
  exports: [
      GitlabComponent
  ]
})
export class GitlabModule { }
