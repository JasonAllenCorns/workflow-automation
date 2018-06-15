import { StateBase } from "./state_base";
import { Base } from "./base";

export class Transition extends Base {
    public inState: StateBase;
    public outState: StateBase;

    public next() {
        if (this.inState == null) {
            throw new Error();
        }
        if (this.outState == null) {
            throw new Error();
        }

        if (this.inState.tokenCount > 0) {

            this.inState.tokenCount--;
            this.outState.tokenCount++;

        }

        console.log(`in (${this.inState.name}): ${this.inState.tokenCount}`);
        console.log(`out (${this.outState.name}): ${this.outState.tokenCount}`);
    }
}