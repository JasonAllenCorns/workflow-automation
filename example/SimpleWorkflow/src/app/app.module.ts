import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleWorkflowComponent } from './simple-workflow/simple-workflow.component';
import { ParallelWorkflowComponent } from './parallel-workflow/parallel-workflow.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleWorkflowComponent,
    ParallelWorkflowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
