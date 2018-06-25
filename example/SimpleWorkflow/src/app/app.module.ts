import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleWorkflowComponent } from './simple-workflow/simple-workflow.component';
import { ParallelWorkflowComponent } from './parallel-workflow/parallel-workflow.component';
import { CollectWorkflowComponent } from './collect-workflow/collect-workflow.component';
import { SimpleWorkflowImportComponent } from './simple-workflow-import/simple-workflow-import.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleWorkflowComponent,
    ParallelWorkflowComponent,
    CollectWorkflowComponent,
    SimpleWorkflowImportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
