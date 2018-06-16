import * as _ from "lodash";
import { Transition } from "./transition";
import { WorkflowState } from "./workflowState";
import { StateBase } from "./state_base";

export class Workflow {
    public transitions: Transition[];
    public namespace: string;

    private workflowObject: any;

    private initialized: boolean;

    constructor() {
    }


    public init(workflowObject: any) {
        if (this.namespace == null || this.namespace.length == 0) {
            throw new Error('namespace must not be null');
        }
        if (this.transitions == null || this.transitions.length == 0) {
            throw new Error('transitions must have elements');
        }
        if (workflowObject == null) {
            throw new Error('workflowObject must not be null');
        }

        if (workflowObject[this.namespace] == null) {
            var workflowState = new WorkflowState();
            workflowObject[this.namespace] = workflowState;
        }

        this.workflowObject = workflowObject;

        this.initialized = true;
    }

    public next() {
        if (!this.initialized) {
            throw new Error ('call init() first');
        }

        var transitionsToHandle = _.filter(this.transitions, (trans: Transition) => {
           return trans.inState.tokenCount > 0;
        });


        var newWorkflowState = new WorkflowState();
        newWorkflowState.handledStates = this.workflowObject[this.namespace].handledStates;

        _.forEach(transitionsToHandle, (trans) => {
           trans.next(newWorkflowState);
        });


        newWorkflowState.handledStates = _.unionBy(newWorkflowState.handledStates, (state: StateBase) => {
            return state.uuid;
        });
        newWorkflowState.currentStates = _.unionBy(_.filter(this.getStatesFromTransitions(this.transitions),
            (state: StateBase) => {
            return state.tokenCount > 0;
        }), (state: StateBase) => {
            return state.uuid
        });

        this.workflowObject[this.namespace] = newWorkflowState;

        if (this.isFinished()){
            var endState = _.find(this.transitions, (trans: Transition) => {
                return _.has(trans.outState,'isEnd');
            }).outState;
            endState.handled();
            this.workflowObject[this.namespace].handledStates.push(endState);
        }
    }

    public isFinished() : boolean {
        if (!this.initialized) {
            throw new Error ('call init() first');
        }

        var statesWithTokens = _.find(this.workflowObject[this.namespace].currentStates, (state: StateBase) => {
            return  state.tokenCount > 0 && _.has(state,'isEnd');
        });

        return statesWithTokens != null;
    }

    private getStatesFromTransitions(trans: Transition[]) : StateBase[] {

        var items = _.flatMap(this.transitions, (trans: Transition) => {
            return [trans.inState, trans.outState];
        })

        return items;
    }
}