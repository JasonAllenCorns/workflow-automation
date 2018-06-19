import { Base } from "./base";

export class StateBase extends Base {
    public isDone: boolean;
    public isCurrent: boolean;

    public handled() {
        this.isDone = true;
    }

    public reset() {
        this.isCurrent = false;
    }

    get tokenCount(): number {
        return this._tokenCount;
    }

    set tokenCount(value: number) {
        if (this.onSetTokenCount != null) {
            this._tokenCount = this.onSetTokenCount(value);
        }
        else {
            this._tokenCount = value;
        }
    }

    private _tokenCount: number = 0;

    protected onSetTokenCount: (value: number) => number;
}