import { Component, OnInit } from '@angular/core';
import {End, RenderingOptions, SimpleState, Start, Transition, Workflow, WorkflowState} from "workflow-automation";
import * as _ from "lodash";
import {StateBase} from "workflow-automation/dist/lib/state_base";

@Component({
  selector: 'app-simple-workflow',
  templateUrl: './simple-workflow.component.html',
  styleUrls: ['./simple-workflow.component.scss']
})
export class SimpleWorkflowComponent implements OnInit {

  currentState;
  finishedStates;
  workflow: Workflow;
  workflowObject = {};

  renderingOptions: RenderingOptions;

  constructor() { }

  ngOnInit() {
    this.renderingOptions = new RenderingOptions();

    this.workflow = new Workflow();

    var start = new Start('start');
    var end = new End('end');

    var state1 = new SimpleState('state 1');
    var state2 = new SimpleState('state 2');

    var transition1 = new Transition('transition 1', start, state1);
    var transition2 = new Transition('transition 2', state1, state2);
    var transition3 = new Transition('transition 3', state2, end);

    this.workflow.transitions = [transition1, transition2, transition3];
    this.workflow.namespace = 'simple_workflow';
    this.workflow.init(this.workflowObject);
    this.setCurrentState();

    var container = document.getElementById('visualization');
    this.workflow.render(container, this.renderingOptions);
  }

  next() {
    this.workflow.next();

    this.setCurrentState();
    this.setHandledStates();

    var container = document.getElementById('visualization');
    this.workflow.render(container, this.renderingOptions);
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
