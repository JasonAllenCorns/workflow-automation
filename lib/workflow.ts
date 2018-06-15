import * as _ from "lodash";
import { Start } from "./start";
import { End } from "./end";
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

        _.forEach(this.transitions, (trans) => {
           trans.next();
        });

        var newWorkflowState = new WorkflowState();
        newWorkflowState.currentStates = _.filter(this.getStatesFromTransitions(this.transitions),
            (state: StateBase) => {
            return state.tokenCount > 0;
        });

        this.workflowObject[this.namespace] = newWorkflowState;

    }

    public isFinished() : boolean {
        if (!this.initialized) {
            throw new Error ('call init() first');
        }

        var statesWithTokens = _.filter(this.workflowObject[this.namespace].currentStates, (state: StateBase) => {
            return  state.tokenCount > 0;
        });

        return statesWithTokens.length === 1 && statesWithTokens[0].isEnd != null;
    }

    private getStatesFromTransitions(trans: Transition[]) : StateBase[] {

        var items = _.flatMap(this.transitions, (trans: Transition) => {
            return [trans.inState, trans.outState];
        })

        return items;
    }
}