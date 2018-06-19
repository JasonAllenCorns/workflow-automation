import { StateBase } from "./state_base";

export class Start extends StateBase {
    public isStart: boolean = true;

    constructor(name: string) {
        super(name);
        this.tokenCount = 1;
        this.isCurrent = true;
    }
}