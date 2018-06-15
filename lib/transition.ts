
import ee from 'event-emitter'
import { StateBase } from "./state_base";
import { Base } from "./base";

export class Transition extends Base {
    public static readonly ON_EXIT_EVENT_NAME = 'OnExit';
    public static readonly ON_ENTER_EVENT_NAME = 'OnEnter';

    public inState: StateBase;
    public outState: StateBase;

    public emitter;

    constructor(name: string) {
        super(name);

        this.emitter = ee(this);
    }

    public next() {
        if (this.inState == null) {
            throw new Error();
        }
        if (this.outState == null) {
            throw new Error();
        }

        if (this.inState.tokenCount > 0) {
            this.emitter.emit(Transition.ON_EXIT_EVENT_NAME, this.inState);

            this.inState.tokenCount--;
            this.outState.tokenCount++;

            this.emitter.emit(Transition.ON_ENTER_EVENT_NAME, this.outState);
        }

        console.log(`in (${this.inState.name}): ${this.inState.tokenCount}`);
        console.log(`out (${this.outState.name}): ${this.outState.tokenCount}`);
    }
}