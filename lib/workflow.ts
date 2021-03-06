import * as _ from "lodash";
import { Transition } from "./transition";
import { WorkflowState } from "./workflowState";
import { StateBase } from "./state_base";
import { Renderer } from "./renderer";
import {RenderingOptions} from "./renderingOptions";
import {WorkflowImporter} from "./workflow_importer";

export class Workflow {
    get namespace(): string {
        return this._namespace;
    }

    set namespace(value: string) {
        this._namespace = _.replace(value, RegExp(" ", "g"), '_');
    }

    public transitions: Transition[];
    private _namespace: string;

    private workflowObject: any;

    private renderer: Renderer;

    private initialized: boolean;

    constructor() {
    }

    public import(bpmnXml: string) {
        if (bpmnXml == null || bpmnXml.length === 0) {
            throw new Error ('bpmnXml must not be null');
        }

        this.transitions = new WorkflowImporter().import(bpmnXml);
    }

    public init(workflowObject: any) {
        if (this._namespace == null || this._namespace.length == 0) {
            throw new Error('namespace must not be null');
        }
        if (this.transitions == null || this.transitions.length == 0) {
            throw new Error('transitions must have elements');
        }
        if (workflowObject == null) {
            throw new Error('workflowObject must not be null');
        }

        if (workflowObject[this._namespace] == null) {
            var workflowState = new WorkflowState();

            var startTrans = _.find(this.transitions, (trans: Transition) => _.has(trans.inState, 'isStart'));
            if (startTrans != null) {
                workflowState.currentStates = [startTrans.inState];
            }

            workflowObject[this._namespace] = workflowState;
        }

        this.workflowObject = workflowObject;

        this.initialized = true;
    }

    public next() {
        if (!this.initialized) {
            throw new Error('call init() first');
        }

        var transitionsToHandle = _.filter(this.transitions, (trans: Transition) => {
            return trans.inState.tokenCount > 0;
        });


        var newWorkflowState = new WorkflowState();
        newWorkflowState.handledStates = this.workflowObject[this._namespace].handledStates;

        _.forEach(transitionsToHandle, (trans) => {
            trans.next(newWorkflowState);
        });


        newWorkflowState.handledStates = _.unionBy(newWorkflowState.handledStates, (state: StateBase) => {
            return state.uuid;
        });
        newWorkflowState.currentStates = _.unionBy(_.filter(Transition.getStatesFromTransitions(this.transitions),
            (state: StateBase) => {
                return state.tokenCount > 0;
            }), (state: StateBase) => {
            return state.uuid;
        });

        this.workflowObject[this._namespace] = newWorkflowState;

        if (this.isFinished()) {
            var endState = _.find(this.transitions, (trans: Transition) => {
                return _.has(trans.outState, 'isEnd');
            }).outState;

            endState.handled();

            if (_.find(this.workflowObject[this._namespace].handledStates, (state: StateBase) => _.has(state, 'isEnd')) == null) {
                this.workflowObject[this._namespace].handledStates.push(endState);
            }
        }
    }

    public isFinished(): boolean {
        if (!this.initialized) {
            throw new Error('call init() first');
        }

        var statesWithTokens = _.find(this.workflowObject[this._namespace].currentStates, (state: StateBase) => {
            return state.tokenCount > 0 && _.has(state, 'isEnd');
        });

        return statesWithTokens != null;
    }

    public render(container: HTMLElement, options: RenderingOptions) {
        if (!this.initialized) {
            throw new Error('call init() first');
        }

        if (this.renderer == null){
            this.renderer = new Renderer();
        }

        var o = options == null ?  new RenderingOptions() : options;

        this.renderer.render(container, this.transitions, o);
    }


}