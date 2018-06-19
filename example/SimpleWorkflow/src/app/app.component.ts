import { Component, OnInit } from '@angular/core';
import { Workflow } from "workflow-automation/dist";
import { Start } from "workflow-automation/dist";
import { End } from "workflow-automation/dist";
import { Transition } from "workflow-automation/dist";
import { SimpleState } from "workflow-automation/dist";
import { WorkflowState } from "workflow-automation/dist";
import * as _ from 'lodash';
import { StateBase } from "workflow-automation/dist/state_base";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Simple Workflow';
  currentState;
  finishedStates;
  workflow: Workflow;
  workflowObject = {};

  ngOnInit(): void {
    this.workflow = new Workflow();

    var start = new Start('start');
    var end = new End('end');

    var state1 = new SimpleState('state 1');
    var state2 = new SimpleState('state 2');

    var transition1 = new Transition('transition 1', start, state1);
    var transition2 = new Transition('transition 2', state1, state2);
    var transition3 = new Transition('transition 3', state2, end);
    var transition4 = new Transition('transition 3', end, start);

    this.workflow.transitions = [transition1, transition2, transition3, transition4];
    this.workflow.namespace = 'simple_workflow';
    this.workflow.init(this.workflowObject);
    this.setCurrentState();

    var container = document.getElementById('visualization');
    this.workflow.render(container);
  }

  next() {
    this.workflow.next();

    this.setCurrentState();
    this.setHandledStates();

    var container = document.getElementById('visualization');
    this.workflow.render(container);
  }

  private setHandledStates() {
    var handledStates = (<WorkflowState>this.workflowObject['simple_workflow']).handledStates;
    if (handledStates != null && handledStates.length > 0) {
      this.finishedStates = _.map(handledStates, (item: StateBase) => item.name);
    }
  }

  private setCurrentState() {
    var currentStates = (<WorkflowState>this.workflowObject['simple_workflow']).currentStates;
    if (currentStates != null && currentStates.length === 1) {
      this.currentState = currentStates[0].name;
    }
  }
}
