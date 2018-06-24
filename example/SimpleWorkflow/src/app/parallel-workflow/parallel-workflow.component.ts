import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {
  End,
  ParallelState,
  RenderingOptions,
  SimpleState,
  Start, Transition,
  Workflow
} from "../../../../../index";
import {StateBase} from "workflow-automation/dist/lib/state_base";

@Component({
  selector: 'app-parallel-workflow',
  templateUrl: './parallel-workflow.component.html',
  styleUrls: ['./parallel-workflow.component.scss']
})
export class ParallelWorkflowComponent implements OnInit {

  public workflowObject = {};
  private workflow: Workflow;
  private renderingOptions: RenderingOptions;
  private container: HTMLElement;

  constructor() {
  }

  ngOnInit() {
    this.renderingOptions = new RenderingOptions();
    this.renderingOptions.layoutDirection = '';

    this.workflow = new Workflow();

    var start = new Start('start');
    var end = new End('end');

    var parallel = new ParallelState('parallel', 2);

    var state1 = new SimpleState('state 1');
    var state2 = new SimpleState('state 2');


    var transition1 = new Transition('transition 1', start, parallel);
    var transition2 = new Transition('transition 2', parallel, state1);
    var transition3 = new Transition('transition 3', parallel, state2);
    var transition4 = new Transition('transition 4', state1, end);
    var transition5 = new Transition('transition 5', state2, end);

    this.workflow.transitions = [transition1, transition2, transition3, transition4, transition5];
    this.workflow.namespace = 'Parallel';
    this.workflow.init(this.workflowObject);

    this.container = document.getElementById('visParallel');
    this.workflow.render(this.container, this.renderingOptions);
  }

  next() {
    this.workflow.next();
    this.workflow.render(this.container, this.renderingOptions);
  }

  public toString(states: StateBase[]){
    if (states != null && states.length > 0) {
      return _.map(states, (item: StateBase) => item.name);
    }
  }
}
