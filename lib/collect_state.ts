import { SimpleState } from "./simple_state";

export class CollectState extends SimpleState {
    public isCollectState: boolean = true;

    constructor(name: string, public collectTokens: number) {
        super(name);
    }
}