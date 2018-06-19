import { StateBase } from "./state_base";

export class ParallelState extends StateBase {
    public isParallel: boolean = true;

    constructor(public name: string, public readonly parallelTokens: number) {
        super(name);

        this.onSetTokenCount = (value: number) => {
            if (value === 1 && !this.isDone) {
                return this.parallelTokens;
            }
            else {
                return value;
            }
        };
    }
}