import { StateBase } from "./state_base";

export class ParallelState extends StateBase {
    constructor(public name: string, public readonly parallelTokens: number) {
        super(name);

        this.onSetTokenCount = (value: number) => {
            if (value === 1 && !this._handled) {
                return this.parallelTokens;
            }
            else {
                return value;
            }
        };
    }
}