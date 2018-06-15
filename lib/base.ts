import { v1 as uuid } from 'uuid';

export class Base {
    public uuid: string ;
    constructor(public name: string) {
        this.uuid = uuid();
    }
}