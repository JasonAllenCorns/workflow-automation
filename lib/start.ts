import {StateBase} from "./state_base";

export class Start extends StateBase {
    constructor(name: string) {
        super(name);
        this.tokenCount = 1;
    }
}