import {Component, OnInit} from '@angular/core';
import {
  CollectState,
  End,
  ParallelState,
  RenderingOptions,
  SimpleState,
  Start,
  Transition,
  Workflow
} from "../../../../../index";
import * as _ from "lodash";
import {StateBase} from "workflow-automation/dist/lib/state_base";

@Component({
  selector: 'app-collect-workflow',
  templateUrl: './collect-workflow.component.html',
  styleUrls: ['./collect-workflow.component.scss']
})
export class CollectWorkflowComponent implements OnInit {

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
    var state3 = new SimpleState('state 3');
    var state4 = new SimpleState('state 4');

    var collect = new CollectState('collect', 2);

    var transition1 = new Transition('transition 1', start, parallel);
    var transition2 = new Transition('transition 2', parallel, state1);
    var transition3 = new Transition('transition 3', parallel, state2);
    var transition4 = new Transition('transition 4', state2, state3);
    var transition6 = new Transition('transition 6', state3, state4);
    var transition5 = new Transition('transition 5', state1, collect);
    var transition7 = new Transition('transition 7', state4, collect);
    var transition8 = new Transition('transition 7', collect, end);


    this.workflow.transitions = [
      transition1,
      transition2,
      transition3,
      transition4,
      transition5,
      transition6,
      transition7,
      transition8
    ];
    this.workflow.namespace = 'Collect';
    this.workflow.init(this.workflowObject);


    this.container = document.getElementById('visCollect');
    this.workflow.render(this.container, this.renderingOptions);
  }

  next() {
    this.workflow.next();
    this.workflow.render(this.container, this.renderingOptions);
  }

  public toString(states: StateBase[]) {
    if (states != null && states.length > 0) {
      return _.map(states, (item: StateBase) => item.name);
    }
  }
}
