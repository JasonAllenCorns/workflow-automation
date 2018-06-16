import { Base } from "./base";

export class StateBase extends Base {
    protected _handled: boolean;

    public reset() {
        this._handled = false;
    }

    public handled() {
        this._handled = true;
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