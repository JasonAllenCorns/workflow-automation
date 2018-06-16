import { StateBase } from "./state_base";

export class WorkflowState {
    public currentStates: StateBase[];
    public handledStates: StateBase[];

    constructor() {
        this.currentStates = [];
        this.handledStates = [];
    }
}