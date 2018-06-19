import ee from 'event-emitter';
import * as _ from "lodash";
import { StateBase } from "./state_base";
import { Base } from "./base";
import { WorkflowState } from "./workflowState";
import { CollectState } from "./collect_state";

export class Transition extends Base {
    public static readonly ON_EXIT_EVENT_NAME = 'OnExit';
    public static readonly ON_ENTER_EVENT_NAME = 'OnEnter';

    public inState: StateBase;
    public outState: StateBase;
    public canTransition: (state: StateBase) => boolean;

    public emitter;

    constructor(name: string, inState: StateBase = null, outState: StateBase = null) {
        super(name);
        this.inState = inState;
        this.outState = outState;
        this.emitter = ee(this);
    }

    public next(workflowState: WorkflowState) {
        if (this.inState == null) {
            throw new Error();
        }
        if (this.outState == null) {
            throw new Error();
        }

        if (this.inState.tokenCount > 0 && (this.canTransition == null || this.canTransition(this.inState))) {

            if (_.has(this.inState, 'isCollectState')) {
                if ((<CollectState>this.inState).collectTokens < this.inState.tokenCount) {
                    return;
                }

                this.inState.tokenCount = 1;
            }

            this.emitter.emit(Transition.ON_EXIT_EVENT_NAME, this.inState);

            this.inState.handled();
            this.inState.tokenCount--;
            this.inState.isCurrent = false;

            this.outState.reset();
            this.outState.tokenCount++;
            this.outState.isCurrent = true;
            
            workflowState.handledStates.push(this.inState);

            this.emitter.emit(Transition.ON_ENTER_EVENT_NAME, this.outState);

        }
    }

    public static getStatesFromTransitions(transitions: Transition[]): StateBase[] {

        var items = _.flatMap(transitions, (trans: Transition) => {
            return [trans.inState, trans.outState];
        });

        return items;
    }
}